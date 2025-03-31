import ElementCreator from '../../components/element-creator';
import FormCreator from '../../components/form';
import ListNodeCreator from '../../components/list-node';
import View from '../../components/view';
import { CssClasses, CssTags } from '../../lib/types/enums';
import { IElementCreator, IView } from '../../lib/types/interfaces';
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

const baseLiParameters = {
  tag: CssTags.Li,
  classNames: [CssClasses.Element],
  textContent: '',
};

export default class GarageView extends View implements IView {
  public buttons: HTMLButtonElement[] = [];
  public page: number;
  public limit: number;
  constructor() {
    super(parameters);
    this.buttons = [];
    this.page = 1;
    this.limit = 7;
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

      // console.log(await ApiClient.updateCar(1, 'dfdfgbfdg', '#AAAAAA'));

      headerParameters.textContent = `${headerParameters.textContent}: ${total}`;

      const h1 = new ElementCreator(headerParameters);
      this.viewElementCreator?.addInnerElement(h1);

      const liParameters = {
        tag: CssTags.Ul,
        classNames: [CssClasses.GarageList],
        textContent: `Page #${this.page}`,
      };

      const list = new ElementCreator(liParameters);
      this.viewElementCreator.addInnerElement(list);

      this.generateNodes(list);
      //carsInfo.forEach((car) => )
      // this.viewElementCreator.setTextContent(NAME_OF_APP);
    }
  }

  public async generateNodes(parent: IElementCreator) {
    const carsInfo = (
      await ApiClient.getCars({
        _page: this.page,
        _limit: this.limit,
      })
    ).cars;

    carsInfo.forEach((element) => {
      const car = new ListNodeCreator(baseLiParameters, element);
      parent.addInnerElement(car);
    });
  }
}
