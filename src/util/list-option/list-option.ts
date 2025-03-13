import State from '../../state/state';
import type {
  IElementInfo,
  IElementParameters,
  IListCreator,
} from '../../types/interfaces';
import type { OptionType } from '../../types/types';
import ButtonCreator from '../buttons/button';
import ElementCreator from '../element-creator';
import { isNotNullable } from '../is-nullable';
import ListConfigurator from '../list-configurator/list-configurator';

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

export default class ListCreator
  extends ElementCreator
  implements IListCreator
{
  public nextId = 1;
  public elements: HTMLElement[] = [];
  public state: State;
  private onInputChangeCallback: (() => void) | undefined;

  constructor(parameters: IElementParameters, state: State) {
    super(parameters);
    this.state = state;
    this.createElement(parameters);
    const loadedData = State.loadFromLocalStorage(this);
    if (loadedData) {
      this.elements = loadedData.elements;
      this.nextId = loadedData.lastId + 1;
    }

    this.setOnInputChangeCallback(() => {
      State.saveToLocalStorage(this.elements, this.nextId);
    });
    this.setOnInputChangeCallback(() => this.saveToLocalStorage());
    this.loadFromLocalStorage();
  }

  private static addId(parent: ElementCreator, id: string): ElementCreator {
    const idParameters = {
      tag: 'div',
      classNames: [CssClasses.INDEX],
      textContent: `#${id}`,
      id: Number(id),
    };

    const idElement = new ElementCreator(idParameters);
    parent.addInnerElement(idElement);
    return idElement;
  }

  public createElement(parameters: IElementParameters): void {
    super.createElement(parameters);
    const info = {
      id: String(this.nextId),
      title: '',
      weight: '',
    };

    this.addElement(info);
  }

  public addElement(info: IElementInfo): HTMLElement | undefined {
    const liParameters = {
      tag: 'li',
      classNames: [CssClasses.LI, `${CssClasses.LI}-${info.id}`],
      textContent: '',
    };
    const listElement = new ElementCreator(liParameters);
    listElement.element?.setAttribute('id', info.id?.toString());

    /*const idElement =  */ ListCreator.addId(listElement, info.id);
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
          this.saveToLocalStorage();
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
    State.saveToLocalStorage(this.elements, this.nextId);
    return listElement.element;
  }

  public removeElementById(id: string): void {
    const index = this.elements.findIndex(
      (element) => element.getAttribute('id') === id
    );

    if (index !== -1) {
      const element = this.elements[index];
      element.remove();
      this.elements.splice(index, 1);
      State.saveToLocalStorage(this.elements, this.nextId);
    }
  }

  public clearList(): void {
    if (this.elements)
      for (const element of this.elements) {
        element.remove();
      }
    this.elements = [];
    this.nextId = 1;
    State.saveToLocalStorage(this.elements, this.nextId);
  }

  public setOnInputChangeCallback(callback: () => void): void {
    this.onInputChangeCallback = callback;
  }

  public saveToLocalStorage(): void {
    if (isNotNullable(this)) {
      const content = ListConfigurator.toJSON(this.getElements(), this.nextId);
      const jsonContent = JSON.stringify(content);
      localStorage.setItem('optionList', jsonContent);
    }
  }

  public loadFromLocalStorage(): void {
    const savedList = localStorage.getItem('optionList');
    if (isNotNullable(savedList)) {
      try {
        const jsonData: unknown = JSON.parse(savedList);
        if (isNotNullable(this)) ListConfigurator.fromJSON(jsonData, this);
      } catch (error) {
        console.error(error);
      }
    }
  }

  public getElements(): HTMLElement[] {
    return this.elements;
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
    };
    const inputElement = new ElementCreator(inputParameters);
    parent.addInnerElement(inputElement);
    for (const option in options) {
      if (isNotNullable(options[option]))
        inputElement.element?.setAttribute(option, options[option]);
    }
    inputElement.element?.setAttribute('id', `${className}_${this.nextId}`);

    if (inputElement.element instanceof HTMLInputElement) {
      inputElement.element.addEventListener('input', () => {
        if (this.onInputChangeCallback) {
          this.onInputChangeCallback();
        }
      });
    }

    console.log(inputElement.element);
    return inputElement;
  }
}
