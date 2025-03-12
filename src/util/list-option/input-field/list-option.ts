import type State from '../../../state/state';
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
  public elements: HTMLElement[] = [];
  public state: State;
  constructor(parameters: IElementParameters, state: State) {
    super(parameters);
    this.state = state;
    this.createElement(parameters);
  }

  public createElement(parameters: IElementParameters): void {
    super.createElement(parameters);
    this.addElement();
  }

  public addElement(): void {
    const liParameters = {
      tag: 'li',
      classNames: [CssClasses.LI, `${CssClasses.LI}-${this.nextId}`],
      textContent: '',
    };

    const listElement = new ElementCreator(liParameters);
    listElement.element?.setAttribute('id', this.nextId?.toString());

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
      callback: (): void => {
        const id = listElement.element?.getAttribute('id');
        if (id) {
          this.removeElementById(id);
        }
      },
      imageURL: '',
    };

    const backButton = new ButtonCreator(buttonParameters);

    listElement.addInnerElement(backButton);
    if (isNotNullable(listElement.element))
      this.elements?.push(listElement.element);
    this.addInnerElement(listElement);
    // console.log(this.elements);
    this.nextId += 1;
  }

  public removeElementById(id: string): void {
    const index = this.elements.findIndex(
      (element) => element.getAttribute('id') === id
    );

    if (index !== -1) {
      const element = this.elements[index];
      element.remove();
      this.elements.splice(index, 1);
    }
  }

  public clearList(): void {
    if (this.elements)
      for (const element of this.elements) {
        element.remove();
      }
    this.elements = [];
  }

  public getElements(): HTMLElement[] {
    return this.elements;
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
    // console.log(inputElement.element);
    return inputElement;
  }
}
