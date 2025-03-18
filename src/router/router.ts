import type MainView from '../view/main/view';
import IndexView from '../view/main/index/index-view';
import PickerView from '../view/main/decision-picker/picker-view';
import NotFoundView from '../view/main/not-found/not-found-view';
import State from '../state/state';
import { isNotNullable } from '../util/is-nullable';

export default class Router {
  private mainView: MainView;
  private state: State;

  constructor(mainView: MainView, state: State) {
    this.mainView = mainView;
    this.state = state;
    this.setupRouting();
  }

  public navigateTo(path: string): void {
    this.saveState();
    globalThis.location.hash = path;
  }

  private setupRouting(): void {
    globalThis.addEventListener('hashchange', () => {
      this.saveState();
      this.handleRoute();
      // console.log(789_879);
    });
    this.handleRoute();
  }

  private handleRoute(): void {
    const hash = globalThis.location.hash;

    switch (hash) {
      case '#/decision-picker':
      case 'decision-picker':
      case '/decision-picker': {
        this.mainView.setContent(new PickerView(this.state));
        break;
      }
      case '#/':
      case '#/index':
      case '':
      case '/': {
        this.mainView.setContent(new IndexView(this.state, this));
        break;
      }
      default: {
        this.mainView.setContent(new NotFoundView());
        break;
      }
    }
  }

  private saveState(): void {
    if (isNotNullable(this.mainView.state)) {
      const elements = this.mainView.state.getElements();
      const nextId = this.mainView.state.getNextId();

      if (isNotNullable(elements) && isNotNullable(nextId)) {
        State.saveToLocalStorage(elements, nextId);
      }
    }
  }
}
