import View from '../../view';
import { isNotNullable } from '../../../util/is-nullable';
import ElementCreator from '../../../util/element-creator';
import notFoundImage from '../../../../asserts/404.jpg';
import './not-found.scss';

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

//const PAGE = '404';

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
}
