import ElementCreator from './element-creator';
import type {
  IElementCreator,
  IElementParameters,
} from '../lib/types/interfaces';

export default class InputCreator
  extends ElementCreator
  implements IElementCreator
{
  public createElement(parameters: IElementParameters): void {
    super.createElement(parameters);
    if (parameters.options) {
      for (const key in parameters.options) {
        if (
          parameters.options[key] &&
          typeof parameters.options[key] === 'string'
        )
          this.element?.setAttribute(key, parameters.options[key]);
      }
    }
  }
}
