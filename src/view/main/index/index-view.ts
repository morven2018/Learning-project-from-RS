import View from '../../view';
import { isNotNullable } from '../../../util/is-nullable';
import ListCreator from '../../../util/list-option/input-field/list-option';
import type { IElementParameters } from '../../../types/interfaces';
import type State from '../../../state/state';

const CssClasses = {
  INDEX: 'index',
  LIST_CLASS: 'list-of-option',
  BUTTON_ADD_ELEMENT: 'add-list-element__button',
  BUTTON_PASTE_LIST: 'paste-list__button',
  BUTTON_CLEAR_LIST: 'clear-list__button',
};

const TEXT_CONTENT = {
  TITLE: 'Page is not founded',
  BACK: 'Back',
  BUTTON_ADD_ELEMENT: 'Add Option',
  BUTTON_PASTE_LIST: 'Paste List',
  BUTTON_CLEAR_LIST: 'Clear List',
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
          this.list?.addElement();
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
    }
  }

  private addList(): void {
    const parameters: IElementParameters = {
      tag: 'ul',
      classNames: [CssClasses.LIST_CLASS],
      textContent: '',
    };
    this.list = new ListCreator(parameters);
    if (isNotNullable(this.viewElementCreator))
      this.viewElementCreator.addInnerElement(this.list);
  }
}
