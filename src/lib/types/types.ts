import type { ICarCreate } from './api-interfaces';

export type CallbackType = ((event: Event) => void) | (() => void);
export type OptionType = {
  [key: string]: string | number | undefined;
  type?: string;
  minlength?: string;
  min?: string;
  placeholder?: string;
  required?: string;
  title?: string;
  width?: number;
  height?: number;
};

export type VoidMethodType = () => void;

export enum TextAlign {
  Center = 'center',
  Start = 'start',
  End = 'end',
  Left = 'left',
  Right = 'right',
}

export enum TextBaseline {
  Middle = 'middle',
  Top = 'top',
  Hanging = 'hanging',
  Alphabetic = 'alphabetic',
  Ideographic = 'ideographic',
  Bottom = 'bottom',
}
export type FormSubmitCallback = (data: ICarCreate) => void;
