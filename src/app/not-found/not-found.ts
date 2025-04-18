import View from '../../components/view';
import { notFoundParameters } from '../../lib/types/consts';
import { CssClasses, CssTags } from '../../lib/types/enums';
import { IView, IViewParameters } from '../../lib/types/interfaces';
import Router from '../../router/router';
import picture from '../../assets/images/404.jpg';
import ImageCreator from '../../components/image-creator';

const headerParameters = {
  tag: CssTags.H3,
  classNames: [CssClasses.NotFound, CssClasses.Header],
  textContent: 'The page is not found',
};

const backBtnParameters = {
  tag: CssTags.Button,
  classNames: [CssClasses.NotFound, CssClasses.Back],
  textContent: 'Return',
  callback: () => {
    const iframe = document.createElement('iframe');
    iframe.style.display = 'none';
    document.body.appendChild(iframe);
    iframe.contentWindow?.history.back();
    setTimeout(() => document.body.removeChild(iframe), 1);
  },
};

const imageParameters = {
  tag: CssTags.Image,
  classNames: [CssClasses.NotFound, CssClasses.Image],
  textContent: '',
  title: 'This page is not found',
  imageURL: picture,
};

const pParameters = {
  tag: CssTags.P,
  classNames: [CssClasses.NotFound, CssClasses.P],
  textContent: 'You can back to previous page: ',
  callback: () => window.history.back(),
};

export default class NotFoundView extends View implements IView {
  public router: Router | undefined;
  constructor(parameters: IViewParameters = notFoundParameters) {
    super(parameters);
    this.configureView();

    if (!window.location.hash) {
      window.history.replaceState({}, '', '#/not-found');
    }
  }

  public configureView(): void {
    this.addTextMessage(headerParameters);

    const image = new ImageCreator(imageParameters);
    this.viewElementCreator?.addInnerElement(image);

    this.addTextMessage(pParameters);

    this.addButton(backBtnParameters);
  }
}
