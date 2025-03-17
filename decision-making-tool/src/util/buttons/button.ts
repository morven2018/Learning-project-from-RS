import ElementCreator from '../element-creator';
import type { IElementParameters } from '../../types/interfaces';

export default class ButtonCreator extends ElementCreator {
  public createElement(parameters: IElementParameters): void {
    super.createElement(parameters);
    if (parameters.id)
      this.element?.setAttribute('id', parameters.id.toString());

    if (parameters.imageURL) {
      const imgElement = document.createElement('img');
      imgElement.src = parameters.imageURL;
      imgElement.alt = parameters.title || 'Icon';
      this.element?.append(imgElement);
      imgElement.className = 'icon';
    }
  }
}
