import ButtonCreator from './button';
import ElementCreator from './element-creator';
import InputCreator from './input';

import { CssClasses, CssTags } from '../lib/types/enums';
import type {
  IButtonCreator,
  IElementParameters,
  IFormCreator,
  IFormState,
} from '../lib/types/interfaces';
import type { FormSubmitCallback } from '../lib/types/types';

const inputParameters = [
  {
    tag: CssTags.Input,
    classNames: [CssClasses.InputName],
    textContent: '',
    options: {
      type: 'text',
      minlength: '3',
      required: 'true',
      placeholder: 'car brand and model',
    },
  },
  {
    tag: CssTags.Input,
    classNames: [CssClasses.InputColor],
    textContent: '',
    options: {
      type: 'color',
      title: 'color of the car',
      required: 'true',
      value: '#000000',
    },
  },
];

export default class FormCreator
  extends ElementCreator
  implements IFormCreator
{
  public inputs: HTMLInputElement[] = [];
  public btn: IButtonCreator | undefined;
  private onSubmit: FormSubmitCallback | undefined;

  constructor(parameters: IElementParameters, onSubmit?: FormSubmitCallback) {
    super(parameters);
    this.inputs = [];
    this.createElement(parameters, onSubmit);
    this.setupInputListeners();
  }

  public static isGarageState(value: unknown): value is IFormState {
    if (!value || typeof value !== 'object') return false;

    if (!('addForm' in value) || !('updateForm' in value)) return false;

    const result =
      (value.addForm === undefined || typeof value.addForm === 'string') &&
      (value.updateForm === undefined || typeof value.updateForm === 'string');
    return result;
  }

  public getInputs(): HTMLInputElement[] {
    return this.inputs;
  }

  public setFormData(formData: Record<string, string>): void {
    for (const input of this.getInputs()) {
      if (input.id in formData) {
        input.value = formData[input.id];
      }
    }
  }

  public getFormData(): Record<string, string> {
    const result: Record<string, string> = {};
    for (const input of this.getInputs()) {
      result[input.id] = input.value;
    }
    return result;
  }

  public createElement(
    parameters: IElementParameters,
    onSubmit?: FormSubmitCallback
  ): void {
    super.createElement(parameters);

    if (this.element) {
      this.element.addEventListener('submit', (event: Event): void =>
        this.handleSubmit(event)
      );
    }
    if (onSubmit) this.onSubmit = onSubmit;

    for (const inputParameter of inputParameters) {
      const input = new InputCreator(inputParameter);
      if (input.element instanceof HTMLInputElement) {
        input.element.placeholder = `${parameters.title} ${inputParameter.options.placeholder}`;
      }

      if (input && input.element && input.element instanceof HTMLInputElement) {
        input.element.id = `${parameters.classNames[0]}__${inputParameter.classNames[0]}`;
        this.inputs?.push(input.element);
        this.addInnerElement(input);
      }
    }

    const buttonParameters = {
      tag: CssTags.Button,
      classNames: [`${parameters.classNames[0]}__btn`],
      textContent: parameters.title || '',
    };
    this.btn = new ButtonCreator(buttonParameters);
    this.addInnerElement(this.btn);
    this.btn.element?.setAttribute('type', 'submit');
  }

  public resetForm(): void {
    for (const input of this.inputs) {
      if (input.type === 'text') {
        input.value = '';
      } else if (input.type === 'color') {
        input.value = '#000000';
      }
    }
  }

  private handleSubmit(event: Event): void {
    event.preventDefault();

    const nameInput = this.inputs.find((input) =>
      input.classList.contains(CssClasses.InputName)
    );
    const colorInput = this.inputs.find((input) =>
      input.classList.contains(CssClasses.InputColor)
    );

    if (!nameInput || !colorInput) return;

    const carData = {
      name: nameInput.value.trim(),
      color: colorInput.value,
    };
    if (this.onSubmit) this.onSubmit(carData);
  }

  private setupInputListeners(): void {
    for (const input of this.getInputs()) {
      input.addEventListener('input', () => {
        this.saveFormState();
        this.checkFormDisabledState();
      });
    }
  }

  private saveFormState(): void {
    const formData = this.getFormData();

    const formType = this.element?.classList.contains('form-add-car')
      ? 'AddForm'
      : 'UpdateForm';
    const state = 'garageState' + formType;
    sessionStorage.setItem(state, JSON.stringify(formData));
  }

  private checkFormDisabledState(): void {
    const isFilled = this.getInputs().some(
      (input) => input.value.trim() !== ''
    );
    if (isFilled) {
      this.element?.classList.remove('disabled');
    }
  }
}
