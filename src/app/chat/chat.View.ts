import View from '../../components/view';
import { chatParameters } from '../../lib/types/consts';
import { CssClasses, CssTags } from '../../lib/types/enums';
import { IView, IViewParameters } from '../../lib/types/interfaces';
import Router from '../../router/router';

export default class ChatView extends View implements IView {
  public router: Router | undefined;
  constructor(
    parameters: IViewParameters = chatParameters /*, router: Router*/
  ) {
    super(parameters);
    //this.router = router;
    this.configureView();
  }

  public configureView(): void {
    this.addTextMessage({
      tag: CssTags.Form,
      classNames: [CssClasses.Login],
      textContent: 'Chat',
    });
  }
}
