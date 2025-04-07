import ElementCreator from '../../components/element-creator';
import FormCreator from '../../components/form';
import ListNodeCreator from '../../components/list-node';
import View from '../../components/view';
import { CssClasses, CssTags } from '../../lib/types/enums';
import type { IElementCreator, IView } from '../../lib/types/interfaces';
import ApiClient from '../../lib/utils/api-client';
import CarCreator from '../../lib/utils/car-creator';

//const NAME_OF_APP = 'Decision Making Tool';
const numberOfGeneratedCars = 100;
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

const buttonParameters = [
  {
    tag: CssTags.Button,
    classNames: [CssClasses.Race],
    textContent: 'RACE',
    callback: (): void => {},
  },
  {
    tag: CssTags.Button,
    classNames: [CssClasses.Reset],
    textContent: 'RESET',
    callback: (): void => {},
  },
  {
    tag: CssTags.Button,
    classNames: [CssClasses.Generate],
    textContent: 'GENERATE CARS',
    callback: (): void => CarCreator.createNCars(numberOfGeneratedCars),
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
  public forms: FormCreator[] = [];
  constructor() {
    super(parameters);
    this.buttons = [];
    this.page = 1;
    this.limit = 7;
    void this.configureView().catch((error) => {
      console.error('Failed to configure view:', error);
    });
  }

  public async configureView(): Promise<void> {
    if (this.viewElementCreator) {
      for (const parametersForm of formParameters) {
        const form = new FormCreator(parametersForm);
        this.forms.push(form);
        /* if (
          form.element instanceof HTMLElement &&
          typeof parametersForm?.title === 'string'
        )
          form.element.dataset.textname = parametersForm.title; */
        this.viewElementCreator?.addInnerElement(form);
      }

      for (const parameters of buttonParameters) this.addButton(parameters);
      try {
        const response = await ApiClient.getCars({ _limit: 1 });
        const total = response.totalCount;
        // console.log(response);

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
        // console.log('dfsv0');
        await this.generateNodes(list);
        // console.log('dfsv');
      } catch (error) {
        console.error(error);
      }
    }
  }

  public async generateNodes(parent: IElementCreator): Promise<void> {
    console.log('fgb');
    try {
      const { cars } = await ApiClient.getCars({
        _page: this.page,
        _limit: this.limit,
      });
      console.log(cars);
      for (const car of cars) {
        const carNode = new ListNodeCreator(baseLiParameters, car);
        parent.addInnerElement(carNode);
      }
    } catch (error) {
      console.error('Failed to generate car nodes:', error);
      throw error;
    }
  }
}
