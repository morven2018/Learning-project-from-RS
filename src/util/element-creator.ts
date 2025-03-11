import type { IElementParameters, IElementCreator } from '../types/interfaces';
import { isNotNullable } from './is-nullable';

export default class ElementCreator implements IElementCreator {
  public element: HTMLElement | undefined;

  constructor(parameters: IElementParameters) {
    this.element = undefined;
    this.createElement(parameters);
  }

  public getElement(): HTMLElement | void {
    if (isNotNullable(this.element)) return this.element;
  }

  public addInnerElement(element: HTMLElement | IElementCreator): void {
    if (element instanceof ElementCreator) {
      const oneElement = element.getElement();
      if (oneElement && isNotNullable(this.element))
        this.element.append(oneElement);
    } else if (element instanceof HTMLElement && isNotNullable(this.element))
      this.element.append(element);
  }

  public createElement(parameters: IElementParameters): void {
    this.element = document.createElement(parameters.tag);
    this.setCssClasses(parameters.classNames);
    this.setTextContent(parameters.textContent);
    this.setCallback(parameters.callback);
  }

  private setCssClasses(cssClasses: Array<string> = []): void {
    if (isNotNullable(this.element))
      cssClasses.map((cssClass) => this.element?.classList.add(cssClass));
  }

  private setTextContent(text: string = ''): void {
    if (isNotNullable(this.element)) this.element.textContent = text;
  }

  private setCallback(callback: (event: Event) => void): void {
    if (isNotNullable(this.element))
      this.element.addEventListener('click', (event) => callback(event));
  }
}
