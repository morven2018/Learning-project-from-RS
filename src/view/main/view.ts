import { isNotNullable } from '../../util/is-nullable';
import View from '../view';

const CssClasses = {
  MAIN: 'main',
};

export default class MainView extends View {
  constructor() {
    const parameters = {
      tag: 'main',
      classNames: [CssClasses.MAIN],
    };
    super(parameters);
  }

  public setContent(content: View): void {
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

  /* public getPages(): void {
    const indexView = new IndexView();
    this.setContent(indexView);
  } */
}
