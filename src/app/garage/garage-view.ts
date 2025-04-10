import ElementCreator from '../../components/element-creator';
import FormCreator from '../../components/form';
import ListNodeCreator from '../../components/list-node';
import View from '../../components/view';
import ApiClient from '../../lib/utils/api-client';
import CarCreator from '../../lib/utils/car-creator';
import RaceCreator from '../../components/race-track';
import Pagination from '../../components/pagination';

import { CssClasses, CssTags } from '../../lib/types/enums';
import type {
  IElementCreator,
  IElementParameters,
  IFormCreator,
  IGarageView,
  IPagination,
  IRaceCreator,
} from '../../lib/types/interfaces';
import type { ICar, ICarCreate } from '../../lib/types/api-interfaces';

import './garage.scss';

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

export default class GarageView extends View implements IGarageView {
  public buttons: HTMLButtonElement[] = [];
  public page: number = 1;
  public limit: number;
  public forms: IFormCreator[] = [];
  public raceCreators: IRaceCreator[] = [];
  private list: IElementCreator | undefined = undefined;
  private header: IElementCreator | undefined = undefined;
  private selectedCarId: number | undefined = undefined;
  private pagination: IPagination | undefined = undefined;
  private total: number = 0;

  constructor() {
    super(parameters);

    this.buttons = [];
    const page = GarageView.loadPageState();

    if (typeof page === 'number') this.page = page;

    this.limit = 7;
    this.configureView().catch((error) => {
      console.error('Failed to configure view:', error);
    });
  }

  private static isStringRecord(
    value: unknown
  ): value is Record<string, string> {
    return (
      typeof value === 'object' &&
      value !== null &&
      Object.values(value).every((v) => typeof v === 'string')
    );
  }

  private static getFormData(form?: FormCreator): Record<string, string> {
    const result: Record<string, string> = {};
    if (form?.getInputs() && Array.isArray(form.getInputs()))
      for (const input of form.getInputs()) {
        if (typeof input.value === 'string') {
          result[input.id] = input.value;
        }
      }
    return result;
  }

  private static loadPageState(): number | undefined {
    try {
      const savedState = sessionStorage.getItem('garageState');
      if (savedState) {
        const parsed: unknown = JSON.parse(savedState);
        if (
          parsed &&
          typeof parsed === 'object' &&
          'page' in parsed &&
          typeof parsed.page === 'number'
        )
          return parsed.page;
        return undefined;
      }
    } catch (error) {
      console.error(error);
    }
    return undefined;
  }

  public updatePage(newPage: number): void {
    this.page = newPage;
    this.saveState();
    this.updatePageInfo();
    this.updateCarList();
  }

  public async configureView(): Promise<void> {
    if (this.viewElementCreator) {
      const buttonParameters = this.getButtonParameters();

      const addForm = new FormCreator(formParameters[0], (carData) =>
        this.addCar(carData)
      );

      this.forms.push(addForm);

      const updateForm = new FormCreator(
        formParameters[1],
        this.getFromCallback()
      );

      this.forms.push(updateForm);

      this.loadFormState();
      this.viewElementCreator.addInnerElement(addForm);
      this.viewElementCreator.addInnerElement(updateForm);

      for (const parameters of buttonParameters) this.addButton(parameters);
      try {
        const response = await ApiClient.getCars({ _limit: 1 });
        this.total = response.totalCount;

        headerParameters.textContent = `Garage: ${this.total}`;

        this.header = new ElementCreator(headerParameters);
        this.viewElementCreator?.addInnerElement(this.header);

        const liParameters = {
          tag: CssTags.Ul,
          classNames: [CssClasses.GarageList],
          textContent: `Page #${this.page}`,
        };

        this.list = new ElementCreator(liParameters);
        this.viewElementCreator.addInnerElement(this.list);
        this.initPagination();
        if (!this.list) {
          console.error('List element is not initialized');
          return;
        }

        await this.generateNodes(this.list);
      } catch (error) {
        console.error(error);
      }
    }
  }

