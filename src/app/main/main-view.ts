import View from '../../components/view';
import { CssClasses, CssTags } from '../../lib/types/enums';
import { IMainView, IViewParameters } from '../../lib/types/interfaces';

const defaultParameters = {
  tag: CssTags.Main,
  classNames: [CssClasses.Main],
};

export default class MainView extends View implements IMainView {
  constructor(parameters: IViewParameters = defaultParameters) {
    super(parameters);
  }

  public setContent(content: IMainView): void {
    const htmlElement = this.viewElementCreator?.getElement();
    if (htmlElement) htmlElement.replaceChildren();

    const innerElement = content.getHtmlElement();
    if (innerElement) this.viewElementCreator?.addInnerElement(innerElement);
  }
}
