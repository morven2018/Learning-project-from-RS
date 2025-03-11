import type { IElementParameters, IElementCreator } from '../types/interfaces';
import type { CallbackType } from '../types/types';
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
    if (isNotNullable(parameters.callback))
      this.setCallback(parameters.callback);
  }

  public setCssClasses(cssClasses: Array<string> = []): void {
    if (isNotNullable(this.element))
      cssClasses.map((cssClass) => this.element?.classList.add(cssClass));
  }

  public setTextContent(text: string = ''): void {
    if (isNotNullable(this.element)) this.element.textContent = text;
  }

  public setCallback(callback: CallbackType): void {
    if (isNotNullable(this.element))
      this.element.addEventListener('click', (event) => callback(event));
  }
}
