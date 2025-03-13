import View from '../../view';
import { isNotNullable } from '../../../util/is-nullable';
import type State from '../../../state/state';

const CssClasses = {
  INDEX: 'index',
};
const PAGE = 'decision-picker';

export default class PickerView extends View {
  constructor(state: State) {
    console.log(state);
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
