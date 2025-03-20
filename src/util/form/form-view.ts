import View from '../../view/view';
import ElementCreator from '../element-creator';
import ButtonCreator from '../buttons/button';
import type { IBaseFormOptions, IFormView } from '../../types/interfaces';

const CssClasses = {
  BASE_FORM: 'form-view',
  MESSAGE: 'form-view__message',
  CLOSE_BUTTON: 'form-view__close-button',
};

export default class FormView extends View implements IFormView {
  public onClose: () => void;

  constructor(options: IBaseFormOptions, tag: string = 'dialog') {
    const parameters = {
      tag: tag,
      classNames: [CssClasses.BASE_FORM],
    };
    super(parameters);
    this.onClose = options.onClose;
    this.configureView(options.message);
  }

  public configureView(message: string = ''): void {
    const buttonParameters = {
      tag: 'button',
      classNames: [CssClasses.CLOSE_BUTTON],
      textContent: 'X',
      callback: (): void => this.onClose(),
      imageURL: '',
    };
    const crossButton = new ButtonCreator(buttonParameters);
    this.viewElementCreator?.addInnerElement(crossButton);

    const messageParameters = {
      tag: 'p',
      classNames: [CssClasses.MESSAGE],
      textContent: message,
    };
    const messageElement = new ElementCreator(messageParameters);
    this.viewElementCreator?.addInnerElement(messageElement);

    if (this.viewElementCreator?.element instanceof HTMLDialogElement) {
      const dialog = this.viewElementCreator.element;
      dialog.addEventListener('keydown', (event) => {
        if (event.key === 'Escape') {
          this.onClose();
        }
      });
    }

    /*document.addEventListener('click', (event) => {
      const target = event.target;
      const dialog = this.viewElementCreator?.element;

      if (
        dialog instanceof HTMLDialogElement &&
        target instanceof Node &&
        !dialog.contains(target)
      ) {
        this.onClose();
      }
    });*/
  }
}
