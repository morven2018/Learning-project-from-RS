import ElementCreator from '../../components/element-creator';
import FormCreator from '../../components/form';
import ListNodeCreator from '../../components/list-node';
import View from '../../components/view';
import { CssClasses, CssTags } from '../../lib/types/enums';
import type { IElementCreator, IView } from '../../lib/types/interfaces';
import ApiClient from '../../lib/utils/api-client';
import CarCreator from '../../lib/utils/car-creator';
import type RaceCreator from '../../components/race-track';

//const NAME_OF_APP = 'Decision Making Tool';
const numberOfGeneratedCars = 1;
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

const headerParameters = {
  tag: CssTags.H1,
  classNames: [CssClasses.H1],
  textContent: '',
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
  public raceCreators: RaceCreator[] = [];
  private list: ElementCreator | undefined = undefined;
  private header: ElementCreator | undefined = undefined;

  constructor() {
    super(parameters);
    this.buttons = [];
    this.page = 1;
    this.limit = 7;
    this.configureView().catch((error) => {
      console.error('Failed to configure view:', error);
    });
  }

  public async configureView(): Promise<void> {
    if (this.viewElementCreator) {
      const buttonParameters = [
        {
          tag: CssTags.Button,
          classNames: [CssClasses.Race],
          textContent: 'RACE',
          callback: this.raceAllCars.bind(this),
        },
        {
          tag: CssTags.Button,
          classNames: [CssClasses.Reset],
          textContent: 'RESET',
          callback: this.resetAllCars.bind(this),
        },
        {
          tag: CssTags.Button,
          classNames: [CssClasses.Generate],
          textContent: 'GENERATE CARS',
          callback: this.generateHandler.bind(this),
        },
      ];

      for (const parametersForm of formParameters) {
        const form = new FormCreator(parametersForm);
        this.forms.push(form);
        this.viewElementCreator?.addInnerElement(form);
      }

      for (const parameters of buttonParameters) this.addButton(parameters);
      try {
        const response = await ApiClient.getCars({ _limit: 1 });
        const total = response.totalCount;

        headerParameters.textContent = `Garage: ${total}`;

        this.header = new ElementCreator(headerParameters);
        this.viewElementCreator?.addInnerElement(this.header);

        const liParameters = {
          tag: CssTags.Ul,
          classNames: [CssClasses.GarageList],
          textContent: `Page #${this.page}`,
        };

        this.list = new ElementCreator(liParameters);
        this.viewElementCreator.addInnerElement(this.list);
        await this.generateNodes(this.list);
      } catch (error) {
        console.error(error);
      }
    }
  }

  public async generateNodes(parent: IElementCreator): Promise<void> {
    try {
      const { cars } = await ApiClient.getCars({
        _page: this.page,
        _limit: this.limit,
      });
      this.raceCreators = [];
      // console.log(cars);
      for (const car of cars) {
        const carNode = new ListNodeCreator(baseLiParameters, car, this);
        parent.addInnerElement(carNode);

        if (carNode.raceTrack) {
          this.raceCreators.push(carNode.raceTrack);
        }
      }
    } catch (error) {
      console.error('Failed to generate car nodes:', error);
      throw error;
    }
  }
  public async generateHandler(event: Event): Promise<void> {
    event.preventDefault();
    event.stopPropagation();
    await CarCreator.createNCars(numberOfGeneratedCars);
    this.updateCarList();
  }

  public updateCarList(): void {
    this.raceCreators = [];
    if (this.viewElementCreator?.element instanceof HTMLElement) {
      this.viewElementCreator.element.replaceChildren();
      this.configureView().catch((error) => {
        console.error('Failed to configure view:', error);
      });
    }
  }

  public resetAllCars(): void {
    for (const raceCreator of this.raceCreators) {
      raceCreator.stopCar();
    }
  }

  public raceAllCars(): void {
    for (const raceCreator of this.raceCreators) {
      raceCreator.startAnimation();
    }
  }
}
