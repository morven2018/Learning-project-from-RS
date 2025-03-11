import View from '../../view';
import { isNotNullable } from '../../../util/is-nullable';

const CssClasses = {
  INDEX: 'not_found',
};
const PAGE = '404';

export default class NotFoundView extends View {
  constructor() {
    const parameters = {
      tag: 'section',
      classNames: [CssClasses.INDEX],
    };
    super(parameters);
    this.configureView();
  }

  public configureView(): void {
    if (isNotNullable(this.viewElementCreator))
      this.viewElementCreator.setTextContent(PAGE);
  }
}
