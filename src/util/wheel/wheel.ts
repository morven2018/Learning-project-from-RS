import type { IElementParameters, IValueList } from '../../types/interfaces';
import { TextAlign, TextBaseline } from '../../types/types';
import ElementCreator from '../element-creator';
import { isNotNullable } from '../is-nullable';
import type TimerCreator from '../timer/timer';

const SIZE = {
  WIDTH: '400',
  HEIGHT: '400',
};

const ARROW_COLOR = '#7c8094';

const TEXT_PARAMETERS = {
  COLOR: 'white',
  FONT: '16px Arial',
  ALIGN: TextAlign.Center,
  BASELINE: TextBaseline.Middle,
};

export default class WheelCreator extends ElementCreator {
  public valueList: IValueList;

  constructor(
    parameters: IElementParameters,
    valueList: IValueList,
    timer: TimerCreator
  ) {
    super(parameters);
    this.valueList = valueList;
    if (
      isNotNullable(this.element) &&
      this.element instanceof HTMLCanvasElement
    ) {
      this.element.setAttribute('width', SIZE.WIDTH);
      this.element.setAttribute('height', SIZE.HEIGHT);

      const context = this.element.getContext('2d');
      const centerX = this.element.width / 2;
      const centerY = this.element.height / 2;
      const radius = Math.min(centerX, centerY) - 20;
      const minAngle = this.angle();
      let startAngle = 0;

      if (isNotNullable(context)) {
        for (const [key, value] of Object.entries(this.valueList)) {
          context.beginPath();
          context.moveTo(centerX, centerY);
          context.arc(
            centerX,
            centerY,
            radius,
            startAngle,
            startAngle + minAngle * value
          );
          context.lineTo(centerX, centerY);
          context.fillStyle = WheelCreator.randomColor();
          context.fill();
          context.strokeStyle = 'white';
          context.stroke();

          const middleAngle = startAngle + (minAngle * value) / 2;
          const textX = centerX + Math.cos(middleAngle) * (radius / 2);
          const textY = centerY + Math.sin(middleAngle) * (radius / 2);
          context.save();
          context.fillStyle = TEXT_PARAMETERS.COLOR;
          context.font = TEXT_PARAMETERS.FONT;
          context.translate(textX, textY);
          context.rotate(middleAngle);
          context.textAlign = TEXT_PARAMETERS.ALIGN;
          context.textBaseline = TEXT_PARAMETERS.BASELINE;
          context.fillText(key, 0, 0);
          context.restore();

          startAngle += minAngle * value;
        }

        WheelCreator.drawArrow(context, centerX, 50, centerX, 20, ARROW_COLOR);
      }
    }
    console.log(this, valueList, timer);
  }

  public static drawArrow(
    context: CanvasRenderingContext2D,
    fromX: number,
    fromY: number,
    toX: number,
    toY: number,
    color: string,
    arrowSize: number = 25
  ): void {
    const dx = toX - fromX;
    const dy = toY - fromY;
    const angle = Math.atan2(dy, dx);

    context.save();

    context.strokeStyle = TEXT_PARAMETERS.COLOR;
    context.lineWidth = 2;
    context.fillStyle = color;

    const midX = (fromX + toX) / 2;
    const midY = (fromY + toY) / 2;

    const triangleHeight = arrowSize * Math.sin(Math.PI / 6);

    const offsetY = triangleHeight / 2;

    context.beginPath();
    context.moveTo(midX, midY + offsetY);

    context.lineTo(
      midX - arrowSize * Math.cos(angle - Math.PI / 6),
      midY - offsetY + arrowSize * Math.sin(angle - Math.PI / 6)
    );
    context.lineTo(
      midX - arrowSize * Math.cos(angle + Math.PI / 6),
      midY - offsetY + arrowSize * Math.sin(angle + Math.PI / 6)
    );
    context.closePath();

    context.stroke();
    context.fill();

    context.restore();
  }

  public static randomColor(): string {
    const r = Math.floor(Math.random() * 106) + 50;
    const g = Math.floor(Math.random() * 106) + 50;
    const b = Math.floor(Math.random() * 106) + 50;
    return `rgb(${r}, ${g}, ${b})`;
  }

  private angle(): number {
    let parts = 0;
    for (const value of Object.values(this.valueList)) parts += value;
    return (Math.PI * 2) / parts;
  }
}
