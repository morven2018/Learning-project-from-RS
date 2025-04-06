import View from '../../components/view';
import { CssClasses, CssTags } from '../../lib/types/enums';
import type { IView } from '../../lib/types/interfaces';

export default class MainView extends View implements IView {
  constructor() {
    const parameters = {
      tag: CssTags.Main,
      classNames: [CssClasses.Main],
    };
    super(parameters);
  }

  public setContent(content: IView): void {
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
