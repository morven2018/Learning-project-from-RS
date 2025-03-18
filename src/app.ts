import Router from './router/router';
import State from './state/state';
import { isNotNullable, isNullable } from './util/is-nullable';
import HeaderView from './view/header/header-view';
import MainView from './view/main/view';
import './style.scss';

export default class App {
  private header: HeaderView;
  private main: MainView;
  private state: State;

  constructor() {
    this.state = new State();
    this.header = new HeaderView();
    this.main = new MainView(this.state);
    new Router(this.main, this.state);

    this.createView();
  }

  private createView(): void {
    const headerElement = this.header.getHtmlElement();
    const mainElement = this.main.getHtmlElement();
    if (!isNullable(headerElement) && isNotNullable(mainElement))
      document.body.append(headerElement, mainElement);
  }
}
