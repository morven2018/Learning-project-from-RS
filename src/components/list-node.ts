import { ICar } from '../lib/types/api-interfaces';
import { CssClasses, CssTags } from '../lib/types/enums';
import {
  IElementParameters,
  IFormCreator,
  IListNodeCreator,
} from '../lib/types/interfaces';
import ButtonCreator from './button';
import ElementCreator from './element-creator';
import InputCreator from './input';

export default class ListNodeCreator
  extends ElementCreator
  implements IListNodeCreator
{
  public selectBtn: ButtonCreator | undefined;
  public deleteBtn: ButtonCreator | undefined;
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
      classNames: [CssClasses.Name],
      textContent: elementInfo.name,
    };

    this.name = new ElementCreator(nameParams);
    this.addInnerElement(this.name);

    console.log(this);
  }
}
