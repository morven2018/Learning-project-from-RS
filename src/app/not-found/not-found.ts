import View from '../../components/view';
import { notFoundParameters } from '../../lib/types/consts';
import { CssClasses, CssTags } from '../../lib/types/enums';
import { IView, IViewParameters } from '../../lib/types/interfaces';
import Router from '../../router/router';

export default class NotFoundView extends View implements IView {
  public router: Router | undefined;
  constructor(
    parameters: IViewParameters = notFoundParameters
    /*  router: Router*/
  ) {
    super(parameters);
    // this.router = router;
    this.configureView();
  }

  public configureView(): void {
    this.addTextMessage({
      tag: CssTags.Div,
      classNames: [CssClasses.NotFound],
      textContent: 'Not found',
    });

    const backBtnParameters = {
      tag: CssTags.Button,
      classNames: [CssClasses.Back],
      textContent: '<',
      callback: () => window.history.back(),
    };

    this.addButton(backBtnParameters);
  }
}
