import GarageView from '../app/garage/garage-view';
import NotFoundView from '../app/not-found/not-found-view';
import WinnersView from '../app/winners/winners-view';
// import State from '../lib/store';
import { IMainView, IRouter } from '../lib/types/interfaces';

export default class Router implements IRouter {
  private mainView: IMainView;
  // private state: IState;

  constructor(mainView: IMainView) {
    this.mainView = mainView;
    // this.state = state;
    this.setupRouting();
  }

  public navigateTo(path: string): void {
    // this.saveState();
    globalThis.location.hash = path;
  }

  private setupRouting(): void {
    globalThis.addEventListener('hashchange', () => {
      // this.saveState();
      this.handleRoute();
    });
    this.handleRoute();
  }

  private handleRoute(): void {
    const hash = window.location.pathname.substring(1);

    switch (hash) {
      case '#/winners':
      case 'winners':
      case '/winners': {
        this.mainView.setContent(new WinnersView());
        break;
      }
      case '#/':
      case '#/index':
      case '#/garage':
      case '':
      case '/': {
        this.mainView.setContent(new GarageView());
        break;
      }
      default: {
        this.mainView.setContent(new NotFoundView());
        break;
      }
    }
  }

  /* private saveState(): void {
     if (this.mainView.state) {
      const elements = this.mainView.state.getElements();
      const nextId = this.mainView.state.getNextId();

      if (elements && nextId) {
        State.saveToLocalStorage(elements, nextId);
      }
    }
  } */
}
