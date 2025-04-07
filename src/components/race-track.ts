import type { ICar } from '../lib/types/api-interfaces';
import type { IElementParameters } from '../lib/types/interfaces';
import ElementCreator from './element-creator';
import finish from '../assets/images/finish.png';
import body from '../assets/images/car-body.svg';
import wheels from '../assets/images/wheel.svg';

const trackColor = '#333';
const dashHeight = 4;
const trackGap = 3;
const trackDash = 15;
const padding = 5;
const finishSize = 50;
const finishLine = 80;
const finishDelta = 0.24 * finishSize;
const reserveFinishColor = '#ff0000';
const carWidth = 100;
const wheelOffset = 2;
const yellow = '#FFD700';
const orange = '#FFA500';
const ochre = '#FF8C00';

export default class RaceCreator extends ElementCreator {
  public context: CanvasRenderingContext2D | undefined = undefined;
  private wheelAngle = 0;
  private wheelImage: HTMLImageElement | undefined = undefined;
  private animationId: number | undefined = undefined;
  private isAnimating = false;

  constructor(parameters: IElementParameters, elementInfo?: ICar) {
    super(parameters);
    this.createElement(parameters, elementInfo);
  }

  private static async loadImage(source: string): Promise<HTMLImageElement> {
    return new Promise((resolve) => {
      const img = new Image();
      img.src = source;
      img.addEventListener('load', () => resolve(img));
    });
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
      this.drawTracks();
      this.drawFinish().catch(console.error);
      this.drawCar(elementInfo).catch(console.error);
    }
  }

  public startAnimation(): void {
    if (!this.isAnimating) {
      this.isAnimating = true;
      this.animate();
    }
  }

  public stopAnimation(): void {
    this.isAnimating = false;
    if (this.animationId) {
      cancelAnimationFrame(this.animationId);
      this.animationId = undefined;
    }
  }

  private animate(): void {
    if (!this.isAnimating) return;

    if (this.element instanceof HTMLCanvasElement && this.context) {
      this.context.clearRect(0, 0, this.element.width, this.element.height);
      this.drawTracks();
      this.drawFinish().catch(console.error);
      this.drawWheels();
    }

    this.wheelAngle += 0.1;
    if (this.wheelAngle > Math.PI * 2) {
      this.wheelAngle = 0;
    }

    this.animationId = requestAnimationFrame(() => this.animate());
  }

  private drawTracks(): void {
    if (this.element instanceof HTMLCanvasElement && this.context) {
      const width = this.element.width;
      const y = this.element.height - padding;

      const gradient = this.context.createLinearGradient(0, y, width, y);
      gradient.addColorStop(0, yellow);
      gradient.addColorStop(0.5, orange);
      gradient.addColorStop(1, ochre);

      this.context.strokeStyle = gradient;
      this.context.lineWidth = dashHeight;

      let x = padding;
      while (x < width - padding) {
        this.context.beginPath();
        this.context.moveTo(x, y);
        let x2 = x + trackDash;
        if (x2 > width - padding) x2 = width - padding;
        this.context.lineTo(x2, y);
        this.context.stroke();
        x += trackDash + trackGap;
      }
    }
  }

  private async drawFinish(): Promise<void> {
    if (this.element instanceof HTMLCanvasElement && this.context) {
      const width = this.element.width - padding - finishLine - finishDelta;
      const height =
        this.element.height - padding - finishSize - dashHeight / 2;

      try {
        const image = await RaceCreator.loadImage(finish);
        this.context.drawImage(image, width, height, finishSize, finishSize);
      } catch {
        this.context.strokeStyle = reserveFinishColor;
        this.context.lineWidth = dashHeight;
        this.context.beginPath();
        this.context.moveTo(width + finishDelta, padding);
        this.context.lineTo(width + finishDelta, this.element.height - padding);
        this.context.stroke();
      }
    }
  }

  private async drawCar(elementInfo: ICar): Promise<void> {
    if (
      this.element instanceof HTMLCanvasElement &&
      this.context &&
      elementInfo.color
    ) {
      try {
        await this.drawCarBody(elementInfo.color);
        await this.loadWheels();
        this.drawWheels();
      } catch (error) {
        console.error(error);
      }
    }
  }

  private async drawCarBody(color: string): Promise<void> {
    if (this.element instanceof HTMLCanvasElement && this.context) {
      const width = Math.min(carWidth, this.element.width * 0.2);
      const height = (width * 2) / 3;

      try {
        const response = await fetch(body);
        let svgText = await response.text();

        svgText = svgText.replaceAll(/fill="#[^"]*"/g, `fill="${color}"`);
        svgText = svgText.replaceAll(/stroke="#[^"]*"/g, `stroke="${color}"`);

        const blob = new Blob([svgText], { type: 'image/svg+xml' });
        const url = URL.createObjectURL(blob);
        const image = await RaceCreator.loadImage(url);

        this.context.drawImage(
          image,
          padding,
          this.element.height - height * 0.85,
          width,
          height
        );

        URL.revokeObjectURL(url);
      } catch (error) {
        console.error(error);
      }
    }
  }

  private async loadWheels(): Promise<void> {
    try {
      this.wheelImage = await RaceCreator.loadImage(wheels);
    } catch (error) {
      console.error('Error loading wheels:', error);
    }
  }

  private drawWheels(): void {
    if (
      this.element instanceof HTMLCanvasElement &&
      this.context &&
      this.wheelImage
    ) {
      const widthCar = Math.min(carWidth, this.element.width * 0.2);
      const wheelSize = widthCar * 0.13;
      const wheelY = this.element.height - padding - wheelSize / 2;

      this.context.save();
      this.context.translate(
        padding + widthCar * 0.25 - wheelOffset,
        wheelY - wheelOffset
      );
      this.context.rotate(this.wheelAngle);
      this.context.drawImage(
        this.wheelImage,
        -wheelSize / 2,
        -wheelSize / 2,
        wheelSize,
        wheelSize
      );
      this.context.restore();

      this.context.save();
      this.context.translate(
        padding + widthCar * 0.75 + wheelOffset,
        wheelY - wheelOffset
      );
      this.context.rotate(this.wheelAngle);
      this.context.drawImage(
        this.wheelImage,
        -wheelSize / 2,
        -wheelSize / 2,
        wheelSize,
        wheelSize
      );
      this.context.restore();
    }
  }
}
