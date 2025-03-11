import { isNotNullable, isNullable } from './util/is-nullable';
import HeaderView from './view/header/header-view';
import MainView from './view/main/view';

export default class App {
  private main: MainView | undefined;
  constructor() {
    this.main = undefined;
    this.createView();
  }

  private createView(): void {
    const header = new HeaderView();
    this.main = new MainView();
    const headerElement = header.getHtmlElement();
    const mainElement = this.main.getHtmlElement();
    if (!isNullable(headerElement) && isNotNullable(mainElement))
      document.body.append(headerElement, mainElement);
  }
}
