import type { ICar } from '../lib/types/api-interfaces';
import type { IElementParameters } from '../lib/types/interfaces';
import ElementCreator from './element-creator';
import finish from '../assets/images/finish.png';

const trackColor = '#333';
const dashHeight = 4;
const trackGap = 3;
const trackDash = 15;
const padding = 5;
const finishSize = 30;

export default class RaceCreator extends ElementCreator {
  public context: CanvasRenderingContext2D | null = null;
  // implements IRaceTrackCreator
  constructor(parameters: IElementParameters, elementInfo?: ICar) {
    super(parameters);
    this.createElement(parameters, elementInfo);
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
      console.log(this.element, elementInfo);
    }
  }

  private drawTracks() {
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
}
