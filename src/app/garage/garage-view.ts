import ElementCreator from '../../components/element-creator';
import FormCreator from '../../components/form';
import View from '../../components/view';
import { CssClasses, CssTags } from '../../lib/types/enums';
import { IView } from '../../lib/types/interfaces';
import { ApiClient } from '../../lib/utils/api-client';

//const NAME_OF_APP = 'Decision Making Tool';

const parameters = {
  tag: CssTags.Section,
  classNames: [CssClasses.Garage],
};

const formParameters = [
  {
    tag: CssTags.Form,
    classNames: [CssClasses.FormAdd],
    textContent: '',
    title: 'Add',
  },
  {
    tag: CssTags.Form,
    classNames: [CssClasses.FormUpdate, 'disabled'],
    textContent: '',
    title: 'Update',
  },
];

const btnParameters = [
  {
    tag: CssTags.Button,
    classNames: [CssClasses.Race],
    textContent: 'RACE',
    callback: () => {},
  },
  {
    tag: CssTags.Button,
    classNames: [CssClasses.Reset],
    textContent: 'RESET',
    callback: () => {},
  },
  {
    tag: CssTags.Button,
    classNames: [CssClasses.Generate],
    textContent: 'GENERATE CARS',
    callback: () => {},
  },
];

const headerParameters = {
  tag: CssTags.H1,
  classNames: [CssClasses.H1],
  textContent: 'Garage',
};

export default class GarageView extends View implements IView {
  public buttons: HTMLButtonElement[] = [];
  constructor() {
    super(parameters);
    this.buttons = [];
    this.configureView();
  }

  public async configureView(): Promise<void> {
    if (this.viewElementCreator) {
      formParameters.forEach((parametersForm) => {
        const form = new FormCreator(parametersForm);
        this.viewElementCreator?.addInnerElement(form);
      });

      btnParameters.forEach((parameters) => this.addButton(parameters));

      const total = (await ApiClient.getCars({ _limit: 1 })).totalCount;

      headerParameters.textContent = `${headerParameters.textContent}: ${total}`;

      const h1 = new ElementCreator(headerParameters);
      this.viewElementCreator?.addInnerElement(h1);
      // this.viewElementCreator.setTextContent(NAME_OF_APP);
    }
  }
}
