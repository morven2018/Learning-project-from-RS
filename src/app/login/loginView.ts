import View from '../../components/view';
import { loginParameters } from '../../lib/types/consts';
import { CssClasses, CssTags } from '../../lib/types/enums';
import { IView, IViewParameters } from '../../lib/types/interfaces';
import Router from '../../router/router';

export default class LoginView extends View implements IView {
  public router: Router | undefined;
  constructor(parameters: IViewParameters = loginParameters) {
    super(parameters);
    //this.router = router;
    this.configureView();
  }

  public configureView(): void {
    this.addTextMessage({
      tag: CssTags.Div,
      classNames: [CssClasses.Login],
      textContent: 'Login',
    });
  }
}
