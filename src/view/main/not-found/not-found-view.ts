import View from '../../view';
import type { IView } from '../../../types/interfaces';

import './not-found.scss';

import notFoundImage from '../../../../asserts/404.jpg';
import backIcon from '../../../../asserts/icons/back.png';
import homeIcon from '../../../../asserts/icons/home.png';

const CssClasses = {
  INDEX: 'not-found',
  IMAGE: 'not-found__image',
  TEXT: 'not-found__text',
  BUTTON: 'not-found__button',
};

const IMAGE_URL = notFoundImage.toString();
const BACK_URL = backIcon.toString();
const HOME_URL = homeIcon.toString();

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
      imageURL: IMAGE_URL,
    });

    this.addTextMessage({
      tag: 'p',
      classNames: [CssClasses.TEXT],
      textContent: TEXT_CONTENT.TITLE,
    });

    this.addButton({
      tag: 'button',
      classNames: [CssClasses.BUTTON, 'back'],
      textContent: '',
      title: TEXT_CONTENT.BACK,
      callback: (): void => globalThis.history.back(),
      imageURL: BACK_URL,
    });

    this.addButton({
      tag: 'button',
      classNames: [CssClasses.BUTTON, 'to-home-page'],
      textContent: '',
      title: TEXT_CONTENT.HOME,
      callback: (): void => {
        globalThis.location.href = '/';
      },
      imageURL: HOME_URL,
    });
  }
}
