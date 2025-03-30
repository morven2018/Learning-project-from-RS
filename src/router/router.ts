import GarageView from '../app/garage/garage-view';
import NotFoundView from '../app/not-found/not-found-view';
import WinnersView from '../app/winners/winners-view';
// import State from '../lib/store';
import { IHeaderView, IMainView, IRouter } from '../lib/types/interfaces';

export default class Router implements IRouter {
  private mainView: IMainView;
  private readonly routeMap: Record<string, () => void>;
  private headerView: IHeaderView | undefined = undefined;
  // private state: IState;

  constructor(mainView: IMainView) {
    this.mainView = mainView;
    // this.state = state;
    this.routeMap = this.buildRouteMap();
    this.setupRouting();
  }

  public setHeaderView(headerView: IHeaderView): void {
    this.headerView = headerView;
  }

  private buildRouteMap(): Record<string, () => void> {
    return {
      '#/winners': () => this.mainView.setContent(new WinnersView()),
      winners: () => this.mainView.setContent(new WinnersView()),
      '/winners': () => this.mainView.setContent(new WinnersView()),
      '#/': () => this.mainView.setContent(new GarageView()),
      '#/index': () => this.mainView.setContent(new GarageView()),
      '#/garage': () => this.mainView.setContent(new GarageView()),
      '': () => this.mainView.setContent(new GarageView()),
      '/': () => this.mainView.setContent(new GarageView()),
    };
  }

  public get validRoutes(): string[] {
    return Object.keys(this.routeMap)
      .filter((route) => route !== '')
      .map((route) => route.replace(/^#\/?|\/$/g, ''))
      .filter((value, index, self) => self.indexOf(value) === index);
  }

  public navigateTo(path: string): void {
    const normalizedPath = this.normalizePath(path);
    if (
      this.routeMap[normalizedPath] ||
      this.routeMap[`#/${normalizedPath}`] ||
      this.routeMap[`/${normalizedPath}`]
    ) {
      window.location.hash = `#/${normalizedPath}`;
    } else {
      this.showNotFound();
    }
  }

  private setupRouting(): void {
    globalThis.addEventListener('hashchange', () => {
      // this.saveState();
      this.handleRoute();
    });
    this.handleRoute();
  }

  private handleRoute(): void {
    const hash = window.location.hash;
    const normalizedPath = this.normalizePath(hash);
    const routeHandler =
      this.routeMap[hash] ||
      this.routeMap[hash.substring(1)] ||
      this.routeMap[`/${hash.substring(1)}`];

    // const currentRoute = hash ? this.normalizePath(hash) : 'garage';

    if (routeHandler) {
      routeHandler();
      if (this.headerView) {
        this.headerView.updateActiveState(normalizedPath);
      }
    } else {
      this.showNotFound();
    }
  }

  private normalizePath(path: string): string {
    return path.replace(/^#\/?|\/$/g, '').toLowerCase();
  }

  private showNotFound(): void {
    this.mainView.setContent(new NotFoundView());
  }
}
