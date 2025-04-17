import ElementCreator from './element-creator';
import type {
  IElementParameters,
  IImageCreator,
  IImageParameters,
} from '../lib/types/interfaces';

export default class ImageCreator
  extends ElementCreator
  implements IImageCreator
{
  constructor(parameters: IElementParameters) {
    super(parameters);
    this.createElement(parameters);
    console.log(parameters);
    if (parameters.imageURL && parameters.title) {
      this.element?.setAttribute('src', parameters.imageURL);
      this.element?.setAttribute('title', parameters.title);
      this.element?.setAttribute('aria-label', parameters.title);
    } else console.log('Image problem');
  }

  public update(newParameters: Partial<IImageParameters>): void {
    const imgElement = this.element;
    if (imgElement instanceof HTMLImageElement) {
      if (newParameters.imageURL) {
        imgElement.src = newParameters.imageURL;
      }
      if (newParameters.imageAlt) {
        imgElement.alt = newParameters.imageAlt;
      }
      if (newParameters.title) {
        imgElement.title = newParameters.title;
        imgElement.setAttribute('aria-label', newParameters.title);
      }
    }
  }
}
