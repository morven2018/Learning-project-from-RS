import type { ICar } from '../lib/types/api-interfaces';
import type {
  IElementParameters,
  ICarState,
  IAnimationState,
} from '../lib/types/interfaces';
import ElementCreator from './element-creator';
import finish from '../assets/images/finish.png';
import body from '../assets/images/car-body.svg';
import wheels from '../assets/images/wheel.svg';
import fail from '../assets/images/fail.png';
import { Car, Colors, Track } from '../lib/types/enums';

const delay = 5000;

export default class RaceCreator extends ElementCreator {
  public context: CanvasRenderingContext2D | undefined = undefined;
  private wheelAngle = 0;
  private finishImage: HTMLImageElement | undefined = undefined;
  // private wheelImage: HTMLImageElement | undefined = undefined;
  // private animationId: number | undefined = undefined;
  private isAnimating = false;
  private stopImage: HTMLImageElement | undefined = undefined;
  private showStopImageUntil: number = 0;
  private isStopImageLoading: boolean = false;
  // private carPosition = padding;
  // private isMoving = false;
  // private carImageCache: HTMLImageElement | null = null;

  private animationState: IAnimationState = {
    id: undefined,
    isRunning: false,
    wheelAngle: 0,
  };

  private car: ICarState = {
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

  constructor(parameters: IElementParameters, elementInfo?: ICar) {
    super(parameters);
    this.createElement(parameters, elementInfo);
    // this.loadStopImage().catch(console.error);
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
      // this.loadStopImage(elementInfo).catch(console.error);
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

  public resetCarPosition(): void {
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
    this.stopAnimation();
    this.showStopImageUntil = Date.now() + delay;

    await this.loadStopImage();
    this.animateFrame();
    this.renderFrame();
    setTimeout(this.resetStopImage.bind(this), delay);
  }

  public stopCar(): void {
    this.stopAnimation();

    this.car = {
      position: 0,
      assets: this.car.assets,
      state: {
        speed: Car.DefaultCarSpeed,
        isMoving: false,
      },
    };

    this.animationState = {
      id: undefined,
      isRunning: false,
      wheelAngle: 0,
    };

    this.renderFrame();
  }
  public resetStopImage(): void {
    this.showStopImageUntil = 0;
    this.renderFrame();
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
    console.log('this.stopImage && Date.now() <= this.showStopImageUntil');
    if (this.element instanceof HTMLCanvasElement && this.context) {
      if (!this.context || !this.stopImage) return;
      console.log('123');
      console.log(carX, carY);
      this.context.drawImage(
        this.stopImage,
        carX + Car.CarWidth * 0.7,
        carY + Car.BrokeSize,
        Car.BrokeSize,
        Car.BrokeSize
      );
      console.log('1235');
    }
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
      gradient.addColorStop(0.5, Colors.Orange);
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
        Track.DashHeight / 2;

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

  private updateCarState(): void {
    this.animationState.wheelAngle += 0.1;
    if (this.animationState.wheelAngle > Math.PI * 2) {
      this.animationState.wheelAngle = 0;
    }

    if (this.car.state.isMoving) {
      this.car.position = Math.min(1, this.car.position + this.car.state.speed);
    }
    if (this.car.position >= 1) {
      this.stopAnimation();
    }
  }
  private renderFrame(): void {
    if (this.element instanceof HTMLCanvasElement && this.context) {
      this.context.clearRect(0, 0, this.element.width, this.element.height);

      this.drawStaticElements();

      if (this.car.assets.body && this.car.assets.wheels) {
        this.drawCar();
      }
      // const shouldShowStopImage = this.stopImage;
      if (this.stopImage && Date.now() <= this.showStopImageUntil) {
        console.log('GV');
        const width = Math.min(Car.CarWidth, this.element.width * 0.2);
        const trackWidth = this.element.width - Track.Padding * 2;
        const carX = Track.Padding + this.car.position * trackWidth;
        const carY =
          this.element.height - Track.Padding - ((width * 2) / 3) * 0.85;
        this.drawStopImage(carX, carY);
      }
    }
  }

  private drawCar(): void {
    if (
      this.element instanceof HTMLCanvasElement &&
      this.context &&
      this.car.assets.body &&
      this.car.assets.wheels
    ) {
      const width = Math.min(Car.CarWidth, this.element.width * 0.2);
      const height = (width * 2) / 3;
      const trackWidth = this.element.width - Track.Padding * 2;

      const carX = Track.Padding + this.car.position * trackWidth;
      const carY = this.element.height - Track.Padding - height * 0.85;

      this.context.drawImage(this.car.assets.body, carX, carY, width, height);

      this.drawWheels(carX, carY, Car.CarWidth);
    }
  }

  private drawWheels(carX: number, carY: number, carWidth: number): void {
    if (!this.context || !this.car.assets.wheels) return;

    const wheelSize = carWidth * Car.WheelSizeRatio;
    const wheelY = carY + carWidth / 2 - 5;

    this.drawWheel(carX + carWidth * 0.8 - Car.WheelOffset, wheelY, wheelSize);

    this.drawWheel(carX + carWidth * 0.25 - Car.WheelOffset, wheelY, wheelSize);
  }

  private drawWheel(x: number, y: number, size: number): void {
    if (!this.context || !this.car.assets.wheels) return;

    this.context.save();
    this.context.translate(x, y);
    this.context.rotate(this.animationState.wheelAngle);
    this.context.drawImage(
      this.car.assets.wheels,
      -size / 2,
      -size / 2,
      size,
      size
    );
    this.context.restore();
  }
}
