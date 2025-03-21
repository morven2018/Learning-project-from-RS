import { isNotNullable } from '../../util/is-nullable';
import View from '../view';

import type { IMainView, IState, IView } from '../../types/interfaces';

const CssClasses = {
  MAIN: 'main',
};

export default class MainView extends View implements IMainView {
  public state: IState;
  constructor(state: IState) {
    const parameters = {
      tag: 'main',
      classNames: [CssClasses.MAIN],
    };
    super(parameters);
    this.state = state;
  }

  public setContent(content: IView): void {
    const htmlElement = this.viewElementCreator?.getElement();
    if (isNotNullable(htmlElement)) {
      while (htmlElement.firstElementChild) {
        htmlElement.firstElementChild.remove();
      }
      const innerElement = content.getHtmlElement();
      if (isNotNullable(innerElement))
        this.viewElementCreator?.addInnerElement(innerElement);
    }
  }
}
