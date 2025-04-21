import { IValidatorAnswer } from '../types/interfaces';

const minText = 4;
const maxText = 100;
const minPassword = 8;
const maxPassword = 30;
const forbiddenChars = /[\s\/\\|.\-+*#@%^&()$;]/;

export class Validator {
  public static isValid(
    value: string,
    type: string
  ): IValidatorAnswer | undefined {
    if (type === 'text') return Validator.IsValidText(value);
    if (type === 'password') return Validator.IsValidPassword(value);
    return undefined;
  }

  private static IsValidText(value: string): IValidatorAnswer {
    const res = value.trim();
    if (res.length < minText)
      return {
        isValid: false,
        message: `The login should be at lest ${minText} symbols`,
      };

    if (res.length > maxText)
      return {
        isValid: false,
        message: `The login should be less than ${maxText} symbols`,
      };

    if (forbiddenChars.test(res)) {
      return {
        isValid: false,
        message:
          'The login should not have whitespace and these symbols: /\\|.-+*#@%^&()$;',
      };
    }

    return {
      isValid: true,
      message: '',
    };
  }

  private static IsValidPassword(value: string): IValidatorAnswer {
    const res = value.trim();
    if (res.length < minPassword)
      return {
        isValid: false,
        message: `The password should be at lest ${minPassword} symbols`,
      };

    if (res.length > maxPassword)
      return {
        isValid: false,
        message: `The password should be less than ${maxPassword} symbols`,
      };

    if (!/[0-9]/.test(res)) {
      return {
        isValid: false,
        message: 'The password should have at least 1 digit',
      };
    }

    if (res === res.toUpperCase()) {
      return {
        isValid: false,
        message: 'The password should have at least 1 symbol in lower case',
      };
    }

    if (res === res.toLowerCase()) {
      return {
        isValid: false,
        message: 'The password should have at least 1 symbol in upper case',
      };
    }

    return {
      isValid: true,
      message: '',
    };
  }
}
