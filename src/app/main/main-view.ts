import View from '../../components/view';
import { IView } from '../../lib/types/interfaces';

const CssClasses = {
  MAIN: 'main',
};

export default class MainView extends View implements IView {
  constructor() {
    const params = {
      tag: 'main',
      classNames: [CssClasses.MAIN],
    };
    super(params);
  }

  setContent(content: IView) {
    const htmlElement = this.viewElementCreator?.getElement();
    if (htmlElement) {
      while (htmlElement.firstElementChild) {
        htmlElement.firstElementChild.remove();
      }
    }
    const innerElement = content.getHtmlElement();
    if (innerElement) this.viewElementCreator?.addInnerElement(innerElement);
  }
}
