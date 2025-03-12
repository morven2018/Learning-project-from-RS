import Router from './router/router';
import State from './state/state';
import { isNotNullable, isNullable } from './util/is-nullable';
import HeaderView from './view/header/header-view';
import MainView from './view/main/view';

export default class App {
  private header: HeaderView;
  private main: MainView;

  constructor() {
    const state = new State();
    this.header = new HeaderView();
    this.main = new MainView();
    new Router(this.main, state);

    this.createView();
  }

  private createView(): void {
    const headerElement = this.header.getHtmlElement();
    const mainElement = this.main.getHtmlElement();
    if (!isNullable(headerElement) && isNotNullable(mainElement))
      document.body.append(headerElement, mainElement);
  }
}
