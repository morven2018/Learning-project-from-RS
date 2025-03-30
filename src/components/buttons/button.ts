import { IButtonCreator, IElementParameters } from '../../lib/types/interfaces';
import ElementCreator from '../element-creator';

export default class ButtonCreator
  extends ElementCreator
  implements IButtonCreator
{
  public createElement(parameters: IElementParameters): void {
    super.createElement(parameters);
    if (parameters.id)
      this.element?.setAttribute('id', parameters.id.toString());

    if (parameters.title) {
      this.element?.setAttribute('title', parameters.title);
      this.element?.setAttribute('aria-label', parameters.title);
    }

    if (parameters.imageURL) {
      const imgElement = document.createElement('img');
      imgElement.src = parameters.imageURL;
      imgElement.alt = parameters.title || 'Icon';
      this.element?.append(imgElement);
      imgElement.className = 'icon';
    }
  }
}
