import NotFoundView from '../../app/not-found/not-found-view';
import State from '../state/state';

import type { IMainView, IRouter, IState } from '../types/interfaces.ts';

export default class Router implements IRouter {
  private mainView: IMainView;
  private state: IState;

  constructor(mainView: IMainView, state: IState) {
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
    });
    this.handleRoute();
  }

  private handleRoute(): void {
    const hash = globalThis.location.hash;

    switch (hash) {
      case '#/decision-picker':
      case 'decision-picker':
      case '/decision-picker': {
        this.mainView.setContent(new GarageView(this.state, this));
        break;
      }
      case '#/':
      case '#/index':
      case '':
      case '/': {
        this.mainView.setContent(new WinnersView(this.state, this));
        break;
      }
      default: {
        this.mainView.setContent(new NotFoundView(this));
        break;
      }
    }
  }

  private saveState(): void {
    if (this.mainView.state) {
      const elements = this.mainView.state.getElements();
      const nextId = this.mainView.state.getNextId();

      if (elements && nextId) {
        State.saveToLocalStorage(elements, nextId);
      }
    }
  }
}
