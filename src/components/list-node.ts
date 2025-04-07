import type { ICar } from '../lib/types/api-interfaces';
import { CssClasses, CssTags } from '../lib/types/enums';
import type {
  IElementParameters,
  IListNodeCreator,
} from '../lib/types/interfaces';
import ButtonCreator from './button';
import ElementCreator from './element-creator';

import startIcon from '../assets/icon/start.png';
import stopIcon from '../assets/icon/stop.png';
import RaceCreator from './race-track';

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

const trackHeight = 80;
export default class ListNodeCreator
  extends ElementCreator
  implements IListNodeCreator
{
  public selectBtn: ButtonCreator | undefined;
  public deleteBtn: ButtonCreator | undefined;
  public startBth: ButtonCreator | undefined;
  public stopBth: ButtonCreator | undefined;
  private name: ElementCreator | undefined;
  private raceTrack: RaceCreator | undefined;

  constructor(parameters: IElementParameters, elementInfo: ICar) {
    super(parameters);
    this.createElement(parameters, elementInfo);
  }

  public static getWidth(): number {
    const width = document.documentElement.clientWidth;
    const padding = Math.max(mainPaddingPx, width * 0.1);
    return width - 2 * padding;
  }

  public createElement(
    parameters: IElementParameters,
    elementInfo?: ICar
  ): void {
    super.createElement(parameters);

    if (!elementInfo) return;

    if (this.element) this.element.id = elementInfo.id.toString();

    const bthSelectParameters = {
      tag: CssTags.Button,
      classNames: [CssClasses.Select],
      textContent: 'SELECT',
      value: elementInfo.id.toString(),
    };

    this.selectBtn = new ButtonCreator(bthSelectParameters);
    this.addInnerElement(this.selectBtn);

    const bthDeleteParameters = {
      tag: CssTags.Button,
      classNames: [CssClasses.Delete],
      textContent: 'Delete',
      value: elementInfo.id.toString(),
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

    console.log(this, raceArea);
  }

  public createRaceArea(elementInfo: ICar): ElementCreator {
    const area = new ElementCreator(raceParameters);

    const buttonArea = this.addButtons(elementInfo);
    area.addInnerElement(buttonArea);

    this.raceTrack = this.addRaceArea(elementInfo);
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

  public addRaceArea(elementInfo: ICar): RaceCreator {
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
    console.log(this);

    const track = new RaceCreator(raceParameters, elementInfo);
    return track;
  }

  private startCar(): void {
    this.raceTrack?.startAnimation();
  }
  private stopCar(): void {
    this.raceTrack?.brokeCar().catch(console.error);
  }
}
