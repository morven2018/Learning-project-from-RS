import View from '../../components/view';
import { CssClasses, CssTags } from '../../lib/types/enums';
import { IView } from '../../lib/types/interfaces';

export default class MainView extends View implements IView {
  constructor() {
    const params = {
      tag: CssTags.Main,
      classNames: [CssClasses.Main],
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
