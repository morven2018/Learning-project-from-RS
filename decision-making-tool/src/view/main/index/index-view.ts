import View from '../../view';
import { isNotNullable } from '../../../util/is-nullable';
import ListCreator from '../../../util/list-option/list-option';
import type { IElementParameters } from '../../../types/interfaces';
import State from '../../../state/state';
import ListConfigurator from '../../../util/list-configurator/list-configurator';
import type Router from '../../../router/router';
import MessageFormView from './form-view/message-form';
import './index-view.scss';
import addIcon from '../../../../asserts/icons/add.png';
import pasteIcon from '../../../../asserts/icons/paste.png';
import clearIcon from '../../../../asserts/icons/clear.png';
import saveIcon from '../../../../asserts/icons/downloads.png';
import uploadIcon from '../../../../asserts/icons/upload.png';
import startIcon from '../../../../asserts/icons/play.png';

const ADD_URL = addIcon.toString();
const PASTE_URL = pasteIcon.toString();
const CLEAR_URL = clearIcon.toString();
const SAVE_URL = saveIcon.toString();
const UPLOAD_URL = uploadIcon.toString();
const START_URL = startIcon.toString();

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

export default class IndexView extends View {
  public list: ListCreator | undefined;
  private state: State;
  private router: Router;

  constructor(state: State, router: Router) {
    const parameters = {
      tag: 'section',
      classNames: [CssClasses.INDEX],
    };
    super(parameters);
    this.state = state;
    this.router = router;
    this.configureView();
    this.list?.loadFromLocalStorage();
  }

  public configureView(): void {
    if (isNotNullable(this.viewElementCreator)) {
      this.addList();

      this.addButton({
        tag: 'button',
        classNames: [CssClasses.BUTTON_ADD_ELEMENT],
        textContent: '',
        title: TEXT_CONTENT.BUTTON_ADD_ELEMENT,
        callback: (): void => {
          this.list?.addElement({
            id: this.list.nextId.toString(),
            title: '',
            weight: '',
          });
        },
        imageURL: ADD_URL,
      });

      this.addButton({
        tag: 'button',
        classNames: [CssClasses.BUTTON_PASTE_LIST],
        textContent: '',
        title: TEXT_CONTENT.BUTTON_PASTE_LIST,
        callback: (): void => {},
        imageURL: PASTE_URL,
      });

      this.addButton({
        tag: 'button',
        classNames: [CssClasses.BUTTON_CLEAR_LIST],
        textContent: '',
        title: TEXT_CONTENT.BUTTON_CLEAR_LIST,
        callback: (): void => this.list?.clearList(true),
        imageURL: CLEAR_URL,
      });

      this.addButton({
        tag: 'button',
        classNames: [CssClasses.BUTTON_SAVE],
        textContent: '',
        title: TEXT_CONTENT.BUTTON_SAVE,
        callback: (): void => this.saveJSON(),
        imageURL: SAVE_URL,
      });

      this.addButton({
        tag: 'button',
        classNames: [CssClasses.BUTTON_UPLOAD],
        textContent: '',
        title: TEXT_CONTENT.BUTTON_UPLOAD,
        callback: (): void => this.uploadJSON(),
        imageURL: UPLOAD_URL,
      });

      this.addButton({
        tag: 'button',
        classNames: [CssClasses.BUTTON_START],
        textContent: '',
        title: TEXT_CONTENT.BUTTON_START,
        callback: (): void => {
          if (
            isNotNullable(this.list?.elements) &&
            this.list.elements.length > 1
          )
            this.router.navigateTo('#/decision-picker');
          else {
            const TEXT_MESSAGE = 'There are should at least 2 list option';
            const messageForm = new MessageFormView({
              message: TEXT_MESSAGE,
              onClose: (): void => {
                if (
                  isNotNullable(messageForm.viewElementCreator) &&
                  isNotNullable(messageForm.viewElementCreator.element)
                )
                  messageForm.viewElementCreator.element.remove();
              },
            });
            if (
              isNotNullable(messageForm.viewElementCreator?.element) &&
              typeof messageForm.viewElementCreator?.element !== 'string'
            )
              this.viewElementCreator?.element?.append(
                messageForm.viewElementCreator?.element
              );
          }
        },
        imageURL: START_URL,
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
    console.log('upload');
    const fileUpload = document.createElement('input');
    fileUpload.type = 'file';
    fileUpload.accept = '.json';

    fileUpload.addEventListener('change', (event) => {
      const handleFileUpload = async (): Promise<void> => {
        if (event.target instanceof HTMLInputElement) {
          const file = event.target.files?.[0];
          console.log('upload', file);
          if (isNotNullable(file)) {
            try {
              const content = await file.text();
              const jsonData: unknown = JSON.parse(content);
              console.log('upload', jsonData);
              if (isNotNullable(this.list)) {
                const data = ListConfigurator.fromJSON(jsonData);
                if (
                  isNotNullable(data) &&
                  ListConfigurator.isIJSONObject(data)
                ) {
                  for (const item of data.list) {
                    if (ListConfigurator.isIElementInfo(item)) {
                      const newElement = this.list.addElement(item);
                      if (isNotNullable(newElement)) {
                        this.list.elements.push(newElement);
                      }
                    }
                  }
                  this.list.nextId = data.lastId + 1;

                  State.saveToLocalStorage(
                    this.list.elements,
                    this.list.nextId
                  );
                }
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
    this.list.state.setListCreator(this.list);
    if (isNotNullable(this.viewElementCreator))
      this.viewElementCreator.addInnerElement(this.list);
  }
}
