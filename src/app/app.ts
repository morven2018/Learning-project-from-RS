import { State } from '../lib/state';
import type { IMainView, IState } from '../lib/types/interfaces';
import ApiClient from '../lib/utils/api-client';

import Router from '../router/router';
import MainView from './main/main-view';
import './styles.scss';

export default class App {
  public state: IState;
  private main: IMainView | undefined;
  public api: ApiClient;

  constructor() {
    this.api = new ApiClient();
    this.state = new State();

    this.main = new MainView();
    new Router(this.main, this.state, this.api);

    this.createView();
  }

  private createView(): void {
    const mainElement = this.main?.getHtmlElement();
    if (mainElement) document.body.append(mainElement);
  }
}
