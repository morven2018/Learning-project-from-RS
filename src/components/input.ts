import type {
  IElementCreator,
  IElementParameters,
} from '../lib/types/interfaces';
import ElementCreator from './element-creator';

export default class InputCreator
  extends ElementCreator
  implements IElementCreator
{
  public createElement(parameters: IElementParameters): void {
    super.createElement(parameters);
    if (parameters.options) {
      for (const key in parameters.options) {
        if (parameters.options[key])
          this.element?.setAttribute(key, parameters.options[key]);
      }
    }
  }
}
