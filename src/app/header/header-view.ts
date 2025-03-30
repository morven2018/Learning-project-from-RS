import View from '../../components/view';
import { CssClasses, CssTags, Pages } from '../../lib/types/enums';
import { IHeaderView, IRouter } from '../../lib/types/interfaces';

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
  //public router: IRouter;
  private buttons: HTMLElement[] = [];
  // private currentRoute: string = Pages.Notfound;

  constructor(router: IRouter) {
    const parameters = {
      tag: CssTags.Header,
      classNames: [CssClasses.Header],
    };
    super(parameters);
    this.configureView(router);
    console.log(this.buttons);
    const currentPath = this.getNormalizedPath() || Pages.Garage;
    this.updateActiveState(currentPath);
  }

  private getNormalizedPath(): string {
    const hash = window.location.hash.substring(1);
    const path = hash.split('?')[0];
    return path.replace(/^\/|\/$/g, '').toLowerCase();
  }

  public configureView(router: IRouter): void {
    buttonsInfo.forEach((btnParams) => {
      const element = this.addButton(btnParams);
      element?.setCallback(() => router.navigateTo(btnParams.route));
      const htmlElement = element?.getElement();
      if (htmlElement) {
        htmlElement.setAttribute('data-route', btnParams.route);
        this.buttons.push(htmlElement);
      }
    });
  }

  private getCurrentPathFromUrl(): string {
    const hash = window.location.hash.substring(1);

    const normalizedPath = hash.replace(/^\/|\/$/g, '').toLowerCase();
    console.log(normalizedPath);

    return normalizedPath;
  }

  public updateActiveState(currentRoute: string): void {
    const validRoutes = [Pages.Garage, Pages.Winners];
    const isRouteValid = validRoutes.includes(currentRoute as Pages);

    this.buttons.forEach((button) => {
      const buttonRoute = button.getAttribute('data-route');
      const isCurrent = isRouteValid && buttonRoute === currentRoute;

      button.classList.toggle(CssClasses.Disable, isCurrent);
      //  button.toggleAttribute('disabled', isCurrent);
    });
  }
}
