import View from '../../view/view';
import ElementCreator from '../element-creator';
import ButtonCreator from '../buttons/button';
import type { IBaseFormOptions, IFormView } from '../../types/interfaces';
import { isNotNullable } from '../is-nullable';

const CssClasses = {
  BASE_FORM: 'paste-dialog-view',
  TEXTAREA: 'paste-dialog-view__area',
  BUTTON_LIST: 'button_list',
  CONFIRM: 'confirm-button',
  CLOSE_BUTTON: 'close-button',
};
const AREA_TEXT = `Paste a list of new options in a CSV-like format:

 title,1                   -> | title                 | 1 |
 title with whitespace,2   -> | title with whitespace | 2 |
 title , with , commas,3   -> | title , with , commas | 3 |
 title with "quotes",4     -> | title with "quotes"   | 4 |`;
export default class PasteFormView extends View implements IFormView {
  public onClose: () => void;
  public onSubmit: (items: string[]) => void;
  // public showModal: () => void;
  private textarea: HTMLTextAreaElement | undefined = undefined;

  constructor(
    options: IBaseFormOptions & { onSubmit: (items: string[]) => void },
    tag: string = 'dialog'
  ) {
    const parameters = {
      tag: tag,
      classNames: [CssClasses.BASE_FORM],
    };
    super(parameters);
    this.onSubmit = options.onSubmit;
    this.onClose = options.onClose;
    this.configureView();
  }

  public configureView(): void {
    this.createTextarea();
    this.createButtonList();
  }
  public showModal(): void {
    if (this.viewElementCreator?.element instanceof HTMLDialogElement) {
      this.viewElementCreator.element.showModal();
    }
  }

  private createTextarea(): void {
    const textarea = new ElementCreator({
      tag: 'textarea',
      classNames: [CssClasses.TEXTAREA],
      textContent: '',
    });
    textarea.element?.setAttribute('placeholder', AREA_TEXT);
    this.viewElementCreator?.addInnerElement(textarea);

    if (textarea.element instanceof HTMLTextAreaElement)
      this.textarea = textarea.element;
  }

  private createButtonList(): void {
    const divParameters = {
      tag: 'div',
      classNames: [CssClasses.BUTTON_LIST],
      textContent: '',
    };

    const div = new ElementCreator(divParameters);
    this.viewElementCreator?.addInnerElement(div);

    const buttonParameters = {
      tag: 'button',
      classNames: [CssClasses.CONFIRM],
      textContent: 'Confirm',
      callback: (): void => this.handleConfirm(),
      imageURL: '',
    };
    const confirmButton = new ButtonCreator(buttonParameters);
    if (isNotNullable(confirmButton.element))
      div.element?.append(confirmButton.element);

    const buttonParametersClose = {
      tag: 'button',
      classNames: [CssClasses.CLOSE_BUTTON],
      textContent: 'Close',
      callback: (): void => this.onClose(),
      imageURL: '',
    };
    const closeButton = new ButtonCreator(buttonParametersClose);
    if (isNotNullable(closeButton.element))
      div.element?.append(closeButton.element);
  }

  private handleConfirm(): void {
    if (isNotNullable(this.textarea)) {
      const text = this.textarea.value;

      const items = text
        .split('\n')
        .map((line) => line.trim())
        .filter((line) => line.length > 0);

      this.onSubmit(items);
    }
    this.onClose();
  }
}
