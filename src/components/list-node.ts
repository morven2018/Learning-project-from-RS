import type { ICar } from '../lib/types/api-interfaces';
import { CssClasses, CssTags } from '../lib/types/enums';
import type GarageView from '../app/garage/garage-view';
import type {
  IElementParameters,
  IListNodeCreator,
} from '../lib/types/interfaces';
import ButtonCreator from './button';
import ElementCreator from './element-creator';

import startIcon from '../assets/icon/start.png';
import stopIcon from '../assets/icon/stop.png';
import RaceCreator from './race-track';
import ApiClient from '../lib/utils/api-client';

const mainPaddingPx = 30;
const raceParameters = {
  tag: CssTags.Div,
  classNames: [CssClasses.RaceArea],
  textContent: '',
};

const raceBtnsParameters = {
  tag: CssTags.Div,
  classNames: [CssClasses.RaceButton],
  textContent: '',
};

const trackHeight = 60;
export default class ListNodeCreator
  extends ElementCreator
  implements IListNodeCreator
{
  public parent: GarageView | undefined = undefined;
  public selectBtn: ButtonCreator | undefined;
  public deleteBtn: ButtonCreator | undefined;
  public startBth: ButtonCreator | undefined;
  public raceTrack: RaceCreator | undefined;
  public stopBth: ButtonCreator | undefined;
  public name: ElementCreator | undefined;
  public elementInfo?: ICar;

  constructor(
    parameters: IElementParameters,
    elementInfo: ICar,
    parent?: GarageView
  ) {
    super(parameters);
    this.createElement(parameters, elementInfo);
    if (parent) this.parent = parent;
  }

  public get carName(): string {
    return this.name?.element?.textContent || '';
  }

  public static getWidth(): number {
    const width = document.documentElement.clientWidth;
    const padding = Math.max(mainPaddingPx, width * 0.02);
    return width - 2 * padding;
  }
  public static addRaceArea(
    elementInfo: ICar,
    parentNode: ListNodeCreator
  ): RaceCreator {
    const width = ListNodeCreator.getWidth() || 400;
    const raceParameters = {
      tag: CssTags.Race,
      classNames: [CssClasses.RaceTrack],
      textContent: '',
      id: elementInfo.id.toString(),
      options: {
        width: width,
        height: trackHeight,
      },
    };

    const track = new RaceCreator(raceParameters, elementInfo, parentNode);
    return track;
  }

  public createElement(
    parameters: IElementParameters,
    elementInfo?: ICar
  ): void {
    super.createElement(parameters);

    /* const callback = (event: Event): void => {
      event.preventDefault();
      if (this.parent) {
        this.parent.setSelectedCarId(elementInfo.id);
        this.parent.fillUpdateForm(elementInfo);
      }
    }; */

    if (!elementInfo) return;

    if (this.element) this.element.id = elementInfo.id.toString();

    const bthSelectParameters = {
      tag: CssTags.Button,
      classNames: [CssClasses.Select],
      textContent: 'SELECT',
      value: elementInfo.id.toString(),
      callback: (event: Event): void => {
        event.preventDefault();
        if (this.parent && elementInfo) {
          this.parent.setSelectedCarId(elementInfo.id);
          this.parent.fillUpdateForm(elementInfo);
        }
      },
    };

    if (this.selectBtn) {
      this.selectBtn.update(bthSelectParameters);
    } else {
      this.selectBtn = new ButtonCreator(bthSelectParameters);
      this.addInnerElement(this.selectBtn);
    }

    const bthDeleteParameters = {
      tag: CssTags.Button,
      classNames: [CssClasses.Delete],
      textContent: 'Delete',
      value: elementInfo.id.toString(),
      callback: this.deleteCar.bind(this, elementInfo.id),
    };

    this.deleteBtn = new ButtonCreator(bthDeleteParameters);
    this.addInnerElement(this.deleteBtn);

    const nameParameters = {
      tag: CssTags.Div,
      classNames: [CssClasses.NameArea],
      textContent: elementInfo.name,
    };

    this.name = new ElementCreator(nameParameters);
    this.addInnerElement(this.name);

    const raceArea = this.createRaceArea(elementInfo);
    this.addInnerElement(raceArea);

    // console.log(this, raceArea);
  }

  public createRaceArea(elementInfo: ICar): ElementCreator {
    const area = new ElementCreator(raceParameters);

    const buttonArea = this.addButtons(elementInfo);
    area.addInnerElement(buttonArea);

    this.raceTrack = ListNodeCreator.addRaceArea(elementInfo, this);
    area.addInnerElement(this.raceTrack);

    return area;
  }

  public addButtons(elementInfo: ICar): ElementCreator {
    const buttonArea = new ElementCreator(raceBtnsParameters);

    const startButtonParameters = {
      tag: CssTags.Button,
      classNames: [CssClasses.Start],
      textContent: '',
      imageURL: startIcon,
      title: 'Start',
      value: elementInfo.id.toString(),
      callback: this.startCar.bind(this),
    };

    this.startBth = new ButtonCreator(startButtonParameters);
    buttonArea.addInnerElement(this.startBth);

    const stopButtonParameters = {
      tag: CssTags.Button,
      classNames: [CssClasses.Stop],
      textContent: '',
      imageURL: stopIcon,
      title: 'Stop',
      value: elementInfo.id.toString(),
      callback: this.stopCar.bind(this),
    };

    this.stopBth = new ButtonCreator(stopButtonParameters);
    buttonArea.addInnerElement(this.stopBth);

    return buttonArea;
  }

  public updateCarAppearance(color: string, name: string): void {
    if (this.raceTrack) {
      this.raceTrack.updateCarColor(color);
    }

    const nameElement = this.element?.querySelector(`.${CssClasses.NameArea}`);
    if (nameElement) {
      nameElement.textContent = name;
    }
  }
  private startCar(false): void {
    this.raceTrack?.startCar().catch(console.error);
  }

  private stopCar(): void {
    this.raceTrack?.stopCar().catch(console.error);
    this.raceTrack?.resetCar();
  }
  private deleteCar(id: number): void {
    if (Number.isFinite(id))
      ApiClient.deleteCar(id)
        .then(() => {
          if (this.element instanceof HTMLElement) this.element.remove();
          if (this.parent) this.parent.updateCarList();
        })
        .catch(console.error);
  }
}
