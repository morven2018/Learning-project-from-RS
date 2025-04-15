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
