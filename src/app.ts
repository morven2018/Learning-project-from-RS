import { isNullable } from './util/is-nullable';
import HeaderView from './view/header/header-view';

export default class App {
  private future = true;

  constructor() {
    this.createView();
  }

  private createView(): void {
    const header = new HeaderView();
    const headerElement = header.getHtmlElement();
    if (!isNullable(headerElement) && this.future)
      document.body.append(headerElement);
  }
}
