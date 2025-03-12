export type CallbackType = ((event: Event) => void) | (() => void);
export type OptionType = {
  [key: string]: string | undefined;
  type: string;
  minlength?: string;
  min?: string;
  placeholder: string;
};
