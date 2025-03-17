import type {
  IElementParameters,
  IView,
  IViewParameters,
} from '../types/interfaces';
import ButtonCreator from '../util/buttons/button';
import ElementCreator from '../util/element-creator';
import { isNotNullable } from '../util/is-nullable';

export default class View implements IView {
  public viewElementCreator: ElementCreator | undefined;
  private defaultParameters = { tag: 'div', classNames: [] };

  constructor(parameters: IViewParameters = this.defaultParameters) {
    this.viewElementCreator = this.createView(parameters);
  }

  public getHtmlElement(): HTMLElement | undefined {
    if (isNotNullable(this.viewElementCreator))
      return this.viewElementCreator.getElement();
    return undefined;
  }

  public createView(parameters: IViewParameters): ElementCreator {
    const elementParameters = {
      tag: parameters.tag,
      classNames: parameters.classNames,
      textContent: '',
      callback: undefined,
    };
    this.viewElementCreator = new ElementCreator(elementParameters);

    return this.viewElementCreator;
  }

  public addImage(imageParameters: IElementParameters): void {
    if (isNotNullable(this.viewElementCreator)) {
      const img = new ElementCreator(imageParameters);
      const imgElement = img.getElement();
      if (isNotNullable(img) && isNotNullable(imgElement)) {
        if (imageParameters.imageURL)
          imgElement.setAttribute('src', imageParameters.imageURL);
        imgElement.setAttribute('alt', '404 Not Found');
        console.log(img, this.viewElementCreator);
        this.viewElementCreator.addInnerElement(img);
      } else {
        console.error('img problem');
      }
    }
  }

  public addTextMessage(textParameters: IElementParameters): void {
    if (isNotNullable(this.viewElementCreator)) {
      const text = new ElementCreator(textParameters);
      this.viewElementCreator.addInnerElement(text);
    }
  }

  public addButton(buttonParameters: IElementParameters): void {
    if (isNotNullable(this.viewElementCreator)) {
      const backButton = new ButtonCreator(buttonParameters);
      this.viewElementCreator.addInnerElement(backButton);
    }
  }
}
