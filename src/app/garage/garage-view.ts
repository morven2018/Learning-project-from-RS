import ElementCreator from '../../components/element-creator';
import FormCreator from '../../components/form';
import ListNodeCreator from '../../components/list-node';
import View from '../../components/view';
import { CssClasses, CssTags } from '../../lib/types/enums';
import type { IElementCreator, IView } from '../../lib/types/interfaces';
import ApiClient from '../../lib/utils/api-client';
import CarCreator from '../../lib/utils/car-creator';
import type RaceCreator from '../../components/race-track';
import type { ICar, ICarCreate } from '../../lib/types/api-interfaces';
import Pagination from '../../components/pagination';

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
  private selectedCarId: number | undefined = undefined;
  private pagination: Pagination | undefined = undefined;
  private total: number = 0;

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

      const addForm = new FormCreator(formParameters[0], (carData) =>
        this.addCar(carData)
      );

      this.forms.push(addForm);
      this.viewElementCreator.addInnerElement(addForm);

      const updateForm = new FormCreator(
        formParameters[1],
        (carData: ICarCreate): void => {
          (async (): Promise<void> => {
            await this.handleUpdateCar(carData);
          })().catch((error) => {
            console.error('Update error:', error);
          });
        }
      );

      this.forms.push(updateForm);
      this.viewElementCreator.addInnerElement(updateForm);

      for (const parameters of buttonParameters) this.addButton(parameters);
      try {
        const response = await ApiClient.getCars({ _limit: 1 });
        this.total = response.totalCount;
        console.log(this.total);

        headerParameters.textContent = `Garage: ${this.total}`;

        this.header = new ElementCreator(headerParameters);
        this.viewElementCreator?.addInnerElement(this.header);

        const liParameters = {
          tag: CssTags.Ul,
          classNames: [CssClasses.GarageList],
          textContent: `Page #${this.page}`,
        };
        console.log('f7');
        this.list = new ElementCreator(liParameters);
        this.viewElementCreator.addInnerElement(this.list);
        console.log('f5');
        this.initPagination();
        console.log('f2');
        if (!this.list) {
          console.error('List element is not initialized');
          return;
        }
        console.log('7f');

        await this.generateNodes(this.list);
      } catch (error) {
        console.error(error);
      }
    }
  }

  public async generateNodes(parent: IElementCreator): Promise<void> {
    console.log('f');
    try {
      const response = await ApiClient.getCars({
        _page: this.page,
        _limit: this.limit,
      });
      this.raceCreators = [];
      this.total = response.totalCount || 0;

      this.updatePageInfo();

      if (this.pagination) {
        this.pagination.updateConfig({
          totalItems: this.total,
          currentPage: this.page,
        });
      }

      if (this.header) {
        this.header.setTextContent(`Garage: ${this.total}`);
      }
      // console.log(cars);
      for (const car of response.cars) {
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
    if (this.list) {
      this.list.clearInnerElements();
      this.updatePageInfo();
      this.generateNodes(this.list).catch((error) => {
        console.error('Failed to generate car nodes:', error);
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

  public fillUpdateForm(carInfo: ICar): void {
    const updateForm = this.forms[1];

    const nameInput = updateForm
      .getInputs()
      .find((input) => input.classList.contains(CssClasses.InputName));
    const colorInput = updateForm
      .getInputs()
      .find((input) => input.classList.contains(CssClasses.InputColor));

    if (nameInput && colorInput) {
      nameInput.value = carInfo.name;
      colorInput.value = carInfo.color;

      updateForm.element?.classList.remove('disabled');

      if (updateForm.element) {
        updateForm.element.dataset.carId = carInfo.id.toString();
      }
    }
  }

  public setSelectedCarId(id: number): void {
    this.selectedCarId = id;
  }

  private addCar(carData: { name: string; color: string }): void {
    // console.log('add');
    if (!carData.name || !carData.color) {
      return;
    }
    // console.log('add2');
    ApiClient.createCar(carData.name, carData.color)
      .then(() => {
        const addForm = this.forms[0];
        addForm.resetForm();
        this.updateCarList();
      })
      .catch((error) => {
        console.error('Failed to add car:', error);
      });
  }

  private initPagination(): void {
    const paginationParameters = {
      tag: CssTags.Div,
      classNames: [CssClasses.Pagination],
      textContent: '',
    };
    console.log('f11');
    this.pagination = new Pagination(paginationParameters, {
      currentPage: this.page,
      totalItems: this.total,
      itemsPerPage: this.limit,
      onPageChange: (newPage: number): void => {
        this.page = newPage;
        this.updatePageInfo();
        this.updateCarList();
      },
    });
    console.log('f111');
    if (this.viewElementCreator) {
      this.viewElementCreator.addInnerElement(this.pagination);
    }
  }

  private async handleUpdateCar(carData: {
    name: string;
    color: string;
  }): Promise<void> {
    if (!this.selectedCarId) {
      return;
    }

    try {
      await ApiClient.updateCar(
        this.selectedCarId,
        carData.name,
        carData.color
      );

      const carNode = this.findCarNode(this.selectedCarId);
      if (carNode) {
        carNode.updateCarAppearance(carData.color, carData.name);
      }

      this.updateCarList();

      this.forms[1].resetForm();
      this.forms[1].element?.classList.add('disabled');
    } catch (error) {
      console.error('Update failed:', error);
    }
  }

  private findCarNode(carId: number): RaceCreator | undefined {
    return this.raceCreators.find(
      (creator) => creator.element?.id === carId.toString()
    );
  }

  private updatePageInfo(): void {
    if (this.list) {
      this.list.setTextContent(`Page #${this.page}`);
    }
  }
}
