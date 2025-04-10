import View from '../../components/view';
import { CssClasses, CssTags } from '../../lib/types/enums';
import type { IView } from '../../lib/types/interfaces';

export default class NotFoundView extends View implements IView {
  constructor() {
    const parameters = {
      tag: CssTags.Section,
      classNames: [CssClasses.NotFound],
    };
    super(parameters);
    this.configureView();
  }

  public configureView(): void {
    if (this.viewElementCreator)
      this.viewElementCreator.setTextContent('Page not found');
  }
}
