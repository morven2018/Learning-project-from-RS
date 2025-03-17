import View from '../../view';
// import { isNotNullable } from '../../../util/is-nullable';
// import ElementCreator from '../../../util/element-creator';
import notFoundImage from '../../../../asserts/404.jpg';
import './not-found.scss';
// import ButtonCreator from '../../../util/buttons/button';
import type { IView } from '../../../types/interfaces';

const CssClasses = {
  INDEX: 'not-found',
  IMAGE: 'not-found__image',
  TEXT: 'not-found__text',
  BUTTON: 'not-found__button',
};

const IMAGE_URL = notFoundImage.toString();

const TEXT_CONTENT = {
  TITLE: 'Page is not founded',
  BACK: 'Back',
  HOME: 'Home',
};

export default class NotFoundView extends View implements IView {
  constructor() {
    const parameters = {
      tag: 'section',
      classNames: [CssClasses.INDEX],
      imageURL: IMAGE_URL,
      imageAlt: '404 Not Found',
    };
    super(parameters);
    this.configureView();
  }

  public configureView(): void {
    this.addImage({
      tag: 'img',
      classNames: [CssClasses.IMAGE],
      textContent: '',
    });

    this.addTextMessage({
      tag: 'p',
      classNames: [CssClasses.TEXT],
      textContent: TEXT_CONTENT.TITLE,
    });

    this.addButton({
      tag: 'button',
      classNames: [CssClasses.BUTTON, 'back'],
      textContent: TEXT_CONTENT.BACK,
      callback: (): void => globalThis.history.back(),
      imageURL: '',
    });

    this.addButton({
      tag: 'button',
      classNames: [CssClasses.BUTTON, 'to-home-page'],
      textContent: TEXT_CONTENT.HOME,
      callback: (): void => {
        globalThis.location.href = '/';
      },
      imageURL: '',
    });
  }
}
