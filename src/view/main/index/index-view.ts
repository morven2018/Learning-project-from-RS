import View from '../../view';
import { isNotNullable } from '../../../util/is-nullable';
import ListCreator from '../../../util/list-option/input-field/list-option';
import type { IElementParameters } from '../../../types/interfaces';

const CssClasses = {
  INDEX: 'index',
  LIST_CLASS: 'list-of-option',
  BUTTON_ADD_ELEMENT: 'add-list-element__button',
};

const TEXT_CONTENT = {
  TITLE: 'Page is not founded',
  BACK: 'Back',
  BUTTON_ADD_ELEMENT: 'Add Option',
};

const PAGE = 'index';

export default class IndexView extends View {
  public list: ListCreator | undefined;
  constructor() {
    const parameters = {
      tag: 'section',
      classNames: [CssClasses.INDEX],
    };
    super(parameters);
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
