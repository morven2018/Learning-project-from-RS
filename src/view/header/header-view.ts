import View from '../view';
import type { IFooterView } from '../../types/interfaces';
import { isNotNullable } from '../../util/is-nullable';

const NAME_OF_APP = 'Decision Making Tool';

const CssClasses = {
  HEADER: 'header',
};

export default class FooterView extends View implements IFooterView {
  constructor() {
    const parameters = {
      tag: 'header',
      classNames: [CssClasses.HEADER],
    };
    super(parameters);
    this.configureView();
  }

  public configureView(): void {
    if (isNotNullable(this.viewElementCreator))
      this.viewElementCreator.setTextContent(NAME_OF_APP);
  }
}
