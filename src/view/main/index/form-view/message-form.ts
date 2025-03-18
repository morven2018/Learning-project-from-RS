import type { IBaseFormOptions } from '../../../../types/interfaces';
import ButtonCreator from '../../../../util/buttons/button';
import FormView from '../../../../util/form/form-view';
import './form.scss';

const CssClasses = {
  FORM: 'form',
  INPUT: 'form__input',
  BUTTON: 'form__button_close',
};
// const TEXT_MESSAGE = 'There are should at least 2 list option';

export default class MessageFormView extends FormView {
  public onClose: () => void;

  constructor(options: IBaseFormOptions) {
    super(options);
    this.onClose = options.onClose;
    this.addButton();
  }

  public addButton(): void {
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
