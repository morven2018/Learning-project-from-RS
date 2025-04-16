import View from '../../components/view';
import { CssClasses, CssTags } from '../../lib/types/enums';
import { IView, IViewParameters } from '../../lib/types/interfaces';

const defaultParameters = {
  tag: CssTags.Section,
  classNames: [CssClasses.About],
};

export default class AboutView extends View implements IView {
  constructor(parameters: IViewParameters = defaultParameters) {
    super(parameters);

    this.configureView();
  }

  public configureView(): void {
    this.addTextMessage({
      tag: CssTags.Form,
      classNames: [CssClasses.Login],
      textContent: 'about',
    });
  }
}
