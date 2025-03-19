import ElementCreator from '../element-creator';
import type { IElementParameters } from '../../types/interfaces';
import { isNotNullable } from '../is-nullable';
import timer from '../../../asserts/icons/timer.png';

const TIMER = timer.toString();

const INPUT_TYPE = 'number';
const ALT_TEXT = 'Timer';
const INPUT_PLACEHOLDER = 'Input time of choosing';
const REGEX = /^\d+$/;

const DEFAULT_VALUE = '10';

const INPUT_OPTIONS: { [key: string]: string } = {
  type: INPUT_TYPE,
  placeholder: INPUT_PLACEHOLDER,
  value: DEFAULT_VALUE,
};

const CssClasses = {
  LABEL: 'picker__timer__label',
  INPUT: 'picker__timer__input',
};

const TIMER_ID = 'timer';

export default class TimerCreator extends ElementCreator {
  private inputElement: HTMLInputElement | undefined = undefined;

  constructor(parameters: IElementParameters) {
    super(parameters);
    this.createElement(parameters);
  }

  public createElement(parameters: IElementParameters): void {
    super.createElement(parameters);

    if (parameters.id) this.element?.setAttribute('id', TIMER_ID);

    const labelParameters = {
      tag: 'label',
      classNames: [CssClasses.LABEL],
      textContent: '',
    };
    const label = new ElementCreator(labelParameters);
    const icon = document.createElement('img');
    label.element?.append(icon);
    icon.src = TIMER;
    icon.alt = ALT_TEXT;
    this.addInnerElement(label);

    const inputParameters = {
      tag: 'input',
      classNames: [CssClasses.INPUT],
      textContent: '',
    };
    const input = new ElementCreator(inputParameters);

    for (const option in INPUT_OPTIONS) {
      if (isNotNullable(INPUT_OPTIONS[option]))
        input.element?.setAttribute(option, INPUT_OPTIONS[option]);
    }

    input.element?.addEventListener('input', () => {
      if (
        input.element instanceof HTMLInputElement &&
        isNotNullable(input.element.value) &&
        !REGEX.test(input.element.value)
      ) {
        input.element.value = DEFAULT_VALUE.toString();
      }
    });

    this.addInnerElement(input);

    if (input.element instanceof HTMLInputElement)
      this.inputElement = input.element;
  }

  public setTimerValue(value: string): void {
    if (isNotNullable(this.inputElement)) {
      this.inputElement.value = value;
    }
  }

  public getTimerValue(): number {
    if (
      isNotNullable(this.inputElement) &&
      isNotNullable(this.inputElement.value)
    ) {
      return Number(this.inputElement.value);
    }
    return Number(DEFAULT_VALUE);
  }

  public disableInput(): void {
    if (this.inputElement) {
      this.inputElement.disabled = true;
    }
  }

  public enableInput(): void {
    if (this.inputElement) {
      this.inputElement.disabled = false;
    }
  }
}
