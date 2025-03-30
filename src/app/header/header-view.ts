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

  constructor(router: IRouter) {
    const parameters = {
      tag: CssTags.Header,
      classNames: [CssClasses.Header],
    };
    super(parameters);
    this.configureView(router);
  }

  public configureView(router: IRouter): void {
    buttonsInfo.forEach((btnParams) => {
      const element = this.addButton(btnParams);
      element?.setCallback(() => router.navigateTo(btnParams.route));
    });
  }
}
