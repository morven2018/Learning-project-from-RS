import type MainView from '../view/main/view';
import IndexView from '../view/main/index/index-view';
import PickerView from '../view/main/decision-picker/picker-view';
import NotFoundView from '../view/main/not-found/not-found-view';
import type State from '../state/state';

export default class Router {
  private mainView: MainView;
  private state: State;

  constructor(mainView: MainView, state: State) {
    this.mainView = mainView;
    this.state = state;
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
      case '#/decision-picker':
      case 'decision-picker': {
        this.mainView.setContent(new PickerView());
        break;
      }
      case '#/':
      case '#/index':
      case '': {
        this.mainView.setContent(new IndexView(this.state));
        break;
      }
      default: {
        this.mainView.setContent(new NotFoundView());
        break;
      }
    }
  }
}
