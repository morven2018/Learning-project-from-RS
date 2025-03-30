import type { VoidMethodType, CallbackType } from './types.ts';

export interface IElementParameters {
  tag: string;
  classNames: Array<string>;
  textContent: string;
  callback?: (event: Event) => void;
  imageURL?: string;
  imageAlt?: string;
  title?: string;
  id?: number;
  route?: string;
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
  configureView: (router: IRouter) => void;
}

export interface IMainView {
  // state: IState;
  setContent: (content: IView) => void;
}

export interface IIndexView {
  list: IListCreator | undefined;
  configureView: VoidMethodType;
  isEnoughItem: VoidMethodType;
  saveJSON: VoidMethodType;
  uploadJSON: VoidMethodType;
}

export interface IPickerView extends IView {
  audio: HTMLAudioElement;
  addButtonSound: (parameters: IPickerParameters) => HTMLElement | undefined;
}

export interface IPickerParameters {
  tag: string;
  classNames: string[];
  textContent: string;
  title: string;
  callback: () => void;
  imageURL: string;
}

export interface IState {
  fields: Map<string, string>;
  // setListCreator: (listCreator: IListCreator) => void;
  // getElements: () => HTMLElement[] | undefined;
  // getNextId: () => number | undefined;
  saveState: VoidMethodType;
  setField: (name: string, value: string) => void;
  getField: (name: string) => string;
}

export interface IRouter {
  navigateTo: (path: string) => void;
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

export interface IValueList {
  [key: string]: number;
}

export interface IListCreator extends IElementCreator {
  nextId: number;
  elements: HTMLElement[];
  state: IState;
  loadFromLocalStorage: VoidMethodType;
  getElements: () => HTMLElement[];
  createElement: (parameters: IElementParameters) => void;
  addElement: (
    info: IElementInfo,
    newElement?: boolean
  ) => HTMLElement | undefined;
  removeElementById: (id: string) => void;
  clearList: (click?: boolean) => void;
  setOnInputChangeCallback(callback: () => void): void;
}

export interface IFormView {
  onClose: VoidMethodType;
  configureView: (message?: string) => void;
}

export interface IMessageFormView extends IFormView {
  addButtons: VoidMethodType;
}

export interface IPasteFormView extends IFormView {
  onSubmit: (items: string[]) => void;
  showModal: VoidMethodType;
}

export interface IBaseFormOptions {
  message: string;
  onClose: () => void;
}

export interface IButtonCreator extends IElementCreator {
  createElement: (parameters: IElementParameters) => void;
}

export interface ITimerCreator {
  createElement: (parameters: IElementParameters) => void;
  setTimerValue: (value: string) => void;
  getTimerValue: () => number;
  disableInput: VoidMethodType;
  enableInput: VoidMethodType;
}

export interface IWheelCreator {
  valueList: IValueList;
  startAnimation: VoidMethodType;
}
