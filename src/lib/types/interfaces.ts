import type { ICar, IWinner } from './api-interfaces.js';
import type { SortBy, SortDirection } from './enums.js';
import type {
  VoidMethodType,
  CallbackType,
  OptionType,
  FormSubmitCallback,
} from './types.ts';

export interface IElementParameters {
  tag: string;
  classNames: Array<string>;
  textContent: string;
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
export interface IListNodeCreator extends IElementCreator {
  parent: IGarageView | undefined;
  selectBtn: IButtonCreator | undefined;
  deleteBtn: IButtonCreator | undefined;
  startBth: IButtonCreator | undefined;
  raceTrack: IRaceCreator | undefined;
  stopBth: IButtonCreator | undefined;
  name: IElementCreator | undefined;
  elementInfo?: ICar;
  updateCarAppearance: (color: string, name: string) => void;
  createElement: (parameters: IElementParameters, elementInfo?: ICar) => void;
  createRaceArea: (elementInfo: ICar) => IElementCreator;
  addButtons(elementInfo: ICar): IElementCreator;
}

export type IViewParameters = Pick<IElementParameters, 'tag' | 'classNames'>;

export interface IView {
  viewElementCreator: IElementCreator | undefined;
  getHtmlElement: () => HTMLElement | undefined;
  createView(parameters: IViewParameters): IElementCreator;
}

export interface IHeaderView extends IView {
  configureView: (router: IRouter) => void;
  updateActiveState: (currentRoute: string) => void;
}

export interface IMainView extends IView {
  setContent: (content: IView) => void;
}

export interface IGarageView extends IView {
  buttons: HTMLButtonElement[];
  page: number;
  limit: number;
  forms: IFormCreator[];
  raceCreators: IRaceCreator[];
  updatePage: (newPage: number) => void;
  configureView: () => Promise<void>;
  generateNodes: (parent: IElementCreator) => Promise<void>;
  generateHandler: (event: Event) => void;
  updateCarList: VoidMethodType;
  fillUpdateForm: (carInfo: ICar) => void;
  setSelectedCarId: (id: number) => void;
  resetAllCars: VoidMethodType;
  raceAllCars: VoidMethodType;
}

export interface IWinnersView extends IView {
  configureView: () => Promise<void>;
}

export interface IState {
  fields: Map<string, unknown>;
  // setListCreator: (listCreator: IListCreator) => void;
  // getElements: () => HTMLElement[] | undefined;
  // getNextId: () => number | undefined;
  saveState: VoidMethodType;
  setField<T>(name: string, value: T): void;
  getField(name: string): unknown;
  getFieldWithTypeCheck<T>(
    name: string,
    typeCheck: (value: unknown) => value is T
  ): T | undefined;
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
/*
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
} */

export interface IButtonCreator extends IElementCreator {
  createElement: (parameters: IElementParameters) => void;
  update: (parameters: {
    tag?: string;
    classNames?: string[];
    textContent?: string;
    value?: string;
    callback?: (event: Event) => void;
  }) => void;
}

export interface IFormCreator extends IElementCreator {
  inputs: HTMLInputElement[];
  btn: IButtonCreator | undefined;
  getInputs: () => HTMLInputElement[];
  setFormData: (formData: Record<string, string>) => void;
  getFormData: () => Record<string, string>;
  createElement: (
    parameters: IElementParameters,
    onSubmit?: FormSubmitCallback
  ) => void;
  resetForm: VoidMethodType;
}
export interface IRaceCreator extends IElementCreator {
  car: ICarState;
  context: CanvasRenderingContext2D | undefined;
  raceStartTime: number;
  raceDuration: number;
  updateCarColor: (color: string) => void;
  updateCarAppearance: (color: string, name: string) => void;
  createElement: (parameters: IElementParameters, elementInfo?: ICar) => void;
  startCar: (isRaceMode: boolean) => Promise<void>;
  startAnimation: VoidMethodType;
  stopAnimation: VoidMethodType;
  resetCar: VoidMethodType;
  showStopImage: () => Promise<void>;
  resetAnimationState: VoidMethodType;
  brokeCar: () => Promise<void>;
  stopCar: () => Promise<void>;
  resetStopImage: VoidMethodType;
  drawCar: VoidMethodType;
}

export interface IPagination extends IElementCreator {
  updateConfig: (newConfig: Partial<IPaginationConfig>) => void;
}

export interface IPaginationConfig {
  currentPage: number;
  totalItems: number;
  itemsPerPage: number;
  onPageChange: (page: number) => void;
}

export interface ICarState {
  position: number;
  assets: ICarAssets;
  state: IInnerCarState;
}

export interface IInnerCarState {
  speed: number;
  isMoving: boolean;
}
export interface ICarAssets {
  body: HTMLImageElement | undefined;
  wheels: HTMLImageElement | undefined;
  color: string;
}
export interface IAnimationState {
  id: number | undefined;
  isRunning: boolean;
  wheelAngle: number;
}

export type JsonModels = IJsonCarInfo[];

export interface IJsonCarInfo {
  id: string;
  name: string;
  'сyrillic-name': string;
  popular: boolean;
  country: string;
  models: IJsonCarInfoItem[];
}
export interface IJsonCarInfoItem {
  id: string;
  name: string;
  'cyrillic-name'?: string;
  class?: string;
  'year-from'?: number;
  'year-to'?: number;
  path?: {
    'mark-id': string;
  };
}

export interface IRaceState {
  id?: string;
  position?: number;
  isMoving?: boolean;
  startTime?: number;
  duration?: number;
}

export interface IGarageFormData {
  addForm?: Record<string, string>;
  updateForm?: Record<string, string>;
}

export interface IGarageState {
  page?: number;
  formData?: IGarageFormData;
  raceStates?: IRaceState[];
}
export interface IFormState {
  addForm?: Record<string, string>;
  updateForm?: Record<string, string>;
  page?: number;
}

export interface ITableCreator extends IElementCreator {
  page: number;
  sortDirection: SortDirection;
  sortValue: SortBy;
  onPageChange?: (newPage: number) => void;
  onSortChange?: () => void;
  createElement: (parameters: IElementParameters) => void;
  loadTableData: () => Promise<void>;
  updatePage: (newPage: number) => void;
  fillTable: (winners?: IWinner[]) => Promise<void>;
}
