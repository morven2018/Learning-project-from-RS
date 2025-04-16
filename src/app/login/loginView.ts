import View from '../../components/view';
import { CssClasses, CssTags } from '../../lib/types/enums';
import { IView, IViewParameters } from '../../lib/types/interfaces';

const defaultParameters = {
  tag: CssTags.Form,
  classNames: [CssClasses.Login],
};

export default class LoginView extends View implements IView {
  constructor(parameters: IViewParameters = defaultParameters) {
    super(parameters);

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
