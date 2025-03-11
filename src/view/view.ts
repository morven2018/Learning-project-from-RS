import type { IView, IViewParameters } from '../types/interfaces';
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
}
