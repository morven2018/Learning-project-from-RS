import View from '../../view/view';
import ElementCreator from '../element-creator';
import ButtonCreator from '../buttons/button';
import type { IFormView } from '../../types/interfaces';

const CssClasses = {
  BASE_FORM: 'form-view',
  MESSAGE: 'form-view__message',
  CLOSE_BUTTON: 'form-view__close-button',
};

interface BaseFormOptions {
  message: string;
  onClose: () => void;
}

export default class FormView extends View implements IFormView {
  private messageElement: ElementCreator | undefined;
  private closeButtonElement: HTMLElement | undefined;
  private onClose: () => void;

  constructor(options: BaseFormOptions, tag: string = 'div') {
    const parameters = {
      tag: tag,
      classNames: [CssClasses.BASE_FORM],
    };
    super(parameters);

    this.onClose = options.onClose;
    this.configureView(options.message);
  }

  public configureView(message: string = ''): void {
    const messageParameters = {
      tag: 'p',
      classNames: [CssClasses.MESSAGE],
      textContent: message,
    };
    this.messageElement = new ElementCreator(messageParameters);

    const buttonParameters = {
      tag: 'button',
      classNames: [CssClasses.CLOSE_BUTTON],
      textContent: 'X',
      callback: (): void => this.onClose(),
      imageURL: '',
    };
    this.messageElement = new ButtonCreator(buttonParameters);
  }
}
