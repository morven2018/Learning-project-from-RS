import type MainView from '../view/main/view';
import IndexView from '../view/main/index/index-view';
import PickerView from '../view/main/decision-picker/picker-view';
import NotFoundView from '../view/main/not-found/not-found-view';

export default class Router {
  private mainView: MainView;

  constructor(mainView: MainView) {
    this.mainView = mainView;
    this.setupRouting();
  }
  public navigateTo(path: string): void {
    console.log(this.mainView);
    globalThis.location.hash = path;
  }

  private setupRouting(): void {
    globalThis.addEventListener('hashchange', () => this.handleRoute());
    this.handleRoute();
  }

  private handleRoute(): void {
    const hash = globalThis.location.hash;

    switch (hash) {
      case '#/decision-picker': {
        this.mainView.setContent(new PickerView());
        break;
      }
      case '#/':
      case '#/index':
      case '': {
        this.mainView.setContent(new IndexView());
        break;
      }
      default: {
        this.mainView.setContent(new NotFoundView());
        break;
      }
    }
  }
}