  public async generateNodes(parent: IElementCreator): Promise<void> {
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

  public generateHandler(event: Event): void {
    event.preventDefault();
    event.stopPropagation();
    void CarCreator.createNCars(numberOfGeneratedCars).then(() =>
      this.updateCarList()
    );
  }

  public updateCarList(): void {
    this.saveState();
    this.raceCreators = [];
    if (this.list) {
      this.list.clearInnerElements();
      this.updatePageInfo();
      this.generateNodes(this.list).catch((error) => {
        console.error('Failed to generate car nodes:', error);
      });
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

      sessionStorage.setItem('garageUpdateCarId', carInfo.id.toString());
    }
  }

  public setSelectedCarId(id: number): void {
    this.selectedCarId = id;
  }

  public resetAllCars(): void {
    RaceCreator.resetWinner();
    for (const raceCreator of this.raceCreators) {
      raceCreator.stopCar().catch(console.error);
    }
  }

  public raceAllCars(): void {
    RaceCreator.resetWinner();
    for (const raceCreator of this.raceCreators) {
      raceCreator.startCar(true).catch(console.error);
    }
  }

  private initPagination(): void {
    const paginationParameters = {
      tag: CssTags.Div,
      classNames: [CssClasses.Pagination],
      textContent: '',
    };

    this.pagination = new Pagination(paginationParameters, {
      currentPage: this.page,
      totalItems: this.total,
      itemsPerPage: this.limit,
      onPageChange: (newPage: number): void => {
        this.page = newPage;
        this.saveState();
        this.updatePageInfo();
        this.updateCarList();
      },
    });

    if (this.viewElementCreator) {
      this.viewElementCreator.addInnerElement(this.pagination);
    }
  }

  private getButtonParameters(): IElementParameters[] {
    return [
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
  }

  private getFromCallback(): (carData: ICarCreate) => void {
    return (carData: ICarCreate): void => {
      (async (): Promise<void> => {
        await this.handleUpdateCar(carData);
      })().catch((error) => {
        console.error('Update error:', error);
      });
    };
  }

  private addCar(carData: { name: string; color: string }): void {
    if (!carData.name || !carData.color) {
      return;
    }

    ApiClient.createCar(carData.name, carData.color)
      .then(() => {
        const addForm = this.forms[0];
        addForm.resetForm();
        this.saveState();
        this.updateCarList();
      })
      .catch((error) => {
        console.error('Failed to add car:', error);
      });
  }

  private findCarNode(carId: number): IRaceCreator | undefined {
    return this.raceCreators.find(
      (creator) => creator.element?.id === carId.toString()
    );
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
      sessionStorage.removeItem('garageUpdateCarId');

      this.saveState();
    } catch (error) {
      console.error('Update failed:', error);
    }
  }

  private updatePageInfo(): void {
    if (this.list) {
      this.list.setTextContent(`Page #${this.page}`);
    }
  }

  private loadFormState(): void {
    try {
      const savedAddForm = sessionStorage.getItem('garageStateAddForm');
      if (savedAddForm && this.forms[0]) {
        const parsedAddForm: unknown = JSON.parse(savedAddForm);

        if (GarageView.isStringRecord(parsedAddForm)) {
          this.forms[0].setFormData(parsedAddForm);

          if (Object.values(parsedAddForm).some((value) => value.trim() !== ''))
            this.forms[0].element?.classList.remove('disabled');
        } else console.warn('Invalid data structure in garageStateAddForm');
      }

      const savedUpdateForm = sessionStorage.getItem('garageStateUpdateForm');
      if (savedUpdateForm && this.forms[1]) {
        const parsedUpdateForm: unknown = JSON.parse(savedUpdateForm);

        if (GarageView.isStringRecord(parsedUpdateForm)) {
          this.forms[1].setFormData(parsedUpdateForm);

          const carNameInput = this.forms[1]
            .getInputs()
            .find((input) => input.id.includes('car-name'));

          if (carNameInput?.value.trim()) {
            this.forms[1].element?.classList.remove('disabled');
            const savedCarId = sessionStorage.getItem('garageUpdateCarId');
            if (savedCarId && this.forms[1].element) {
              this.forms[1].element.dataset.carId = savedCarId;
              this.selectedCarId = Number.parseInt(savedCarId, 10);
            }
          } else this.forms[1].element?.classList.add('disabled');
        } else console.warn('Invalid data structure in garageStateUpdateForm');
      }
    } catch (error) {
      console.error('Failed to load form state:', error);
    }
  }

  private saveState(): void {
    const stateToSave = {
      page: this.page,
      addForm: GarageView.getFormData(this.forms[0]),
      updateForm: GarageView.getFormData(this.forms[1]),
    };

    sessionStorage.setItem('garageState', JSON.stringify(stateToSave));
  }
}
