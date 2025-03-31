import Router from '../router/router';
import HeaderView from './header/header-view';
import MainView from './main/main-view';

import './styles.scss';

export default class App {
  private header: HeaderView;
  private main: MainView | undefined;
  private router: Router;
  // private state: State;

  constructor() {
    this.main = new MainView();
    this.router = new Router(this.main);
    this.header = new HeaderView(this.router);

    this.router.setHeaderView(this.header);

    this.createView();
  }

  private createView(): void {
    const headerElement = this.header.getHtmlElement();
    const mainElement = this.main?.getHtmlElement();
    if (headerElement && mainElement)
      document.body.append(headerElement, mainElement);
  }
}
