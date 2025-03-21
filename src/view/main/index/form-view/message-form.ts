import ButtonCreator from '../../../../util/buttons/button';
import FormView from '../../../../util/form/form-view';

import type {
  IBaseFormOptions,
  IMessageFormView,
} from '../../../../types/interfaces';

import './form.scss';

const CssClasses = {
  FORM: 'form',
  INPUT: 'form__input',
  BUTTON: 'form__button_close',
};

export default class MessageFormView
  extends FormView
  implements IMessageFormView
{
  public onClose: () => void;

  constructor(options: IBaseFormOptions) {
    super(options);
    document.body.style.overflow = 'hidden';
    this.onClose = options.onClose;
    this.addButtons();
  }

  public addButtons(): void {
    const buttonParameters = {
      tag: 'button',
      classNames: [CssClasses.BUTTON],
      textContent: 'Close',
      callback: (): void => this.onClose(),
      imageURL: '',
    };
    const closeButton = new ButtonCreator(buttonParameters);
    this.viewElementCreator?.addInnerElement(closeButton);
  }
}
