import { ICar } from '../lib/types/api-interfaces';
import { CssClasses, CssTags } from '../lib/types/enums';
import { IElementParameters, IListNodeCreator } from '../lib/types/interfaces';
import ButtonCreator from './button';
import ElementCreator from './element-creator';

import startIcon from '../assets/icon/start.png';
import stopIcon from '../assets/icon/stop.png';

const raceParameters = {
  tag: CssTags.Div,
  classNames: [CssClasses.RaceArea],
  textContent: '',
};

const raceBtnsParameters = {
  tag: CssTags.Div,
  classNames: [CssClasses.RaceBtn],
  textContent: '',
};

export default class ListNodeCreator
  extends ElementCreator
  implements IListNodeCreator
{
  public selectBtn: ButtonCreator | undefined;
  public deleteBtn: ButtonCreator | undefined;
  public startBth: ButtonCreator | undefined;
  public stopBth: ButtonCreator | undefined;
  private name: ElementCreator | undefined;
  // public listnode: HTMLInputElement[] = [];
  // public btn: ButtonCreator | undefined;

  constructor(parameters: IElementParameters, elementInfo: ICar) {
    super(parameters);
    this.createElement(parameters, elementInfo);
  }

  public createElement(
    parameters: IElementParameters,
    elementInfo?: ICar
  ): void {
    super.createElement(parameters);

    if (!elementInfo) return;

    if (this.element) this.element.id = elementInfo.id.toString();

    const bthSelectParams = {
      tag: CssTags.Button,
      classNames: [CssClasses.Select],
      textContent: 'SELECT',
      value: elementInfo.id.toString(),
    };

    this.selectBtn = new ButtonCreator(bthSelectParams);
    this.addInnerElement(this.selectBtn);

    const bthDeleteParams = {
      tag: CssTags.Button,
      classNames: [CssClasses.Delete],
      textContent: 'Delete',
      value: elementInfo.id.toString(),
    };

    this.deleteBtn = new ButtonCreator(bthDeleteParams);
    this.addInnerElement(this.deleteBtn);

    const nameParams = {
      tag: CssTags.Div,
      classNames: [CssClasses.NameArea],
      textContent: elementInfo.name,
    };

    this.name = new ElementCreator(nameParams);
    this.addInnerElement(this.name);

    const raceArea = this.createRaceArea(elementInfo);
    this.addInnerElement(raceArea);

    console.log(this, raceArea);
  }

  public createRaceArea(elementInfo: ICar): ElementCreator {
    const area = new ElementCreator(raceParameters);

    const buttonArea = this.addButtons(elementInfo);
    area.addInnerElement(buttonArea);

    return area;
  }
  public addButtons(elementInfo: ICar): ElementCreator {
    const btnArea = new ElementCreator(raceBtnsParameters);

    const startBtnParameters = {
      tag: CssTags.Button,
      classNames: [CssClasses.Start],
      textContent: '',
      imageURL: startIcon,
      title: 'Start',
      value: elementInfo.id.toString(),
    };

    this.startBth = new ButtonCreator(startBtnParameters);
    btnArea.addInnerElement(this.startBth);

    const stopBtnParameters = {
      tag: CssTags.Button,
      classNames: [CssClasses.Stop],
      textContent: '',
      imageURL: stopIcon,
      title: 'Stop',
      value: elementInfo.id.toString(),
    };

    this.stopBth = new ButtonCreator(stopBtnParameters);
    btnArea.addInnerElement(this.stopBth);

    return btnArea;
  }
}
