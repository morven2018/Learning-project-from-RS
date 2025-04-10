import type { ICar, ICarRaceParameters } from '../lib/types/api-interfaces';
import type {
  IElementParameters,
  ICarState,
  IAnimationState,
  IRaceCreator,
} from '../lib/types/interfaces';
import ElementCreator from './element-creator';
import finish from '../assets/images/finish.png';
import body from '../assets/images/car-body.svg';
import wheels from '../assets/images/wheel.svg';
import fail from '../assets/images/fail.png';
import { Car, Colors, Track } from '../lib/types/enums';
import type ListNodeCreator from './list-node';
import ApiClient from '../lib/utils/api-client';
import winner from '../assets/images/win.png';

const delay = 50_000;
const toSeconds = 1000;
const carWidthToSmallPages = 0.2;
const doublePadding = 2;
const widthHeightCoefficient = 0.66;
const delayY = 0.85;
const correctionX = 0.7;
const colorTransitionalPoint = 0.5;
const actualDash = 2;
const numberAfterPoint = 2;
const delta = 0.01;
const rightWheelCorrection = 0.8;
const leftWheelCorrection = 0.25;
const half = 2;
const deltaY = 5;
const round = 2;

export default class RaceCreator
  extends ElementCreator
  implements IRaceCreator
{
  private static winnerId: number | undefined = undefined;
  public car: ICarState = {
    position: 0,
    assets: {
      body: undefined,
      wheels: undefined,
      color: '',
    },
    state: {
      speed: Car.DefaultCarSpeed,
      isMoving: false,
    },
  };
  public context: CanvasRenderingContext2D | undefined = undefined;
  public raceStartTime: number = 0;
  public raceDuration: number = 1;
  private finishImage: HTMLImageElement | undefined = undefined;
  private stopImage: HTMLImageElement | undefined = undefined;
  private showStopImageUntil: number = 0;
  private isStopImageLoading: boolean = false;
  private parent: ListNodeCreator | undefined = undefined;

  private isEngineBroken: boolean = false;

  private currentColor: string = '#000000';
  private isStarting: boolean = false;
  private isRaceMode: boolean = false;

  private animationState: IAnimationState = {
    id: undefined,
    isRunning: false,
    wheelAngle: 0,
  };

  constructor(
    parameters: IElementParameters,
    elementInfo?: ICar,
    parent?: ListNodeCreator
  ) {
    super(parameters);
    this.createElement(parameters, elementInfo);
    if (parent) this.parent = parent;
    if (elementInfo?.color) {
      this.currentColor = elementInfo.color;
    }
  }

  public static resetWinner(): void {
    RaceCreator.winnerId = undefined;
  }

  private static async loadImage(source: string): Promise<HTMLImageElement> {
    return new Promise((resolve) => {
      const img = new Image();
      img.src = source;
      img.addEventListener('load', () => resolve(img));
    });
  }

  private static async loadBody(color: string): Promise<HTMLImageElement> {
    const response = await fetch(body);
    let svgText = await response.text();

    svgText = svgText.replaceAll(/fill="#[^"]*"/g, `fill="${color}"`);
    svgText = svgText.replaceAll(/stroke="#[^"]*"/g, `stroke="${color}"`);

    const blob = new Blob([svgText], { type: 'image/svg+xml' });
    const url = URL.createObjectURL(blob);
    const image = await RaceCreator.loadImage(url);
    URL.revokeObjectURL(url);

    return image;
  }

  private static async loadWheels(): Promise<HTMLImageElement> {
    return RaceCreator.loadImage(wheels);
  }

  private static isICarRaceParameters(
    value: unknown
  ): value is ICarRaceParameters {
    if (!value || typeof value !== 'object') return false;

    if (
      'velocity' in value &&
      typeof value.velocity === 'number' &&
      'distance' in value &&
      typeof value.distance === 'number'
    )
      return true;
    return false;
  }

  public updateCarColor(color: string): void {
    this.currentColor = color;
    this.loadCarAssets(color)
      .then(() => this.renderFrame())
      .catch(console.error);
  }

  public updateCarAppearance(color: string, name: string): void {
    this.updateCarColor(color);
    if (this.parent) {
      const nameElement = this.parent.name;
      if (nameElement && nameElement.element instanceof HTMLElement)
        nameElement.element.textContent = name;
    }
  }
  public createElement(
    parameters: IElementParameters,
    elementInfo?: ICar
  ): void {
    super.createElement(parameters);
    if (this.element instanceof HTMLCanvasElement && elementInfo) {
      this.element.width = Number(parameters.options?.width);
      this.element.height = Number(parameters.options?.height);
      const context = this.element.getContext('2d');
      if (context) this.context = context;
      this.loadFinishImage().catch(console.error);
      this.loadAndDraw(elementInfo).catch(console.error);
    }
  }

  public async startCar(isRaceMode: boolean = false): Promise<void> {
    this.isRaceMode = isRaceMode;
    if (isRaceMode) RaceCreator.winnerId = undefined;

    if (
      this.animationState.isRunning ||
      !this.parent?.element?.id ||
      this.isStarting
    )
      return;
    this.isStarting = true;

    try {
      this.resetCar();
      this.isEngineBroken = false;

      const engineParameters: unknown = await ApiClient.toggleEngine(
        Number.parseInt(this.parent.element.id),
        'started'
      );

      await this.loadCarAssets(this.currentColor);

      if (RaceCreator.isICarRaceParameters(engineParameters)) {
        const { velocity, distance } = engineParameters;

        this.raceDuration = distance / (toSeconds * velocity);
        this.raceStartTime = performance.now();

        await this.loadCarAssets(this.currentColor);
        this.startAnimation();

        this.monitorEngineStatus().catch(console.error);
      } else throw new Error('Invalid engine parameters received');
    } catch (error: unknown) {
      console.error('Engine start failed:', error);
      if (error instanceof Error && error.message.includes('500')) {
        await this.handleEngineFailure();
      }
    } finally {
      this.isStarting = false;
    }
  }

  public startAnimation(): void {
    if (this.animationState.isRunning) return;

    this.resetStopImage();

    this.animationState.isRunning = true;
    this.car.state.isMoving = true;
    this.animateFrame();
  }

  public stopAnimation(): void {
    if (!this.animationState.isRunning || !this.animationState.id) return;

    this.animationState.isRunning = false;
    cancelAnimationFrame(this.animationState.id);
  }

  public resetCar(): void {
    this.car.state.isMoving = false;
    this.car.position = 0;
    this.resetAnimationState();
  }

  public async showStopImage(): Promise<void> {
    this.showStopImageUntil = Date.now() + delay;
    await this.loadStopImage();
    this.renderFrame();
  }

  public resetAnimationState(): void {
    if (this.animationState.id) {
      cancelAnimationFrame(this.animationState.id);
    }

    this.animationState = {
      id: undefined,
      isRunning: false,
      wheelAngle: 0,
    };
  }

  public async brokeCar(): Promise<void> {
    try {
      this.stopAnimation();
      this.showStopImageUntil = Date.now() + delay;

      if (!this.stopImage) {
        await this.loadStopImage();
      }

      this.renderFrame();

      setTimeout(() => {
        this.resetStopImage();
        this.renderFrame();
      }, delay);
    } catch (error) {
      console.error('Failed to show broken car state:', error);
    }
  }

  public async stopCar(): Promise<void> {
    if (!this.parent?.element?.id) return;

    try {
      await ApiClient.toggleEngine(
        Number.parseInt(this.parent.element.id),
        'stopped'
      );
    } catch (error) {
      console.error('Engine stop error:', error);
    } finally {
      this.stopAnimation();
      this.resetCar();
      this.isEngineBroken = false;
      this.renderFrame();
    }
  }

  public resetStopImage(): void {
    this.showStopImageUntil = 0;
    this.renderFrame();
  }

  public drawCar(): void {
    if (
      this.element instanceof HTMLCanvasElement &&
      this.context &&
      this.car.assets.body &&
      this.car.assets.wheels
    ) {
      const width = Math.min(
        Car.CarWidth,
        this.element.width * carWidthToSmallPages
      );
      const height = width * widthHeightCoefficient;
      const trackWidth = this.element.width - Track.Padding * doublePadding;

      const carX = Track.Padding + this.car.position * trackWidth;
      const carY = this.element.height - Track.Padding - height * delayY;

      this.context.drawImage(this.car.assets.body, carX, carY, width, height);

      this.drawWheels(carX, carY, Car.CarWidth);
    }
  }

  private async monitorEngineStatus(): Promise<void> {
    if (!this.parent?.element?.id) return;

    try {
      await ApiClient.switchToDrive(Number.parseInt(this.parent.element.id));
    } catch (error) {
      console.log(error);
      if (error instanceof Error) {
        if (error.message.includes('429')) {
          console.log('Ignoring 429 (Too Many Requests)');
          return;
        }
        if (
          error.message.includes('500') ||
          error.message.includes('Internal Server')
        ) {
          console.error('Engine broken (500 error):', error);
          await this.handleEngineFailure();
          return;
        }
      }
      console.error('Unexpected error in monitorEngineStatus:', error);
      throw error;
    }
  }

  private async handleEngineFailure(): Promise<void> {
    this.isEngineBroken = true;
    await this.brokeCar();
  }

  private async loadAndDraw(elementInfo: ICar): Promise<void> {
    try {
      await this.loadCarAssets(elementInfo.color);
      this.renderFrame();
    } catch (error) {
      console.error('Failed to load and draw:', error);
      this.drawStaticElements();
    }
  }

  private drawStopImage(carX: number, carY: number): void {
    if (!this.context || !this.stopImage || !this.element) return;

    this.context.drawImage(
      this.stopImage,
      carX + Car.CarWidth * correctionX,
      carY + Car.BrokeSize,
      Car.BrokeSize,
      Car.BrokeSize
    );
  }

  private getFinishPosition(): number {
    if (this.element instanceof HTMLCanvasElement) {
      const finishX =
        this.element.width -
        Track.Padding -
        Track.FinishLine +
        Track.FinishDelta;
      const trackWidth = this.element.width - doublePadding * Track.Padding;
      return (finishX - Track.Padding) / trackWidth;
    }
    return 1;
  }

  private async loadStopImage(): Promise<void> {
    if (this.isStopImageLoading || this.stopImage) return;

    this.isStopImageLoading = true;

    try {
      this.stopImage = await RaceCreator.loadImage(fail);
    } catch {
      this.stopImage = undefined;
    } finally {
      this.isStopImageLoading = false;
    }
  }

  private async loadCarAssets(color: string): Promise<void> {
    if (this.car.assets.color === color && this.car.assets.body) {
      return;
    }

    try {
      const bodyImage = await RaceCreator.loadBody(color);
      const wheelsImage = await RaceCreator.loadWheels();

      this.car.assets = {
        body: bodyImage,
        wheels: wheelsImage,
        color,
      };
    } catch (error) {
      console.error('Failed to load car assets:', error);
      throw error;
    }
  }

  private drawStaticElements(): void {
    if (!this.context || !this.element) return;

    this.drawTrack();
    this.drawFinish();
  }
  private async loadFinishImage(): Promise<void> {
    try {
      this.finishImage = await RaceCreator.loadImage(finish);
    } catch (error) {
      console.error('Failed to load finish image:', error);
    }
  }
  private drawTrack(): void {
    if (this.element instanceof HTMLCanvasElement && this.context) {
      const width = this.element.width;
      const y = this.element.height - Track.Padding;

      const gradient = this.context.createLinearGradient(0, y, width, y);
      gradient.addColorStop(0, Colors.Yellow);
      gradient.addColorStop(colorTransitionalPoint, Colors.Orange);
      gradient.addColorStop(1, Colors.Ochre);

      this.context.strokeStyle = gradient;
      this.context.lineWidth = Track.DashHeight;
      const padding = Number(Track.Padding);
      let x = padding;
      while (x < width - padding) {
        this.context.beginPath();
        this.context.moveTo(x, y);
        let x2 = x + Track.TrackDash;
        if (x2 > width - padding) x2 = width - padding;
        this.context.lineTo(x2, y);
        this.context.stroke();
        x += Track.TrackDash + Track.TrackGap;
      }
    }
  }

  private drawFinish(): void {
    if (this.element instanceof HTMLCanvasElement && this.context) {
      const width =
        this.element.width -
        Track.Padding -
        Track.FinishLine -
        Track.FinishDelta;
      const height =
        this.element.height -
        Track.Padding -
        Track.FinishSize -
        Track.DashHeight / actualDash;

      if (this.finishImage) {
        this.context.drawImage(
          this.finishImage,
          width,
          height,
          Track.FinishSize,
          Track.FinishSize
        );
      } else {
        this.context.strokeStyle = Colors.ReserveFinishColor;
        this.context.lineWidth = Track.DashHeight;
        this.context.beginPath();
        this.context.moveTo(width + Track.FinishDelta, Track.Padding);
        this.context.lineTo(
          width + Track.FinishDelta,
          this.element.height - Track.Padding
        );
        this.context.stroke();
      }
    }
  }

  private animateFrame(): void {
    if (!this.animationState.isRunning) return;

    this.updateCarState();

    this.renderFrame();

    this.animationState.id = requestAnimationFrame(() => this.animateFrame());
  }

  private renderFrame(): void {
    if (this.element instanceof HTMLCanvasElement && this.context) {
      const finishPosition = this.getFinishPosition();

      this.context.clearRect(0, 0, this.element.width, this.element.height);

      if (Math.abs(this.car.position - finishPosition) < delta) {
        this.stopAnimation();
        if (this.isRaceMode && RaceCreator.winnerId === undefined) {
          RaceCreator.winnerId = Number(this.parent?.element?.id);
          this.showFinishModal();

          const winnerTime = this.raceDuration;
          ApiClient.saveRaceResult(RaceCreator.winnerId, winnerTime).catch(
            console.error
          );
        }
      }

      this.drawStaticElements();

      if (this.car.assets.body && this.car.assets.wheels) this.drawCar();

      if (this.stopImage && Date.now() <= this.showStopImageUntil) {
        const width = this.getWidth();
        const trackWidth = this.element.width - Track.Padding * doublePadding;
        const carX = Track.Padding + this.car.position * trackWidth;
        const carY = this.getCarY(width);
        this.drawStopImage(carX, carY);
      }
      if (
        this.isEngineBroken &&
        this.stopImage &&
        Date.now() <= this.showStopImageUntil
      ) {
        const width = this.getWidth();
        const trackWidth = this.element.width - Track.Padding * doublePadding;
        const carX = Track.Padding + this.car.position * trackWidth;
        const carY = this.getCarY(width);
        this.drawStopImage(carX, carY);
      }
    }
  }
  private getCarY(width: number): number {
    return this.element instanceof HTMLCanvasElement
      ? this.element.height -
          Track.Padding -
          width * widthHeightCoefficient * delayY
      : 0;
  }

  private getWidth(): number {
    return this.element instanceof HTMLCanvasElement
      ? Math.min(Car.CarWidth, this.element.width * carWidthToSmallPages)
      : 0;
  }

  private showFinishModal(): void {
    console.log('modal');
    if (!this.parent || !this.element) return;

    const modal = document.createElement('div');
    modal.className = 'finish-modal-overlay';

    const modalContent = document.createElement('div');
    modalContent.className = 'finish-modal';

    const content = document.createElement('div');
    content.className = 'finish-modal-content';

    const winnerImg = document.createElement('img');
    winnerImg.className = 'finish-modal-winner-image';
    winnerImg.src = winner;
    winnerImg.alt = 'Winner';

    const carName = document.createElement('div');
    carName.className = 'finish-modal-car-name';
    carName.textContent = `Race win ${this.parent.name?.element?.textContent || 'Unknown car'}`;

    const time = document.createElement('div');
    time.className = 'finish-modal-time';
    time.textContent = `With time: ${this.raceDuration.toFixed(numberAfterPoint)}s`;

    content.append(winnerImg);
    content.append(carName);
    content.append(time);
    modalContent.append(content);
    modal.append(modalContent);

    modal.addEventListener('click', (error) => {
      if (error.target === modal) {
        modal.remove();
      }
    });

    document.body.append(modal);
  }

  private updateCarState(): void {
    if (!this.animationState.isRunning) return;

    this.animationState.wheelAngle += 0.1;
    if (this.animationState.wheelAngle > Math.PI * round) {
      this.animationState.wheelAngle = 0;
    }

    if (this.car.state.isMoving && !this.isEngineBroken) {
      const elapsed = (performance.now() - this.raceStartTime) / toSeconds;
      this.car.position = Math.min(elapsed / this.raceDuration, 1);
    }
  }

  private drawWheels(carX: number, carY: number, carWidth: number): void {
    if (!this.context || !this.car.assets.wheels) return;

    const wheelSize = carWidth * Car.WheelSizeRatio;
    const wheelY = carY + carWidth / half - deltaY;

    this.drawWheel(
      carX + carWidth * rightWheelCorrection - Car.WheelOffset,
      wheelY,
      wheelSize
    );

    this.drawWheel(
      carX + carWidth * leftWheelCorrection - Car.WheelOffset,
      wheelY,
      wheelSize
    );
  }

  private drawWheel(x: number, y: number, size: number): void {
    if (!this.context || !this.car.assets.wheels) return;

    this.context.save();
    this.context.translate(x, y);
    this.context.rotate(this.animationState.wheelAngle);
    this.context.drawImage(
      this.car.assets.wheels,
      -size / half,
      -size / half,
      size,
      size
    );
    this.context.restore();
  }
}
