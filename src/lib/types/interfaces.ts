import { CallbackType, OptionType, VoidMethodType } from './types';

export interface IElementParameters {
  tag: string;
  classNames: Array<string>;
  textContent: string;
  href?: string;
  callback?: (event: Event, id?: number) => void;
  imageURL?: string;
  imageAlt?: string;
  title?: string;
  id?: string;
  route?: string;
  options?: OptionType;
  value?: string;
}

export interface IElementCreator {
  element: HTMLElement | undefined;
  getElement: () => HTMLElement | undefined;
  addInnerElement: (element: HTMLElement | IElementCreator) => void;
  createElement: (parameters: IElementParameters) => void;
  setCssClasses: (cssClasses: Array<string>) => void;
  setTextContent: (text: string) => void;
  setCallback: (callback: CallbackType) => void;
  clearInnerElements: VoidMethodType;
  update: (parameters: {
    tag?: string;
    classNames?: string[];
    textContent?: string;
  }) => void;
}
export interface IState {
  isAuthenticated: boolean;
  user: IUserData | undefined;
  login: (userData: IUserData) => void;
  logout: VoidMethodType;
}
export interface IUserData {
  login: string;
  password?: string;
  isLogined?: boolean;
}

export type IViewParameters = Pick<IElementParameters, 'tag' | 'classNames'>;

export interface IView {
  viewElementCreator: IElementCreator | undefined;
  getHtmlElement: () => HTMLElement | undefined;
  createView(parameters: IViewParameters): IElementCreator | undefined;
}

export interface IButtonCreator extends IElementCreator {
  update: (parameters: {
    tag?: string;
    classNames?: string[];
    textContent?: string;
    value?: string;
    callback?: (event: Event) => void;
  }) => void;
}

export interface IImageParameters extends IElementParameters {
  imageURL: string;
  imageAlt: string;
}

export interface IImageCreator extends IElementCreator {
  update(newParameters: Partial<IImageParameters>): void;
}
export interface IMainView extends IView {
  setContent(content: IView): void;
}

export interface IMessage {
  to: string;
  text: string;
  id?: string;
}
