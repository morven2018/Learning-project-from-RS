import type { CallbackType } from './types';

export interface IElementParameters {
  tag: string;
  classNames: Array<string>;
  textContent: string;
  callback?: (event: Event) => void;
}

export interface IElementCreator {
  element: HTMLElement | undefined;
  getElement: () => HTMLElement | void;
  addInnerElement: (element: HTMLElement | IElementCreator) => void;
  createElement: (parameters: IElementParameters) => void;
  setCssClasses: (cssClasses: Array<string>) => void;
  setTextContent: (text: string) => void;
  setCallback: (callback: CallbackType) => void;
}

export type IViewParameters = Pick<IElementParameters, 'tag' | 'classNames'>;
export interface IView {
  viewElementCreator: IElementCreator | undefined;
  getHtmlElement: () => HTMLElement | void;
  createView(parameters: IViewParameters): IElementCreator;
}

export interface IFooterView extends IView {
  configureView: () => void;
}
