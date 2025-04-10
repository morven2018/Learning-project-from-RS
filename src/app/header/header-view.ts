import View from '../../components/view';
import { CssClasses, CssTags, Pages } from '../../lib/types/enums';
import type { IHeaderView, IRouter } from '../../lib/types/interfaces';
import './header.scss';

const buttonsInfo = [
  {
    tag: CssTags.Button,
    classNames: [CssClasses.ToGarage],
    textContent: 'To Garage',
    route: Pages.Garage,
  },
  {
    tag: CssTags.Button,
    classNames: [CssClasses.ToWinners],
    textContent: 'To Winners',
    route: Pages.Winners,
  },
];

export default class HeaderView extends View implements IHeaderView {
  private buttons: HTMLElement[] = [];

  constructor(router: IRouter) {
    const parameters = {
      tag: CssTags.Header,
      classNames: [CssClasses.Header],
    };
    super(parameters);
    this.configureView(router);
    const currentPath = HeaderView.getNormalizedPath() || Pages.Garage;
    this.updateActiveState(currentPath);
  }

  public static getNormalizedPath(): string {
    const hash = globalThis.location.hash
      ? globalThis.location.hash.slice(1)
      : '';
    const path = hash.split('?')[0];
    const result = path?.replaceAll(/^\/|\/$/g, '').toLowerCase();
    return result && typeof result === 'string' ? result : '';
  }

  public static isValidPage(value: string): value is Pages {
    return Object.values<string>(Pages).includes(value);
  }

  public configureView(router: IRouter): void {
    for (const buttonParameters of buttonsInfo) {
      const element = this.addButton(buttonParameters);
      element?.setCallback(() => router.navigateTo(buttonParameters.route));
      const htmlElement = element?.getElement();
      if (htmlElement) {
        htmlElement.dataset.route = buttonParameters.route;
        this.buttons.push(htmlElement);
      }
    }
  }

  public updateActiveState(currentRoute: string): void {
    const validRoutes = new Set([Pages.Garage, Pages.Winners]);
    if (HeaderView.isValidPage(currentRoute)) {
      const isRouteValid = validRoutes.has(currentRoute);

      for (const button of this.buttons) {
        const buttonRoute = button.dataset.route;
        const isCurrent = isRouteValid && buttonRoute === currentRoute;

        button.classList.toggle(CssClasses.Disable, isCurrent);
      }
    }
  }
}
