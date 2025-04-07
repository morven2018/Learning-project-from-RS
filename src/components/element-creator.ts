import type {
  IElementCreator,
  IElementParameters,
} from '../lib/types/interfaces';
import type { CallbackType } from '../lib/types/types';

export default class ElementCreator implements IElementCreator {
  public element: HTMLElement | undefined;

  constructor(parameters: IElementParameters) {
    this.element = undefined;
    this.createElement(parameters);
  }

  public getElement(): HTMLElement | undefined {
    if (this.element) return this.element;
    return undefined;
  }

  public addInnerElement(element: HTMLElement | IElementCreator): void {
    if (element instanceof ElementCreator) {
      const oneElement = element.getElement();
      if (oneElement && this.element) this.element.append(oneElement);
    } else if (element instanceof HTMLElement && this.element)
      this.element.append(element);
  }

  public createElement(parameters: IElementParameters): void {
    this.element = document.createElement(parameters.tag);
    this.setCssClasses(parameters.classNames);
    this.setTextContent(parameters.textContent);
    if (parameters.callback) this.setCallback(parameters.callback);
  }

  public setCssClasses(cssClasses: Array<string> = []): void {
    if (this.element)
      cssClasses.map((cssClass) => this.element?.classList.add(cssClass));
  }

  public setTextContent(text: string = ''): void {
    if (this.element) this.element.textContent = text;
  }

  public setCallback(callback: CallbackType): void {
    if (this.element && callback && typeof callback === 'function')
      this.element.addEventListener('click', (event) => callback(event));
  }

  public clearInnerElements(): void {
    if (this.element instanceof HTMLElement) {
      this.element.replaceChildren();
    }
  }
}
