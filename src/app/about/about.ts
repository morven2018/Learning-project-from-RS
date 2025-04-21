import ElementCreator from '../../components/element-creator';
import View from '../../components/view';
import { aboutParameters } from '../../lib/types/consts';
import { CssClasses, CssTags } from '../../lib/types/enums';
import type { IView, IViewParameters } from '../../lib/types/interfaces';
import type Router from '../../router/router';
import icon from '../../assets/icons/github.png';
import ImageCreator from '../../components/image-creator';

const headerParameters = {
  tag: CssTags.H1,
  classNames: [CssClasses.About, CssClasses.Header],
  textContent: 'About Fun Chat App',
};

const pParameters = {
  tag: CssTags.P,
  classNames: [CssClasses.About, CssClasses.P],
  textContent: '',
};

const pTexts = {
  info: 'This application was developed as task solution Fun Chat.',
  note: ' The application requires persistent server connection for optimal performance',
  author: 'Author: ',
};

const subHeaderParameters = {
  tag: CssTags.H3,
  classNames: [CssClasses.About, CssClasses.SubHeader],
  textContent: 'Getting Started',
};

const ulParameters = {
  tag: CssTags.Ul,
  classNames: [CssClasses.ToUse],
  textContent: 'To use this application: Started',
};

const liParameters = {
  tag: CssTags.Li,
  classNames: [CssClasses.ToUse, CssClasses.Item],
  textContent: '',
};

const liTextContent = [
  'Clone the server application to your local machine',
  'Run a local server',
  'Keep the server application running as needed for the chat to function properly',
];

const spanParameters = {
  tag: CssTags.Span,
  classNames: [CssClasses.About, CssClasses.P, CssClasses.Span],
  textContent: 'Note:',
};

const linkParameter = {
  tag: CssTags.Link,
  classNames: [CssClasses.Link],
  textContent: 'Alena Pudina',
  href: 'https://github.com/morven2018',
  target: '_blank',
};

const imageParameters = {
  tag: CssTags.LinkIcon,
  classNames: [CssClasses.LinkIcon],
  textContent: '',
  imageURL: icon,
  title: 'GibHub',
};

const backButtonParameters = {
  tag: CssTags.Button,
  classNames: [CssClasses.About, CssClasses.Back],
  textContent: 'Back to previous page',
  callback: () => {
    const iframe = document.createElement('iframe');
    iframe.style.display = 'none';
    document.body.append(iframe);
    iframe.contentWindow?.history.back();
    setTimeout(() => document.body.removeChild(iframe), 1);
  },
};

export default class AboutView extends View implements IView {
  public router: Router | undefined;
  constructor(parameters: IViewParameters = aboutParameters) {
    super(parameters);
    this.configureView();
  }

  public configureView(): void {
    this.addTextMessage(headerParameters);
    pParameters.textContent = pTexts.info;
    this.addTextMessage(pParameters);
    this.addTextMessage(subHeaderParameters);

    const list = new ElementCreator(ulParameters);
    this.viewElementCreator?.addInnerElement(list);

    for (const text of liTextContent) {
      liParameters.textContent = text;
      const listItem = new ElementCreator(liParameters);
      list.addInnerElement(listItem);
    }

    pParameters.textContent = pTexts.note;
    const paragraph = new ElementCreator(pParameters);
    this.viewElementCreator?.addInnerElement(paragraph);

    const span = new ElementCreator(spanParameters);
    paragraph.addInnerElement(span, false);

    pParameters.textContent = pTexts.author;
    const paragraphLink = new ElementCreator(pParameters);
    this.viewElementCreator?.addInnerElement(paragraphLink);

    const link = new ElementCreator(linkParameter);
    link.element?.setAttribute('href', linkParameter.href);
    link.element?.setAttribute('target', linkParameter.target);
    paragraphLink.addInnerElement(link);

    const image = new ImageCreator(imageParameters);
    link.addInnerElement(image, false);
    // if (this.router) backBtnParameters.callback = () => this.router?.goBack();
    this.addButton(backButtonParameters);
  }
}
