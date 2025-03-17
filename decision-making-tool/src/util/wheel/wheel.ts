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
const STROKE_COLOR = '#b388ff';

const TEXT_PARAMETERS = {
  COLOR: 'white',
  FONT: '16px Arial',
  ALIGN: TextAlign.Center,
  BASELINE: TextBaseline.Middle,
};

export default class WheelCreator extends ElementCreator {
  public valueList: IValueList;
  private rotationAngle: number = 0;
  private animationStartTime: number | undefined = undefined;
  private animationDuration: number = 10_000;
  private isAnimating: boolean = false;
  private sectionColors: string[] = [];
  private area: ElementCreator | undefined = undefined;

  constructor(
    parameters: IElementParameters,
    valueList: IValueList,
    timer: TimerCreator,
    area: ElementCreator
  ) {
    super(parameters);
    this.valueList = valueList;
    this.area = area;

    if (isNotNullable(this.area.element))
      this.area.element.textContent = Object.keys(valueList)[0];
    this.sectionColors = Object.keys(valueList).map(() =>
      WheelCreator.randomColor()
    );

    if (
      isNotNullable(this.element) &&
      this.element instanceof HTMLCanvasElement
    ) {
      this.element.setAttribute('width', SIZE.WIDTH);
      this.element.setAttribute('height', SIZE.HEIGHT);
      console.log(timer);

      const context = this.element.getContext('2d');
      if (context) {
        this.drawWheel(context);
      }
    }
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

    context.strokeStyle = STROKE_COLOR;
    context.lineWidth = 5;
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

  public startAnimation(): void {
    if (this.isAnimating) return;

    this.animationStartTime = performance.now();
    this.isAnimating = true;
    this.animate();
  }

  private updateArea(rotationAngle: number): void {
    if (!this.area || !this.area.element) return;

    const selectedItem = this.getSelectedItem(rotationAngle);
    this.area.element.textContent = selectedItem || '';
  }

  private highlightArea(): void {
    if (!this.area || !this.area.element) return;

    this.area.element.style.backgroundColor = 'green';
  }

  private getSelectedItem(rotationAngle: number): string | undefined {
    const totalWeight = Object.values(this.valueList).reduce(
      (sum, weight) => sum + weight,
      0
    );

    let normalizedAngle = rotationAngle % (2 * Math.PI);
    if (normalizedAngle < 0) normalizedAngle += 2 * Math.PI;

    normalizedAngle += Math.PI / 2;

    let accumulatedAngle = 0;

    for (const [key, value] of Object.entries(this.valueList)) {
      const sectorAngle = (2 * Math.PI * value) / totalWeight;

      if (
        normalizedAngle >= accumulatedAngle &&
        normalizedAngle <= accumulatedAngle + sectorAngle
      ) {
        return key;
      }

      accumulatedAngle += sectorAngle;
    }
    return undefined;
  }

  private animate(): void {
    if (
      !this.isAnimating ||
      !this.element ||
      !(this.element instanceof HTMLCanvasElement)
    )
      return;

    const context = this.element.getContext('2d');
    if (!context) return;

    const currentTime = performance.now();
    const elapsedTime = currentTime - (this.animationStartTime || 0);

    if (elapsedTime >= this.animationDuration) {
      this.isAnimating = false;
      this.rotationAngle = 0;
      this.drawWheel(context);
      this.highlightArea();
      return;
    }

    const progress = elapsedTime / this.animationDuration;
    this.rotationAngle = progress * Math.PI * 4;

    context.clearRect(0, 0, this.element.width, this.element.height);
    this.drawWheel(context);
    this.updateArea(this.rotationAngle);

    requestAnimationFrame(() => this.animate());
  }

  private drawWheel(context: CanvasRenderingContext2D): void {
    if (
      isNotNullable(this.element) &&
      this.element instanceof HTMLCanvasElement
    ) {
      const centerX = this.element.width / 2;
      const centerY = this.element.height / 2;
      const radius = Math.min(centerX, centerY) - 20;
      const minAngle = this.angle();
      let startAngle = this.rotationAngle;

      for (const [index, [key, value]] of Object.entries(
        this.valueList
      ).entries()) {
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
        context.fillStyle = this.sectionColors[index];
        context.fill();
        context.strokeStyle = STROKE_COLOR;
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

  private angle(): number {
    let parts = 0;
    for (const value of Object.values(this.valueList)) parts += value;
    return (Math.PI * 2) / parts;
  }
}
