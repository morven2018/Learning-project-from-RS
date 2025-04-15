import ElementCreator from './element-creator';

import type {
  IButtonCreator,
  IElementParameters,
} from '../lib/types/interfaces';

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

    if (parameters.value) this.element?.setAttribute('value', parameters.value);

    if (parameters.callback)
      this.element?.addEventListener('click', parameters.callback);
  }

  public update(parameters: {
    tag?: string;
    classNames?: string[];
    textContent?: string;
    value?: string;
    callback?: (event: Event) => void;
  }): void {
    if (parameters.classNames && this.element) {
      this.element.className = parameters.classNames.join(' ');
    }
    if (parameters.textContent && this.element) {
      this.element.textContent = parameters.textContent;
    }
    if (parameters.value && this.element) {
      this.element.setAttribute('value', parameters.value);
    }
    if (parameters.callback) {
      this.setCallback(parameters.callback);
    }
  }
}
