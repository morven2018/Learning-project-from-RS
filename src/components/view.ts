import type {
  IElementParameters,
  IView,
  IViewParameters,
} from '../lib/types/interfaces';
import ButtonCreator from './button';
import ElementCreator from './element-creator';

export default class View implements IView {
  public viewElementCreator: ElementCreator | undefined;
  private defaultParameters = { tag: 'div', classNames: [] };

  constructor(parameters: IViewParameters = this.defaultParameters) {
    this.viewElementCreator = this.createView(parameters);
  }

  public getHtmlElement(): HTMLElement | undefined {
    if (this.viewElementCreator) return this.viewElementCreator.getElement();
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
    if (this.viewElementCreator) {
      const img = new ElementCreator(imageParameters);
      const imgElement = img.getElement();
      if (img && imgElement) {
        if (imageParameters.imageURL)
          imgElement.setAttribute('src', imageParameters.imageURL);
        imgElement.setAttribute('alt', '404 Not Found');
        this.viewElementCreator.addInnerElement(img);
      } else {
        console.error('image problem');
      }
    }
  }

  public addTextMessage(textParameters: IElementParameters): void {
    if (this.viewElementCreator) {
      const text = new ElementCreator(textParameters);
      this.viewElementCreator.addInnerElement(text);
    }
  }

  public addButton(
    buttonParameters: IElementParameters
  ): ButtonCreator | undefined {
    if (this.viewElementCreator) {
      const backButton = new ButtonCreator(buttonParameters);
      this.viewElementCreator.addInnerElement(backButton);
      return backButton;
    }
  }
}
