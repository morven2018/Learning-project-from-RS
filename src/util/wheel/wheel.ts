import { TextAlign, TextBaseline } from '../../types/types';
import ElementCreator from '../element-creator';
import FormView from '../form/form-view';
import { isNotNullable } from '../is-nullable';

import type {
  IElementParameters,
  IValueList,
  IWheelCreator,
} from '../../types/interfaces';
import type TimerCreator from '../timer/timer';

import '../../view/main/index/form-view/form.scss';

const SIZE = {
  WIDTH: '400',
  HEIGHT: '400',
};
const ARROW_COLOR = '#7c8094';
const STROKE_COLOR = '#b388ff';

const USUAL_COLOR = '#d1c4e9;';
const HIGHLIGHT_COLOR = '#5e35b1';

const TEXT_PARAMETERS = {
  COLOR: 'white',
  FONT: '16px Arial',
  ALIGN: TextAlign.Center,
  BASELINE: TextBaseline.Middle,
};
const TEXT_MESSAGE = 'The button to start the picking';

const MAX_LENGTH = 14;
const MIN_DURATION = 5000;
const TO_SECONDS = 1000;
const ANGULAR_VELOCITY = Math.PI * 2;

export default class WheelCreator
  extends ElementCreator
  implements IWheelCreator
{
  public valueList: IValueList;
  private rotationAngle: number = 0;
  private finalRotationAngle: number = 0;
  private animationStartTime: number | undefined = undefined;
  private isAnimating: boolean = false;
  private sectionColors: string[] = [];
  private area: ElementCreator | undefined = undefined;
  private timer: TimerCreator | undefined = undefined;
  private buttons: Array<HTMLElement | undefined> = [];
  private onAnimationEnd: (() => void) | undefined = undefined;

  constructor(
    parameters: IElementParameters,
    valueList: IValueList,
    timer: TimerCreator,
    area: ElementCreator,
    buttons: Array<HTMLElement | undefined>,
    onAnimationEnd?: () => void
  ) {
    super(parameters);
    this.valueList = valueList;
    this.area = area;
    this.timer = timer;
    this.finalRotationAngle = -Math.PI / 2;
    this.buttons = buttons;
    this.onAnimationEnd = onAnimationEnd;

    if (isNotNullable(this.area.element))
      this.area.element.textContent = TEXT_MESSAGE;
    this.sectionColors = Object.keys(valueList).map(() =>
      WheelCreator.randomColor()
    );

    if (
      isNotNullable(this.element) &&
      this.element instanceof HTMLCanvasElement
    ) {
      this.element.setAttribute('width', SIZE.WIDTH);
      this.element.setAttribute('height', SIZE.HEIGHT);

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

  public static easeInOut(t: number): number {
    return -(Math.cos(Math.PI * t) - 1) / 2;
  }

  public startAnimation(): void {
    if (this.isAnimating) return;

    this.highlightAreaDisable();
    const animationDuration = this.timer?.getTimerValue()
      ? this.timer?.getTimerValue() * TO_SECONDS
      : 0;
    if (animationDuration >= MIN_DURATION) {
      if (this.timer) {
        this.timer.disableInput();
      }
      this.disableButtons();

      this.animationStartTime = performance.now();
      this.isAnimating = true;

      this.animate(animationDuration);
    } else {
      const message: FormView = new FormView(
        {
          message: 'The timer must be set for at least 5 seconds.',
          onClose: (): void => {
            if (
              isNotNullable(message.viewElementCreator) &&
              isNotNullable(message.viewElementCreator.element)
            ) {
              document.body.style.overflow = '';
              message.viewElementCreator.element.remove();
            }
          },
        },
        'dialog'
      );
      if (isNotNullable(message.viewElementCreator?.element))
        document.body.append(message.viewElementCreator?.element);
    }
  }

  private updateArea(rotationAngle: number): void {
    if (!this.area || !this.area.element) return;

    const selectedItem = this.getSelectedItem(rotationAngle);
    this.area.element.textContent = selectedItem || '';
  }

  private highlightArea(): void {
    if (!this.area || !this.area.element) return;
    this.area.element.style.borderColor = HIGHLIGHT_COLOR;
  }

  private highlightAreaDisable(): void {
    if (!this.area || !this.area.element) return;
    this.area.element.style.borderColor = USUAL_COLOR;
  }

  private getSelectedItem(rotationAngle: number): string | undefined {
    const totalWeight = Object.values(this.valueList).reduce(
      (sum, weight) => sum + weight,
      0
    );

    let normalizedAngle = rotationAngle % (2 * Math.PI);
    if (normalizedAngle < 0) normalizedAngle += 2 * Math.PI;

    normalizedAngle -= (3 * Math.PI) / 2;
    if (normalizedAngle < 0) normalizedAngle += 2 * Math.PI;

    normalizedAngle = 2 * Math.PI - normalizedAngle;

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

  private animate(animationDuration: number): void {
    if (
      !this.isAnimating ||
      !this.element ||
      !(this.element instanceof HTMLCanvasElement)
    )
      return;

    const context = this.element.getContext('2d');
    if (!context) return;

    this.highlightAreaDisable();
    const currentTime = performance.now();
    const elapsedTime = currentTime - (this.animationStartTime || 0);
    const progress = Math.min(elapsedTime / animationDuration, 1);

    const easedProgress = WheelCreator.easeInOut(progress);

    this.rotationAngle = ANGULAR_VELOCITY * easedProgress;

    if (elapsedTime >= animationDuration) {
      this.isAnimating = false;
      this.finalRotationAngle = this.rotationAngle;
      this.rotationAngle = 0;
      this.drawWheel(context);
      this.highlightArea();

      if (this.timer) {
        this.timer.enableInput();
        this.timer.setTimerValue('0');
      }

      this.enableButtons();
      this.timer?.setTimerValue('0');

      if (this.onAnimationEnd) {
        this.onAnimationEnd();
      }

      return;
    }

    const remainingTime = Math.ceil(
      (animationDuration - elapsedTime) / TO_SECONDS
    );
    if (isNotNullable(this.timer)) {
      this.timer.setTimerValue(remainingTime.toString());
    }

    this.rotationAngle =
      ((ANGULAR_VELOCITY * elapsedTime) / 1000) % (2 * Math.PI);

    context.clearRect(0, 0, this.element.width, this.element.height);
    this.drawWheel(context);
    this.updateArea(this.rotationAngle);

    requestAnimationFrame(() => this.animate(animationDuration));
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
      let startAngle = this.isAnimating
        ? this.rotationAngle
        : this.finalRotationAngle;

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
        const text =
          key.length < MAX_LENGTH ? key : key.slice(0, MAX_LENGTH + 1) + '...';
        context.fillText(text, 0, 0);
        context.restore();

        startAngle += minAngle * value;
      }

      WheelCreator.drawArrow(context, centerX, 50, centerX, 20, ARROW_COLOR);

      context.beginPath();
      context.arc(centerX, centerY, radius * 0.1, 0, 2 * Math.PI);
      context.fillStyle = ARROW_COLOR;
      context.strokeStyle = STROKE_COLOR;
      context.lineWidth = 2;
      context.fill();
      context.stroke();
    }
  }

  private angle(): number {
    let parts = 0;
    for (const value of Object.values(this.valueList)) parts += value;
    return (Math.PI * 2) / parts;
  }

  private disableButtons(): void {
    for (const button of this.buttons) {
      if (isNotNullable(button) && button instanceof HTMLButtonElement) {
        button.disabled = true;
      }
    }
  }

  private enableButtons(): void {
    for (const button of this.buttons) {
      if (isNotNullable(button) && button instanceof HTMLButtonElement) {
        button.disabled = false;
      }
    }
  }
}
