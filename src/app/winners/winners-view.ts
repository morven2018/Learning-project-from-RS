import View from '../../components/view';
import { IView } from '../../lib/types/interfaces';

const NAME_OF_APP = 'Decision Making Tool';

const CssClasses = {
  HEADER: 'winners',
};

export default class WinnersView extends View implements IView {
  constructor() {
    const parameters = {
      tag: 'main',
      classNames: [CssClasses.HEADER],
    };
    super(parameters);
    this.configureView();
  }

  public configureView(): void {
    if (this.viewElementCreator)
      this.viewElementCreator.setTextContent(NAME_OF_APP);
  }
}
