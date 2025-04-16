import AboutView from '../app/about/about';
import ChatView from '../app/chat/chat.View';
import LoginView from '../app/login/loginView';
import NotFoundView from '../app/not-found/not-found';

import { State } from '../lib/state';

import type { IMainView } from '../lib/types/interfaces';

export default class Router /* implements IRouter */ {
  private mainView: IMainView;
  private readonly routeMap: Record<string, () => void>;
  private state: State | undefined;

  constructor(mainView: IMainView, state: State) {
    this.mainView = mainView;
    this.state = state;
    this.routeMap = this.buildRouteMap(this.state);
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

  public static normalizePath(path: string): string {
    return path
      .replace(/^[#/]\s*/g, '')
      .replace(/\/$/g, '')
      .toLowerCase();
  }

  public navigateTo(path: string): void {
    const normalizedPath = Router.normalizePath(path);
    const hashPath = `#/${normalizedPath}`;

    if (
      this.routeMap[normalizedPath] ||
      this.routeMap[hashPath] ||
      this.routeMap[`/${normalizedPath}`] ||
      this.routeMap[`#${normalizedPath}`]
    )
      globalThis.location.hash = hashPath;
    else this.showNotFound();
  }

  private buildRouteMap(state: State): Record<string, () => void> {
    if (state.isAuthenticated)
      return {
        '#/login': () => this.mainView.setContent(new LoginView()),
        login: () => this.mainView.setContent(new LoginView()),
        '/login': () => this.mainView.setContent(new LoginView()),
        '#/chat': () => this.mainView.setContent(new ChatView()),
        chat: () => this.mainView.setContent(new ChatView()),
        '/chat': () => this.mainView.setContent(new ChatView()),
        '#/about': () => this.mainView.setContent(new AboutView()),
        about: () => this.mainView.setContent(new AboutView()),
        '/about': () => this.mainView.setContent(new AboutView()),
        '#/': () => this.mainView.setContent(new ChatView()),
        '#/index': () => this.mainView.setContent(new ChatView()),
        '': () => this.mainView.setContent(new ChatView()),
        '/': () => this.mainView.setContent(new ChatView()),
      };
    else
      return {
        '#/login': () => this.mainView.setContent(new LoginView()),
        login: () => this.mainView.setContent(new LoginView()),
        '/login': () => this.mainView.setContent(new LoginView()),
        '#/chat': () => this.mainView.setContent(new ChatView()),
        chat: () => this.mainView.setContent(new ChatView()),
        '/chat': () => this.mainView.setContent(new ChatView()),
        '#/about': () => this.mainView.setContent(new AboutView()),
        about: () => this.mainView.setContent(new AboutView()),
        '/about': () => this.mainView.setContent(new AboutView()),
        '#/': () => this.mainView.setContent(new LoginView()),
        '#/index': () => this.mainView.setContent(new LoginView()),
        '': () => this.mainView.setContent(new LoginView()),
        '/': () => this.mainView.setContent(new LoginView()),
      };
  }

  private setupRouting(): void {
    globalThis.addEventListener('hashchange', () => {
      this.handleRoute();
    });
    this.handleRoute();
  }

  private handleRoute(): void {
    const { hash, pathname } = globalThis.location;
    const routePath = hash || pathname;
    const normalizedPath = Router.normalizePath(routePath);
    const routeHandler =
      this.routeMap[routePath] ||
      this.routeMap[normalizedPath] ||
      this.routeMap[`#/${normalizedPath}`] ||
      this.routeMap[`/${normalizedPath}`] ||
      this.routeMap[`#${normalizedPath}`];

    if (routeHandler) routeHandler();
    else this.showNotFound();
  }

  private showNotFound(): void {
    this.mainView.setContent(new NotFoundView());
  }
}
