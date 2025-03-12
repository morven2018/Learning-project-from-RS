import type { CallbackType } from './types';

export interface IElementParameters {
  tag: string;
  classNames: Array<string>;
  textContent: string;
  callback?: (event: Event) => void;
}

export interface IElementCreator {
  element: HTMLElement | undefined;
  getElement: () => HTMLElement | undefined;
  addInnerElement: (element: HTMLElement | IElementCreator) => void;
  createElement: (parameters: IElementParameters) => void;
  setCssClasses: (cssClasses: Array<string>) => void;
  setTextContent: (text: string) => void;
  setCallback: (callback: CallbackType) => void;
}

export type IViewParameters = Pick<IElementParameters, 'tag' | 'classNames'>;
export interface IView {
  viewElementCreator: IElementCreator | undefined;
  getHtmlElement: () => HTMLElement | undefined;
  createView(parameters: IViewParameters): IElementCreator;
}

export interface IHeaderView extends IView {
  configureView: () => void;
}

export interface IMainView extends IView {
  setContent: (content: IView) => void;
  getPages: (mainComponent: HTMLElement) => void;
}
