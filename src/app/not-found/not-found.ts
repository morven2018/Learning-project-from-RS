import View from '../../components/view';
import { CssClasses, CssTags } from '../../lib/types/enums';
import { IView, IViewParameters } from '../../lib/types/interfaces';

const defaultParameters = {
  tag: CssTags.Section,
  classNames: [CssClasses.NotFound],
};

export default class NotFoundView extends View implements IView {
  constructor(parameters: IViewParameters = defaultParameters) {
    super(parameters);

    this.configureView();
  }

  public configureView(): void {
    this.addTextMessage({
      tag: CssTags.Div,
      classNames: [CssClasses.NotFound],
      textContent: 'Not found',
    });
  }
}
