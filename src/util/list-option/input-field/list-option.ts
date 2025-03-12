import type { IElementParameters } from '../../../types/interfaces';
import type { OptionType } from '../../../types/types';
import ButtonCreator from '../../buttons/button';
import ElementCreator from '../../element-creator';
import { isNotNullable } from '../../is-nullable';

const CssClasses = {
  LI: 'list__element',
  INDEX: 'list__element__id',
  INPUT_TITLE: 'list__element__input-title',
  INPUT_VALUE: 'list__element__input-value',
  BUTTON: 'list__element__delete-element-button',
};

const INPUT_TYPES = {
  TITLE: 'text',
  VALUE: 'number',
};

const INPUT_PLACEHOLDER = {
  TITLE: 'name of option',
  VALUE: 'weight',
};

export default class ListCreator extends ElementCreator {
  public nextId = 1;
  constructor(parameters: IElementParameters) {
    super(parameters);
    this.createElement(parameters);
  }
  public createElement(parameters: IElementParameters): void {
    super.createElement(parameters);
    this.addElement();
  }

  public addElement(): void {
    // console.log(this.element);
    const liParameters = {
      tag: 'li',
      classNames: [CssClasses.LI, `${CssClasses.LI}-${this.nextId}`],
      textContent: '',
    };

    const listElement = new ElementCreator(liParameters);
    /*const idElement =  */ this.addId(listElement);
    this.addInput(listElement, CssClasses.INPUT_TITLE, {
      type: INPUT_TYPES.TITLE,
      minlength: '2',
      placeholder: INPUT_PLACEHOLDER.TITLE,
    });

    this.addInput(listElement, CssClasses.INPUT_TITLE, {
      type: INPUT_TYPES.VALUE,
      min: '0',
      placeholder: INPUT_PLACEHOLDER.VALUE,
    });

    const buttonParameters = {
      tag: 'button',
      classNames: [CssClasses.BUTTON],
      textContent: 'delete',
      callback: (): void => this.getElement()?.remove(),
      imageURL: '',
    };

    const backButton = new ButtonCreator(buttonParameters);
    listElement.addInnerElement(backButton);
    this.addInnerElement(listElement);
    this.nextId += 1;
  }

  private addId(parent: ElementCreator): ElementCreator {
    const idParameters = {
      tag: 'div',
      classNames: [CssClasses.INDEX],
      textContent: `#${this.nextId}`,
      id: this.nextId,
    };

    const idElement = new ElementCreator(idParameters);
    parent.addInnerElement(idElement);
    return idElement;
  }

  private addInput(
    parent: ElementCreator,
    className: string,
    options: OptionType
  ): ElementCreator {
    const inputParameters = {
      tag: 'input',
      classNames: [className],
      textContent: '',
      callback: undefined,
    };
    const inputElement = new ElementCreator(inputParameters);
    parent.addInnerElement(inputElement);
    for (const option in options) {
      if (isNotNullable(options[option]))
        inputElement.element?.setAttribute(option, options[option]);
    }
    inputElement.element?.setAttribute('id', `${className}_${this.nextId}`);
    console.log(inputElement.element);
    return inputElement;
  }
}
