import ElementCreator from '../element-creator';
import type { IElementParameters } from '../../types/interfaces';
import { isNotNullable } from '../is-nullable';

const INPUT_TYPE = 'number';

const INPUT_PLACEHOLDER = '5 - 30 seconds';
const REGEX = /^[\d]+$/;

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
  public createElement(parameters: IElementParameters): void {
    super.createElement(parameters);
    if (parameters.id) this.element?.setAttribute('id', TIMER_ID);
    const labelParameters = {
      tag: 'label',
      classNames: [CssClasses.LABEL],
      textContent: 'Timer',
    };
    const label = new ElementCreator(labelParameters);
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
  }
}
