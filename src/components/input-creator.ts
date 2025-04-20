import ElementCreator from './element-creator';

import type {
  IElementCreator,
  IElementParameters,
} from '../lib/types/interfaces';
import '../app/styles.scss';

export default class InputCreator
  extends ElementCreator
  implements IElementCreator
{
  public createElement(parameters: IElementParameters): void {
    super.createElement(parameters);
    if (!this.element) return;
    if (parameters.id) this.element.id = parameters.id;
    if (parameters.options) {
      for (const [key, value] of Object.entries(parameters.options)) {
        if (value) {
          if (key === 'required' && this.element instanceof HTMLInputElement)
            this.element.required = true;
          else this.element.setAttribute(key, value.toString());
        }
      }
    }
  }
}
