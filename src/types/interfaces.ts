import type { CallbackType, VoidMethodType } from './types';

export interface IElementParameters {
  tag: string;
  classNames: Array<string>;
  textContent: string;
  callback?: (event: Event) => void;
  imageURL?: string;
  imageAlt?: '404 Not Found';
  title?: string;
  id?: number;
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

export interface IState {
  fields: Map<string, string>;
  setField: (name: string, value: string) => void;
  getField: (name: string) => string;
  saveState: VoidMethodType;
}

export interface IJSONObject {
  list: Array<IElementInfo>;
  lastId: number;
}
export interface IElementInfo {
  id: string;
  title: string;
  weight: string;
}
export interface IListCreator {
  nextId: number;
  elements: HTMLElement[];
  state: IState;
  saveToLocalStorage: VoidMethodType;
  loadFromLocalStorage: VoidMethodType;
  getElements: () => HTMLElement[];
  createElement: (parameters: IElementParameters) => void;
  addElement: (info: IElementInfo) => void;
  removeElementById: (id: string) => void;
  clearList: VoidMethodType;
  setOnInputChangeCallback(callback: () => void): void;
}
