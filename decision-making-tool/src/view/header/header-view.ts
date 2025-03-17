import View from '../view';
import { isNotNullable } from '../../util/is-nullable';
import type { IHeaderView } from '../../types/interfaces';

const NAME_OF_APP = 'Decision Making Tool';

const CssClasses = {
  HEADER: 'header',
};

export default class HeaderView extends View implements IHeaderView {
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
