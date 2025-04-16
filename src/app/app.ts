import { State } from '../lib/state';

import { IMainView } from '../lib/types/interfaces';
import Router from '../router/router';
import MainView from './main/main-view';

export default class App {
  public state: State;
  private main: IMainView | undefined;

  constructor() {
    this.state = new State();

    this.main = new MainView();
    new Router(this.main, this.state);

    this.createView();
  }

  private createView(): void {
    const mainElement = this.main?.getHtmlElement();
    if (mainElement) document.body.append(mainElement);
  }
}
