import ButtonCreator from '../../components/button';
import ElementCreator from '../../components/element-creator';
import InputCreator from '../../components/input-creator';
import View from '../../components/view';
import { CssClasses, CssTags } from '../../lib/types/enums';
import type {
  IElementParameters,
  IUserData,
  IValidatorAnswer,
  IView,
  IViewParameters,
} from '../../lib/types/interfaces';
import type Router from '../../router/router';
import show from '../../assets/icons/eye-open.svg';
import hide from '../../assets/icons/eye-hide.svg';
import { Validator } from '../../lib/utils/validator';
import { VoidMethodType } from '../../lib/types/types';

const fieldSetParameters = {
  tag: CssTags.FieldSet,
  classNames: [CssClasses.AuthForm, CssClasses.Area],
  textContent: '',
};

const headerParameters = {
  tag: CssTags.H3,
  classNames: [CssClasses.AuthForm, CssClasses.Header],
  textContent: 'Authorization',
};

const fieldsParameters = [
  {
    fieldParameters: {
      tag: CssTags.Div,
      classNames: [CssClasses.Login],
      textContent: '',
    },
    labelParameters: {
      tag: CssTags.Label,
      classNames: [CssClasses.Login, CssClasses.Label],
      textContent: 'Login*:',
    },
    inputParameters: {
      tag: CssTags.Input,
      classNames: [CssClasses.LoginInput],
      textContent: 'Input the login',
      id: CssClasses.LoginInput,
      options: {
        required: 'true',
        type: 'text',
        minlength: '4',
      },
    },
  },
  {
    fieldParameters: {
      tag: CssTags.Div,
      classNames: [CssClasses.Password],
      textContent: '',
    },
    labelParameters: {
      tag: CssTags.Label,
      classNames: [CssClasses.Password, CssClasses.Label],
      textContent: 'Password*:',
    },
    inputParameters: {
      tag: CssTags.Input,
      classNames: [CssClasses.PasswordInput],
      textContent: 'Input the password',
      id: CssClasses.PasswordInput,
      options: {
        required: 'true',
        type: 'password',
        minlength: '8',
      },
      withToggle: true,
    },
  },
];

const passwordWrapperParameters = {
  tag: CssTags.Div,
  classNames: [CssClasses.PasswordWrapper],
  textContent: '',
};

const toggleParameters = {
  tag: CssTags.Button,
  classNames: [CssClasses.Toggle],
  imageURL: show,
  textContent: '',
  title: 'Show password',
  callback: () => {},
};

const buttonLoginParameters = {
  tag: CssTags.Button,
  classNames: [CssClasses.LoginButton],
  textContent: 'Log in to the app',
};

const buttonAboutParameters = {
  tag: CssTags.Button,
  classNames: [CssClasses.AboutButton],
  textContent: 'About the app',
};

export default class LoginView extends View implements IView {
  public router: Router | undefined;
  private inputValidators: Map<HTMLInputElement, () => void> = new Map();
  private inputs: InputCreator[] = [];
  private savedValues: IUserData;
  constructor(parameters: IViewParameters, router: Router) {
    super(parameters);
    this.router = router;
    this.savedValues = {
      login: '',
      password: '',
    };
    this.configureView();
  }

  public configureView(): void {
    const header = new ElementCreator(headerParameters);
    this.viewElementCreator?.addInnerElement(header);
    this.configureFieldSet();
    this.addLoginButton();
    const aboutButton = new ButtonCreator({
      ...buttonAboutParameters,
      callback: () => this.router?.navigateTo('/about'),
    });
    this.viewElementCreator?.addInnerElement(aboutButton);
  }

  private configureFieldSet(): void {
    const field = new ElementCreator(fieldSetParameters);
    this.viewElementCreator?.addInnerElement(field);
    for (const parameters of fieldsParameters) {
      if (
        parameters.fieldParameters &&
        parameters.labelParameters &&
        parameters.inputParameters
      )
        this.addField(
          field,
          parameters.fieldParameters,
          parameters.labelParameters,
          parameters.inputParameters
        );
    }
    this.updateSubmitButtonState();
  }

  private addField(
    parent: ElementCreator,
    fieldParameters: IElementParameters,
    labelParameters: IElementParameters,
    inputParameters: IElementParameters
  ): void {
    const field = new ElementCreator(fieldParameters);
    parent.addInnerElement(field);

    const label = new ElementCreator(labelParameters);
    field.addInnerElement(label);

    const input = new InputCreator(inputParameters);
    this.inputs.push(input);
    if (input.element instanceof HTMLInputElement) {
      const validateInput = this.validateInput(input.element);

      const handleInput = this.validateInput(input.element);
      input.element.addEventListener('input', validateInput);
      input.element.addEventListener('blur', () =>
        this.handleBlur(handleInput, input)
      );
      this.inputValidators.set(input.element, validateInput);

      if (inputParameters.options?.type === 'password') {
        const wrapper = new ElementCreator(passwordWrapperParameters);
        field.addInnerElement(wrapper);

        wrapper.addInnerElement(input);
        this.addPasswordToggle(wrapper, input);
      } else field.addInnerElement(input);
    }
  }

