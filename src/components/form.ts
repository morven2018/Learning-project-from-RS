import { CssClasses, CssTags } from '../lib/types/enums';
import type { IElementParameters } from '../lib/types/interfaces';
import ButtonCreator from './button';
import ElementCreator from './element-creator';
import InputCreator from './input';

const inputParameters = [
  {
    tag: CssTags.Input,
    classNames: [CssClasses.InputName],
    textContent: '',
    options: {
      type: 'text',
      minlength: '3',
      required: 'true',
      placeholder: 'car brand and model',
    },
  },
  {
    tag: CssTags.Input,
    classNames: [CssClasses.InputColor],
    textContent: '',
    options: {
      type: 'color',
      title: 'color of the car',
      required: 'true',
    },
  },
];

export default class FormCreator extends ElementCreator {
  public inputs: HTMLInputElement[] = [];
  public btn: ButtonCreator | undefined;

  constructor(parameters: IElementParameters) {
    super(parameters);
    this.inputs = [];
    this.createElement(parameters);
  }

  public createElement(parameters: IElementParameters): void {
    super.createElement(parameters);

    for (const inputParameter of inputParameters) {
      const input = new InputCreator(inputParameter);
      if (input.element instanceof HTMLInputElement) {
        input.element.placeholder = `${parameters.title} ${inputParameter.options.placeholder}`;
      }

      if (input && input.element && input.element instanceof HTMLInputElement) {
        input.element.id = `${parameters.classNames[0]}__${inputParameter.classNames[0]}`;
        this.inputs?.push(input.element);
        this.addInnerElement(input);
      }
    }

    const buttonParameters = {
      tag: CssTags.Button,
      classNames: [`${parameters.classNames[0]}__btn`],
      textContent: parameters.title || '',
    };
    this.btn = new ButtonCreator(buttonParameters);
    this.addInnerElement(this.btn);
  }

  public getInput(): HTMLInputElement[] {
    return this.inputs;
  }
}
