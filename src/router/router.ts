import AboutView from '../app/about/about';
import ChatView from '../app/chat/chat.View';
import LoginView from '../app/login/loginView';
import NotFoundView from '../app/not-found/not-found';
// import ElementCreator from '../components/element-creator';
import InfoForm from '../components/forms/infoForm';
import {
  aboutParameters,
  chatParameters,
  loginParameters,
  notFoundParameters,
} from '../lib/types/consts';
import { CssClasses, CssTags, RequestTypes } from '../lib/types/enums';

import type { IMainView, IState, IUserResponse } from '../lib/types/interfaces';
import ApiClient from '../lib/utils/api-client';

const infoFormParameters = {
  tag: CssTags.Form,
  classNames: [CssClasses.ErrorForm],
};
const notAuthorized = 'the user was not authorized';
export default class Router /* implements IRouter */ {
  private mainView: IMainView;
  public api: ApiClient;
  public state: IState | undefined;
  private routeMap: Record<string, () => void>;

  constructor(mainView: IMainView, state: IState, api: ApiClient) {
    this.mainView = mainView;
    this.state = state;
    this.api = api;

    this.restoreSession().finally(() => {
      this.setupWebSocketHandlers();
      this.routeMap = this.buildRouteMap();
      this.setupRouting();
    });

    this.routeMap = this.buildRouteMap();
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
    if (globalThis.history.length > 1) {
      globalThis.history.back();
    } else {
      this.navigateTo('/');
    }
  }

  public static normalizePath(path: string): string {
    return path
      .replaceAll(/^[#/]\s*/g, '')
      .replaceAll(/\/$/g, '')
      .toLowerCase();
  }

  public navigateTo(path: string): void {
    const normalizedPath = Router.normalizePath(path);

    if (this.routeMap[normalizedPath] || this.routeMap[`/${normalizedPath}`]) {
      globalThis.history.pushState(
        { path: normalizedPath },
        '',
        `/${normalizedPath}`
      );
      this.handleRoute();
    } else {
      this.showNotFound();
    }
  }

  private setupWebSocketHandlers(): void {
    this.api.setMessageHandler((data) => {
      try {
        const message = JSON.parse(data);
        this.handleMessage(message);
      } catch (error) {
        console.error('Error parsing WebSocket message:', error);
      }
    });
  }

  private handleMessage(message: unknown): void {
    if (
      message &&
      typeof message === 'object' &&
      'type' in message &&
      message.type
    ) {
      if (message.type === RequestTypes.UserLogin) {
        this.handleLogin(message);
      }
      if (message.type === RequestTypes.Error) {
        this.handleError(message);
      }
      if (message.type === RequestTypes.UserLogout) {
        this.handleLogout(message);
      }
    }
  }

  private handleLogin(message: unknown): void {
    if (
      Router.isUserResponse(message) &&
      'isLogined' in message.payload.user &&
      typeof message.payload.user.isLogined === 'boolean'
    ) {
      const data = {
        login: message.payload.user.login,
        password: this.api.user?.password,
        isLogined: true,
      };
      this.state?.login(data);
      if (this.api.user) this.api.user.isLogined = true;

      localStorage.setItem('auth', JSON.stringify(data));
    }
    this.navigateTo('/chat');
  }

  private handleLogout(message: unknown): void {
    if (Router.isUserResponse(message)) {
      this.state?.logout();
      localStorage.removeItem('auth');
    }
    this.navigateTo('/login');
  }

  private handleError(message: unknown): void {
    if (
      message instanceof Object &&
      'payload' in message &&
      message.payload instanceof Object &&
      'error' in message.payload &&
      typeof message.payload.error === 'string'
    ) {
      if (message.payload.error === notAuthorized) {
        this.state?.logout();
        localStorage.removeItem('auth');
        this.navigateTo('/login');
        return;
      }
      const form = new InfoForm({
        ...infoFormParameters,
        textContent: message.payload.error.toString(),
      });
      if (form.element) {
        document.body.append(form.element);
      }
    }
  }

  private static isUserResponse(message: unknown): message is IUserResponse {
    return (
      typeof message === 'object' &&
      message !== null &&
      'type' in message &&
      'payload' in message &&
      typeof message.payload === 'object' &&
      message.payload !== null &&
      'user' in message.payload &&
      typeof message.payload.user === 'object' &&
      message.payload.user !== null &&
      'login' in message.payload.user &&
      typeof message.payload.user.login === 'string'
    );
  }

  private buildRouteMap(): Record<string, () => void> {
    return {
      '': () => {
        if (this.state?.isAuthenticated) this.navigateTo('/chat');
        else this.mainView.setContent(new LoginView(loginParameters, this));
      },
      login: () => {
        if (this.state?.isAuthenticated) this.navigateTo('/chat');
        else this.mainView.setContent(new LoginView(loginParameters, this));
      },
      chat: () => {
        if (!this.state?.isAuthenticated) {
          this.navigateTo('/login');
        } else if (this.api.user) {
          this.mainView.setContent(
            new ChatView(chatParameters, this, this.api.user)
          );
        }
      },
      about: () => this.mainView.setContent(new AboutView(aboutParameters)),
      'not-found': () => this.showNotFound(),
    };
  }

  private setupRouting(): void {
    globalThis.addEventListener('popstate', () => this.handleRoute());

    window.addEventListener('load', () => this.handleRoute());

    this.handleRoute();
  }

  private handleRoute(): void {
    const path = Router.normalizePath(globalThis.location.pathname);
    const routeHandler = this.routeMap[path] || this.routeMap[`/${path}`];

    if (routeHandler) {
      routeHandler();
    } else {
      this.showNotFound();
    }
  }

  private showNotFound(): void {
    this.mainView.setContent(new NotFoundView(notFoundParameters));
    globalThis.history.replaceState({}, '', '/not-found');
  }

  private async restoreSession(): Promise<void> {
    const authData = localStorage.getItem('auth');
    if (!authData) return;

    try {
      const { login, password, expires } = JSON.parse(authData);

      if (expires && expires < Date.now()) {
        localStorage.removeItem('auth');
        return;
      }

      if (login && password) {
        this.state?.login({ login, password, isLogined: true });

        if (this.api.user) {
          this.api.user.login = login;
          this.api.user.password = password;
          this.api.user.isLogined = true;
        }

        const response = await this.api.login({ login, password });

        if (response) {
          const newAuthData = {
            login,
            password,
            isLogined: true,
            expires: Date.now() + 24 * 60 * 60 * 1000,
          };
          localStorage.setItem('auth', JSON.stringify(newAuthData));
        } else {
          throw new Error('Auto-login failed');
        }
      }
    } catch (error) {
      console.error('Session restore error:', error);
      this.handleLogout({ type: RequestTypes.UserLogout, payload: {} });
    }
  }
}
