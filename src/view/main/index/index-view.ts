import View from '../../view';
import { isNotNullable } from '../../../util/is-nullable';
import ListCreator from '../../../util/list-option/input-field/list-option';
import type { IElementParameters } from '../../../types/interfaces';

const CssClasses = {
  INDEX: 'index',
  LIST_CLASS: 'list-of-option',
};
const PAGE = 'index';

export default class IndexView extends View {
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
    }
  }

  private addList(): void {
    const parameters: IElementParameters = {
      tag: 'ul',
      classNames: [CssClasses.LIST_CLASS],
      textContent: '',
    };
    const list = new ListCreator(parameters);
    if (isNotNullable(this.viewElementCreator))
      this.viewElementCreator.addInnerElement(list);
  }
}
