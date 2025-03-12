import View from '../../view';
import { isNotNullable } from '../../../util/is-nullable';
import ElementCreator from '../../../util/element-creator';
import notFoundImage from '../../../../asserts/404.jpg';
import './not-found.scss';
import ButtonCreator from '../../../components/button';

const CssClasses = {
  INDEX: 'not-found',
  IMAGE: 'not-found__image',
  TEXT: 'not-found__text',
  BUTTON: 'not-found__button',
};

const IMAGE_URL = notFoundImage.toString();

const TEXT_CONTENT = {
  TITLE: 'Page is not founded',
  BACK: 'Назад',
  HOME: 'На главную',
};

export default class NotFoundView extends View {
  constructor() {
    const parameters = {
      tag: 'section',
      classNames: [CssClasses.INDEX],
    };
    super(parameters);
    this.configureView();
  }

  public configureView(): void {
    this.addImage();
    this.addTextMessage();
    this.addButton(
      'back',
      '',
      'Go to back to the page',
      TEXT_CONTENT.BACK,
      (): void => globalThis.history.back()
    );
    this.addButton(
      'to-main-page',
      '',
      'Go to the main page',
      TEXT_CONTENT.HOME,
      (): void => {
        globalThis.location.href = '/';
      }
    );
  }
  private addImage(): void {
    if (isNotNullable(this.viewElementCreator)) {
      const imageParameters = {
        tag: 'img',
        classNames: [CssClasses.IMAGE],
        textContent: '',
      };
      const img = new ElementCreator(imageParameters);
      const imgElement = img.getElement();
      if (isNotNullable(img) && isNotNullable(imgElement)) {
        imgElement.setAttribute('src', IMAGE_URL);
        imgElement.setAttribute('alt', '404 Not Found');
        console.log(img, this.viewElementCreator);
        this.viewElementCreator.addInnerElement(img);
      } else {
        console.error('img problem');
      }
    }
  }

  private addTextMessage(): void {
    if (isNotNullable(this.viewElementCreator)) {
      const textParameters = {
        tag: 'p',
        classNames: [CssClasses.TEXT],
        textContent: TEXT_CONTENT.TITLE,
      };
      const text = new ElementCreator(textParameters);
      this.viewElementCreator.addInnerElement(text);
    }
  }

  private addButton(
    classButton: string,
    imgUrl: string = '',
    title: string = '',
    textContentBth: string = '',
    callback: () => void
  ): void {
    if (isNotNullable(this.viewElementCreator)) {
      const buttonParameters = {
        tag: 'button',
        classNames: [CssClasses.BUTTON, classButton],
        textContent: textContentBth,
        title: title,
        img: imgUrl,
        callback: callback,
      };
      const backButton = new ButtonCreator(buttonParameters);
      this.viewElementCreator.addInnerElement(backButton);
    }
  }
}
