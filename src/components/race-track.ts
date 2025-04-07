import type { ICar } from '../lib/types/api-interfaces';
import type { IElementParameters } from '../lib/types/interfaces';
import ElementCreator from './element-creator';
import finish from '../assets/images/finish.png';

const trackColor = '#333';
const dashHeight = 4;
const trackGap = 3;
const trackDash = 15;
const padding = 5;
const finishSize = 50;
const finishLine = 80;
const finishDelta = 0.24 * finishSize;
const reserveFinishColor = '#ff0000';

export default class RaceCreator extends ElementCreator {
  public context: CanvasRenderingContext2D | null = null;
  // implements IRaceTrackCreator
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
    // console.log(elementInfo, parameters);
    super.createElement(parameters);
    if (this.element instanceof HTMLCanvasElement && elementInfo) {
      this.element.width = Number(parameters.options?.width);
      this.element.height = Number(parameters.options?.height);
      this.context = this.element.getContext('2d');
      this.drawTracks();
      this.drawFinish().catch((error) => {
        console.error(error);
      });
      console.log(this.element, elementInfo);
    }
  }

  private drawTracks(): void {
    if (this.element instanceof HTMLCanvasElement && this.context) {
      const width = this.element.width;
      const y = this.element.height - padding;
      this.context.strokeStyle = trackColor;
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
        this.context.lineTo(width + finishDelta, height - padding);
        this.context.stroke();
      }
    }
  }
}