  private handleBlur(handler: VoidMethodType, input: InputCreator): void {
    handler();
    if (input.element instanceof HTMLInputElement) {
      const isValid = Validator.isValid(
        input.element.value,
        input.element.type
      );
      if (isValid) this.showValidationState(input.element, isValid);
    }
  }

  private validateInput(input: HTMLInputElement): () => void {
    return () => {
      const validation = Validator.isValid(input.value, input.type);

      if (
        validation &&
        'isValid' in validation &&
        typeof validation.isValid === 'boolean' &&
        'message' in validation &&
        typeof validation.message === 'string'
      ) {
        this.showValidationState(input, validation);
      }
      this.updateSubmitButtonState();
    };
  }

  private showValidationState(
    input: HTMLInputElement,
    validation: IValidatorAnswer
  ): void {
    const errorId = `error-${input.id}`;
    let errorElement = document.getElementById(errorId);

    if (!validation.isValid) {
      if (!errorElement) {
        errorElement = document.createElement(CssTags.Div);
        errorElement.id = errorId;
        errorElement.className = CssClasses.ErrorValidation;
        input.insertAdjacentElement('afterend', errorElement);
      }
      errorElement.textContent = validation.message;
      input.classList.add(CssClasses.Invalid);
    } else {
      if (errorElement) errorElement.remove();
      input.classList.remove(CssClasses.Invalid);
    }
  }

  private updateSubmitButtonState(): void {
    const loginButton = this.viewElementCreator
      ?.getElement()
      ?.querySelector(`.${CssClasses.LoginButton}`);
    if (!(loginButton instanceof HTMLButtonElement)) return;

    const allInputs = Array.from(this.inputValidators.keys());
    const allValid = allInputs.every(
      (input) => Validator.isValid(input.value, input.type)?.isValid
    );

    loginButton.disabled = !allValid;
    loginButton.classList.toggle(CssClasses.Disable, !allValid);
  }

  private addPasswordToggle(
    wrapper: ElementCreator,
    input: InputCreator
  ): void {
    const toggle = new ButtonCreator({
      ...toggleParameters,
      callback: () => {
        if (input.element instanceof HTMLInputElement) {
          const isPassword = input.element.type === 'password';
          //  console.log('click', isPassword);
          input.element.type = isPassword ? 'text' : 'password';
          if (toggle.element) {
            toggle.updateImage(
              isPassword ? hide : show,
              isPassword ? 'Show password' : 'Hide password'
            );
          }
        }
      },
    });
    toggle.element?.setAttribute('type', 'button');
    wrapper.addInnerElement(toggle);
  }

  private addLoginButton(): void {
    const loginButton = new ButtonCreator({
      ...buttonLoginParameters,
    });
    this.viewElementCreator?.addInnerElement(loginButton);
    loginButton.element?.addEventListener('click', () => this.handleClick());

    if (
      this.inputs.every((item) => {
        if (item.element instanceof HTMLInputElement)
          return item.element.value.length > 0;
      })
    ) {
      this.inputs.forEach((item) => {
        if (item.element instanceof HTMLInputElement) {
          const result = Validator.isValid(
            item.element.value,
            item.element.type
          );
          if (
            result?.isValid &&
            loginButton.element?.classList.contains(CssClasses.Disable)
          )
            loginButton.element?.classList.remove(CssClasses.Disable);
        }
      });
    } else loginButton.element?.classList.add(CssClasses.Disable);
  }

  private handleClick() {
    const loginInput = this.inputs[0].element;
    const passwordInput = this.inputs[1].element;

    if (
      loginInput instanceof HTMLInputElement &&
      passwordInput instanceof HTMLInputElement
    ) {
      this.savedValues = {
        login: loginInput.value,
        password: passwordInput.value,
      };

      this.setLoginButtonState(true);

      this.router?.api.login({
        login: this.savedValues.login,
        password: this.savedValues.password,
      });

      requestAnimationFrame(() => {
        loginInput.value = this.savedValues.login;
        passwordInput.value = this.savedValues.password || '';
        this.setLoginButtonState(false);
        this.updateSubmitButtonState();
      });
    }
  }

  private setLoginButtonState(isLoading: boolean) {
    const loginButton = this.viewElementCreator
      ?.getElement()
      ?.querySelector(`.${CssClasses.LoginButton}`);
    if (loginButton instanceof HTMLButtonElement) {
      loginButton.disabled = isLoading;
      loginButton.textContent = isLoading
        ? 'Signing in...'
        : 'Log in to the app';
    }
  }
}
