import View from '../../components/view';
import { IHeaderView } from '../../lib/types/interfaces';

const NAME_OF_APP = 'Decision Making Tool';

const CssClasses = {
  HEADER: 'garage',
};

export default class GarageView extends View implements IHeaderView {
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
