import type { IWinner } from '../lib/types/api-interfaces';
import { SortBy, SortDirection } from '../lib/types/enums';
import { CssClasses, CssTags, TableHeader } from '../lib/types/enums';
import type { IElementParameters } from '../lib/types/interfaces';
import ApiClient from '../lib/utils/api-client';
import ElementCreator from './element-creator';

const pageElements = 10;
const captionParameters = {
  tag: CssTags.Caption,
  classNames: [CssClasses.Caption],
  textContent: '',
};

const rowParameters = {
  tag: CssTags.Tr,
  classNames: [CssClasses.Tr],
  textContent: '',
};

const tableHeaderParameters = {
  tag: CssTags.Thead,
  classNames: [CssClasses.Thead],
  textContent: '',
};

const tableBodyParameters = {
  tag: CssTags.Tbody,
  classNames: [CssClasses.Tbody],
  textContent: '',
};

const headerClasses = [
  TableHeader.IdClass,
  TableHeader.Car,
  TableHeader.WinsClass,
  TableHeader.TimeClass,
];
const headerText = [
  TableHeader.Id,
  TableHeader.Car,
  TableHeader.Wins,
  TableHeader.Time,
];

export default class TableCreator extends ElementCreator {
  public page: number = 1;
  public sortDirection: SortDirection = SortDirection.Asc;
  public sortValue: SortBy = SortBy.Id;
  private winners: IWinner[] = [];
  // private totalCount: number = 0;
  private caption: ElementCreator | undefined = undefined;
  private body: ElementCreator | undefined = undefined;

  constructor(parameters: IElementParameters, page?: number) {
    super(parameters);
    if (page) this.page = page;
    this.createElement(parameters);
  }

  private static removeDuplicates(winners: IWinner[]): IWinner[] {
    const unique = new Map<number, IWinner>();
    for (const winner of winners) {
      if (!unique.has(winner.id)) {
        unique.set(winner.id, winner);
      }
    }
    return [...unique.values()];
  }

  public createElement(parameters: IElementParameters): void {
    super.createElement(parameters);
    this.createCaption();
    this.createHeader();
    this.createBody();
  }
  public async loadTableData(): Promise<void> {
    try {
      const response = await ApiClient.getWinners({
        _page: this.page,
        _limit: pageElements,
        _sort: this.sortValue,
        _order: this.sortDirection,
      });
      this.winners = TableCreator.removeDuplicates(response.winners);

      this.fillTable().catch(console.error);
    } catch (error) {
      console.error('Failed to load winners:', error);
    }
  }
  public updatePage(newPage: number): void {
    this.page = newPage;
    this.loadTableData().catch(console.error);
  }

  private createCaption(): void {
    captionParameters.textContent = `Page: ${this.page}`;
    this.caption = new ElementCreator(captionParameters);
    this.addInnerElement(this.caption);
  }

  private createHeader(): void {
    const header = new ElementCreator(tableHeaderParameters);
    this.addInnerElement(header);
    const row = new ElementCreator(rowParameters);
    header.addInnerElement(row);

    const column = headerClasses.length;
    for (let index = 0; index < column; index += 1) {
      const parameters = {
        tag: CssTags.Th,
        classNames: [headerClasses[index]],
        textContent: headerText[index],
      };
      const element = new ElementCreator(parameters);
      row.addInnerElement(element);
    }
  }

  private createBody(): void {
    this.body = new ElementCreator(tableBodyParameters);
    this.addInnerElement(this.body);
  }

  private async fillTable(): Promise<void> {
    if (this.caption?.element)
      this.caption.element.textContent = `Page: ${this.page}`;

    if (this.body?.element instanceof HTMLElement)
      this.body.element.replaceChildren();

    for (const winner of this.winners) {
      const car = await ApiClient.getCar(winner.id);
      const row = new ElementCreator(rowParameters);

      const idCellParameters = {
        tag: CssTags.Td,
        classNames: [headerClasses[0]],
        textContent: winner.id.toString(),
      };

      const idCell = new ElementCreator(idCellParameters);
      row.addInnerElement(idCell);

      const carCellParameters = {
        tag: CssTags.Td,
        classNames: [headerClasses[1]],
        textContent: car.name,
      };
      const carCell = new ElementCreator(carCellParameters);
      row.addInnerElement(carCell);

      const winCellParameters = {
        tag: CssTags.Td,
        classNames: [headerClasses[2]],
        textContent: winner.wins.toString(),
      };

      const winsCell = new ElementCreator(winCellParameters);
      row.addInnerElement(winsCell);

      const timeCellParameters = {
        tag: CssTags.Td,
        classNames: [headerClasses[3]],
        textContent: `${winner.time.toFixed(2)}s`,
      };

      const timeCell = new ElementCreator(timeCellParameters);
      row.addInnerElement(timeCell);

      this.body?.addInnerElement(row);
    }
  }
}
