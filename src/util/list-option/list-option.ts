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
import './list-option.scss';
import deleteIcon from '../../../asserts/icons/delete.png';

const DELETE_URL = deleteIcon.toString();

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

const REGEX = /^[\d.]+$/;

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
    this.createElement(parameters);

    this.state = state;
    this.clearList();

    const savedList = localStorage.getItem('optionList');

    if (isNotNullable(savedList)) {
      try {
        const jsonData: unknown = JSON.parse(savedList);
        if (isNotNullable(jsonData)) {
          const data = ListConfigurator.fromJSON(jsonData);
          if (isNotNullable(data) && ListConfigurator.isIJSONObject(data)) {
            for (const item of data.list) {
              if (ListConfigurator.isIElementInfo(item)) {
                const newElement = this.addElement(item);
                if (isNotNullable(newElement)) this.elements.push(newElement);
                this.nextId = data.lastId + 1;
              }
            }
          }
        }
      } catch (error) {
        console.error(error);
      }
    } else {
      this.nextId = 1;
      const basicParameters = {
        id: this.nextId.toString(),
        title: '',
        weight: '',
      };
      const newElement = this.addElement(basicParameters);
      if (isNotNullable(newElement)) this.elements.push(newElement);
      this.nextId += 1;
    }

    this.setOnInputChangeCallback(() => {
      console.log('save change');
      State.saveToLocalStorage(this.elements, this.nextId);
    });

    window.addEventListener('beforeunload', () => {
      this.clearList();
    });
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

    ListCreator.addId(listElement, info.id);
    const inputTitle = this.addInput(listElement, CssClasses.INPUT_TITLE, {
      type: INPUT_TYPES.TITLE,
      minlength: '2',
      maxlength: '80',
      placeholder: INPUT_PLACEHOLDER.TITLE,
    });

    if (inputTitle.element instanceof HTMLInputElement && info.title) {
      inputTitle.element.value = info.title;
    }

    const inputWeight = this.addInput(listElement, CssClasses.INPUT_TITLE, {
      type: INPUT_TYPES.VALUE,
      min: '0',
      max: '100000',
      placeholder: INPUT_PLACEHOLDER.VALUE,
    });

    if (inputWeight.element instanceof HTMLInputElement && info.weight) {
      inputWeight.element.value = info.weight;
    }

    const buttonParameters = {
      tag: 'button',
      classNames: [CssClasses.BUTTON],
      textContent: '',
      title: 'delete item',
      callback: (): void => {
        const id = listElement.element?.getAttribute('id');
        if (id) {
          this.removeElementById(id);
          console.log('delete save');
          State.saveToLocalStorage(this.elements, this.nextId);
        }
      },
      imageURL: DELETE_URL,
    };

    const backButton = new ButtonCreator(buttonParameters);

    listElement.addInnerElement(backButton);
    if (isNotNullable(listElement.element)) {
      this.elements?.push(listElement.element);
      this.addInnerElement(listElement);
      this.nextId += 1;
    }
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
  public clearList(click: boolean = false): void {
    if (this.elements)
      for (const element of this.elements) {
        element.remove();
      }

    this.elements = [];
    this.nextId = 1;
    if (click) State.saveToLocalStorage(this.elements, this.nextId);
  }

  public setOnInputChangeCallback(callback: () => void): void {
    this.onInputChangeCallback = callback;
  }

  public loadFromLocalStorage(): void {
    const savedList = localStorage.getItem('optionList');
    if (isNotNullable(savedList)) {
      try {
        const jsonData: unknown = JSON.parse(savedList);
        if (isNotNullable(this)) ListConfigurator.fromJSON(jsonData);
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
        if (
          isNotNullable(inputElement.element) &&
          inputElement.element.getAttribute('type') === INPUT_TYPES.VALUE &&
          inputElement.element instanceof HTMLInputElement &&
          (!REGEX.test(inputElement.element.value) ||
            inputElement.element.value.length > 6)
        )
          inputElement.element.value = '';
        if (this.onInputChangeCallback) {
          this.onInputChangeCallback();
        }
      });
    }

    // console.log(inputElement.element);
    return inputElement;
  }
}
