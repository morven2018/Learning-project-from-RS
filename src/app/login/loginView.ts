import ButtonCreator from '../../components/button';
import ElementCreator from '../../components/element-creator';
import InputCreator from '../../components/input-creator';
import View from '../../components/view';
//import { loginParameters } from '../../lib/types/consts';
import { CssClasses, CssTags } from '../../lib/types/enums';
import {
  IElementParameters,
  IView,
  IViewParameters,
} from '../../lib/types/interfaces';
import Router from '../../router/router';
import show from '../../assets/icons/eye-open.svg';
import hide from '../../assets/icons/eye-hide.svg';

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

const loginParameters = {
  tag: CssTags.Div,
  classNames: [CssClasses.Login],
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

// const loginLabelParameters = {
//   tag: CssTags.Label,
//   classNames: [CssClasses.Login, CssClasses.Label],
//   textContent: 'Login*:',
// };

// const inputParameters = {
//   tag: CssTags.Input,
//   classNames: [CssClasses.LoginInput],
//   textContent: 'Input the login',
//   id: CssClasses.LoginInput,
//   options: {
//     required: 'true',
//     type: 'text',
//     minlength: '4',
//   },
// };

export default class LoginView extends View implements IView {
  public router: Router | undefined;
  private inputs: InputCreator[] = [];
  constructor(parameters: IViewParameters = loginParameters) {
    super(parameters);
    this.configureView();
  }

  public configureView(): void {
    const header = new ElementCreator(headerParameters);
    this.viewElementCreator?.addInnerElement(header);
    this.configureFieldSet();
    // this.viewElementCreator?.element;

    /* this.addTextMessage({
      tag: CssTags.Div,
      classNames: [CssClasses.Login],
      textContent: 'Login',
    });*/
  }

  private configureFieldSet(): void {
    const field = new ElementCreator(fieldSetParameters);
    this.viewElementCreator?.addInnerElement(field);
    fieldsParameters.forEach((params) => {
      if (
        params.fieldParameters &&
        params.labelParameters &&
        params.inputParameters
      )
        this.addField(
          field,
          params.fieldParameters,
          params.labelParameters,
          params.inputParameters
        );
    });
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

    if (inputParameters.options?.type === 'password') {
      const wrapper = new ElementCreator(passwordWrapperParameters);
      field.addInnerElement(wrapper);

      const input = new InputCreator(inputParameters);
      wrapper.addInnerElement(input);
      this.addPasswordToggle(wrapper, input);
      this.inputs.push(input);
    }
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
          console.log('click', isPassword);
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
}
