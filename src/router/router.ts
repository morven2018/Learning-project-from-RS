import AboutView from '../app/about/about';
import ChatView from '../app/chat/chat.View';
import LoginView from '../app/login/loginView';
import NotFoundView from '../app/not-found/not-found';
import {
  aboutParameters,
  chatParameters,
  loginParameters,
  notFoundParameters,
} from '../lib/types/consts';

import type { IMainView, IState } from '../lib/types/interfaces';

export default class Router /* implements IRouter */ {
  private mainView: IMainView;
  private readonly routeMap: Record<string, () => void>;
  private state: IState | undefined;

  constructor(mainView: IMainView, state: IState) {
    this.mainView = mainView;
    this.state = state;
    this.routeMap = this.buildRouteMap();
    this.setupRouting();
  }

  public get validRoutes(): string[] | undefined {
    const result = Object.keys(this.routeMap)
      .filter((route) => route !== '')
      .map((route) => Router.normalizePath(route))
      .filter((value, index, self) => self.indexOf(value) === index);
    if (
      Array.isArray(result) &&
      result.every((item) => typeof item === 'string')
    )
      return result;
    return undefined;
  }

  public goBack(): void {
    if (window.history.length > 1) {
      window.history.back();
    } else {
      this.navigateTo('/');
    }
  }

  public static normalizePath(path: string): string {
    return path
      .replace(/^[#/]\s*/g, '')
      .replace(/\/$/g, '')
      .toLowerCase();
  }

  public navigateTo(path: string): void {
    const normalizedPath = Router.normalizePath(path);

    if (this.routeMap[normalizedPath] || this.routeMap[`/${normalizedPath}`]) {
      window.history.pushState(
        { path: normalizedPath },
        '',
        `/${normalizedPath}`
      );
      this.handleRoute();
    } else {
      this.showNotFound();
    }
  }

  private buildRouteMap(): Record<string, () => void> {
    return {
      '': () => {
        if (this.state?.isAuthenticated) {
          this.mainView.setContent(new ChatView(chatParameters));
        } else {
          this.mainView.setContent(new LoginView(loginParameters));
        }
      },
      login: () => this.mainView.setContent(new LoginView(loginParameters)),
      chat: () => this.mainView.setContent(new ChatView(chatParameters)),
      about: () => this.mainView.setContent(new AboutView(aboutParameters)),
      'not-found': () => this.showNotFound(),
    };
  }

  private setupRouting(): void {
    window.addEventListener('popstate', () => this.handleRoute());

    window.addEventListener('load', () => this.handleRoute());

    this.handleRoute();
  }

  private handleRoute(): void {
    const path = Router.normalizePath(window.location.pathname);
    const routeHandler = this.routeMap[path] || this.routeMap[`/${path}`];

    if (routeHandler) {
      routeHandler();
    } else {
      this.showNotFound();
    }
  }

  private showNotFound(): void {
    this.mainView.setContent(new NotFoundView(notFoundParameters));
    window.history.replaceState({}, '', '/not-found');
  }
}
