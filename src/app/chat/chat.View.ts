import ButtonCreator from '../../components/button';
import ElementCreator from '../../components/element-creator';
import View from '../../components/view';
import { chatParameters } from '../../lib/types/consts';
import { CssClasses, CssTags } from '../../lib/types/enums';
import type {
  IElementCreator,
  IUserData,
  IView,
  IViewParameters,
} from '../../lib/types/interfaces';
import type Router from '../../router/router';
import rsIcon from '../../assets/icons/rs-logo.svg';
import icon from '../../assets/icons/github.png';
import ImageCreator from '../../components/image-creator';
import InputCreator from '../../components/input-creator';

const headerParameters = {
  tag: CssTags.Section,
  classNames: [CssClasses.Chat, CssClasses.Header],
  textContent: '',
};

const userParameters = {
  tag: CssTags.Div,
  classNames: [CssClasses.Login],
  textContent: 'User: ',
};

const nameParameters = {
  tag: CssTags.Span,
  classNames: [CssClasses.UserName],
};

const headerNameParameters = {
  tag: CssTags.H1,
  classNames: [CssClasses.Header],
  textContent: 'Fun Chat',
};

const buttonAreaParameters = {
  tag: CssTags.Div,
  classNames: [CssClasses.Buttons],
  textContent: '',
};

const buttonLogoutParameters = {
  tag: CssTags.Button,
  classNames: [CssClasses.LoginButton],
  textContent: 'Logout',
};

const buttonAboutParameters = {
  tag: CssTags.Button,
  classNames: [CssClasses.AboutButton],
  textContent: 'About the app',
};

const footerParameters = {
  tag: CssTags.Section,
  classNames: [CssClasses.Chat, CssClasses.Footer],
  textContent: '',
};

const schoolContainerParameters = {
  tag: CssTags.Link,
  classNames: [CssClasses.SchoolLink],
  textContent: 'RSSchool',
  href: 'https://rs.school/',
  target: '_blank',
};

const schoolLogoParameters = {
  tag: CssTags.LinkIcon,
  classNames: [CssClasses.SchoolIcon],
  textContent: '',
  imageURL: rsIcon,
  title: 'GibHub',
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

const pParameters = {
  tag: CssTags.P,
  classNames: [CssClasses.About, CssClasses.P],
  textContent: 'Author: ',
};

const yearParameters = {
  tag: CssTags.Div,
  classNames: [CssClasses.Year],
  textContent: '2025',
};

const mainParameters = {
  tag: CssTags.Section,
  classNames: [CssClasses.MainSection],
  textContent: '',
};

const asideParameters = {
  tag: CssTags.Aside,
  classNames: [CssClasses.ListArea],
  textContent: '',
};

const filterFieldParameters = {
  tag: CssTags.Input,
  classNames: [CssClasses.Filter],
  textContent: '',
};

const userListParameters = {
  tag: CssTags.Ul,
  classNames: [CssClasses.UserList],
  textContent: '',
};

const userItemParameters = {
  tag: CssTags.Li,
  classNames: [CssClasses.User],
  textContent: '',
};

export default class ChatView extends View implements IView {
  public router: Router | undefined;
  public userLogin: string = 'initLogin';
  private userData: IUserData | undefined = undefined;
  constructor(
    parameters: IViewParameters = chatParameters,
    router: Router,
    userData: IUserData
  ) {
    super(parameters);
    this.router = router;
    this.userData = userData;
    this.userLogin = userData.login;
    this.configureView();
  }

  public configureView(): void {
    this.configureHeader();
    this.configureMainArea();

    this.configureFooter();
  }

  private configureHeader(): void {
    const header = new ElementCreator(headerParameters);
    this.viewElementCreator?.addInnerElement(header);

    const headerUser = new ElementCreator(userParameters);
    header.addInnerElement(headerUser);

    const name = new ElementCreator({
      ...nameParameters,
      textContent: this.userLogin,
    });
    headerUser.addInnerElement(name);

    const headerName = new ElementCreator(headerNameParameters);
    header.addInnerElement(headerName);

    this.addButtons(header);
  }

  private addButtons(parent: IElementCreator): void {
    const buttons = new ElementCreator(buttonAreaParameters);
    parent.addInnerElement(buttons);

    const about = new ButtonCreator({
      ...buttonAboutParameters,
      callback: () => this.router?.navigateTo('/about'),
    });
    buttons.addInnerElement(about);

    if (this.userData?.login) {
      const logout = new ButtonCreator({
        ...buttonLogoutParameters,
        callback: () =>
          this.router?.api.logout({
            login: this.userData?.login || 'login',
            password: this.userData?.password,
          }),
      });
      buttons.addInnerElement(logout);
    }
  }

  private configureFooter() {
    const footer = new ElementCreator(footerParameters);
    this.viewElementCreator?.addInnerElement(footer);

    const link = new ElementCreator(schoolContainerParameters);
    link.element?.setAttribute('href', schoolContainerParameters.href);
    link.element?.setAttribute('target', schoolContainerParameters.target);
    footer.addInnerElement(link);

    const image = new ImageCreator(schoolLogoParameters);
    link.addInnerElement(image, false);

    const paragraphLink = new ElementCreator(pParameters);
    footer.addInnerElement(paragraphLink);

    const linkAuthor = new ElementCreator(linkParameter);
    linkAuthor.element?.setAttribute('href', linkParameter.href);
    linkAuthor.element?.setAttribute('target', linkParameter.target);
    footer.addInnerElement(linkAuthor);

    const imageGit = new ImageCreator(imageParameters);
    paragraphLink.addInnerElement(imageGit, false);

    const year = new ElementCreator(yearParameters);
    footer.addInnerElement(year);
  }

  private configureMainArea() {
    const main = new ElementCreator(mainParameters);
    this.viewElementCreator?.addInnerElement(main);

    this.configureList(main);
  }

  private configureList(parent: IElementCreator) {
    const aside = new ElementCreator(asideParameters);
    parent.addInnerElement(aside);

    const filter = new InputCreator(filterFieldParameters);
    aside.addInnerElement(filter);

    const list = new ElementCreator(userListParameters);
    aside.addInnerElement(list);
  }
}
