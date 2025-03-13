import View from '../../view';
import { isNotNullable } from '../../../util/is-nullable';
import ListCreator from '../../../util/list-option/list-option';
import type { IElementParameters } from '../../../types/interfaces';
import type State from '../../../state/state';
import ListConfigurator from '../../../util/list-configurator/list-configurator';

const CssClasses = {
  INDEX: 'index',
  LIST_CLASS: 'list-of-option',
  BUTTON_ADD_ELEMENT: 'add-list-element__button',
  BUTTON_PASTE_LIST: 'paste-list__button',
  BUTTON_CLEAR_LIST: 'clear-list__button',
  BUTTON_SAVE: 'save__button',
  BUTTON_UPLOAD: 'upload__button',
  BUTTON_START: 'start__button',
};

const TEXT_CONTENT = {
  TITLE: 'Page is not founded',
  BACK: 'Back',
  BUTTON_ADD_ELEMENT: 'Add Option',
  BUTTON_PASTE_LIST: 'Paste List',
  BUTTON_CLEAR_LIST: 'Clear List',
  BUTTON_SAVE: 'Save list to the file',
  BUTTON_UPLOAD: 'Load list from file',
  BUTTON_START: 'Start',
};

const PAGE = 'index';

export default class IndexView extends View {
  public list: ListCreator | undefined;
  private state: State;
  constructor(state: State) {
    const parameters = {
      tag: 'section',
      classNames: [CssClasses.INDEX],
    };
    super(parameters);
    this.state = state;
    this.configureView();
    this.list?.loadFromLocalStorage();
  }

  public configureView(): void {
    if (isNotNullable(this.viewElementCreator)) {
      this.viewElementCreator.setTextContent(PAGE);

      this.addList();

      this.addButton({
        tag: 'button',
        classNames: [CssClasses.BUTTON_ADD_ELEMENT],
        textContent: TEXT_CONTENT.BUTTON_ADD_ELEMENT,
        callback: (): void => {
          this.list?.addElement({
            id: this.list.nextId.toString(),
            title: '',
            weight: '',
          });
        },
        imageURL: '',
      });

      this.addButton({
        tag: 'button',
        classNames: [CssClasses.BUTTON_PASTE_LIST],
        textContent: TEXT_CONTENT.BUTTON_PASTE_LIST,
        callback: (): void => {},
        imageURL: '',
      });

      this.addButton({
        tag: 'button',
        classNames: [CssClasses.BUTTON_CLEAR_LIST],
        textContent: TEXT_CONTENT.BUTTON_CLEAR_LIST,
        callback: (): void => this.list?.clearList(),
        imageURL: '',
      });

      this.addButton({
        tag: 'button',
        classNames: [CssClasses.BUTTON_SAVE],
        textContent: TEXT_CONTENT.BUTTON_SAVE,
        callback: (): void => this.saveJSON(),
        imageURL: '',
      });

      this.addButton({
        tag: 'button',
        classNames: [CssClasses.BUTTON_UPLOAD],
        textContent: TEXT_CONTENT.BUTTON_UPLOAD,
        callback: (): void => this.uploadJSON(),
        imageURL: '',
      });

      this.addButton({
        tag: 'button',
        classNames: [CssClasses.BUTTON_START],
        textContent: TEXT_CONTENT.BUTTON_START,
        callback: (): void => {},
        imageURL: '',
      });
    }
  }

  public saveJSON(): void {
    if (isNotNullable(this.list)) {
      const content = ListConfigurator.toJSON(
        this.list.getElements(),
        this.list?.nextId
      );
      const jsonContent = JSON.stringify(content);
      const blob = new Blob([jsonContent], { type: 'application/json' });
      const link = document.createElement('a');
      link.href = URL.createObjectURL(blob);
      link.download = 'option-list.json';
      link.click();
      URL.revokeObjectURL(link.href);
    }
  }

  public uploadJSON(): void {
    const fileUpload = document.createElement('input');
    fileUpload.type = 'file';
    fileUpload.accept = '.json';

    fileUpload.addEventListener('change', (event) => {
      const handleFileUpload = async (): Promise<void> => {
        if (event.target instanceof HTMLInputElement) {
          const file = event.target.files?.[0];
          if (isNotNullable(file)) {
            try {
              const content = await file.text();
              const jsonData: unknown = JSON.parse(content);
              if (isNotNullable(this.list)) {
                ListConfigurator.fromJSON(jsonData, this.list);
              }
            } catch (error) {
              console.error(error);
            }
          }
        }
      };

      handleFileUpload().catch((error) => {
        console.error(error);
      });
    });

    fileUpload.click();
  }

  private addList(): void {
    const parameters: IElementParameters = {
      tag: 'ul',
      classNames: [CssClasses.LIST_CLASS],
      textContent: '',
    };
    this.list = new ListCreator(parameters, this.state);
    if (isNotNullable(this.viewElementCreator))
      this.viewElementCreator.addInnerElement(this.list);
  }
}
