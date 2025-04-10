import type { IWinner } from '../lib/types/api-interfaces';
import { SortBy, SortDirection, TableColumn } from '../lib/types/enums';
import { CssClasses, CssTags, TableHeader } from '../lib/types/enums';
import type {
  IElementCreator,
  IElementParameters,
  ITableCreator,
} from '../lib/types/interfaces';
import ApiClient from '../lib/utils/api-client';
import ElementCreator from './element-creator';
import RaceCreator from './race-track';
import type { ICar } from '../lib/types/api-interfaces';

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
  TableHeader.Car.toLowerCase(),
  TableHeader.WinsClass,
  TableHeader.TimeClass,
];
const headerText = [
  TableHeader.Id,
  TableHeader.Car,
  TableHeader.Wins,
  TableHeader.Time,
];

const raceCreatorParameters = {
  tag: CssTags.Race,
  classNames: [],
  textContent: '',
  options: {
    width: 500,
    height: 200,
  },
};

const miniatureParameters = {
  tag: CssTags.Div,
  classNames: ['car-miniature-container'],
  textContent: '',
  options: {
    style:
      'display: inline-block; width: 400px; height: 200px; position: relative;' +
      'margin-left: -200px; margin-top: -120px; overflow: hidden;',
  },
};

const sortAsc = ' ↑';
const sortDesc = ' ↓';

const digitsAfterDot = 2;
const wins = 2;
const time = 3;
const id = 0;

export default class TableCreator
  extends ElementCreator
  implements ITableCreator
{
  public page: number = 1;
  public sortDirection: SortDirection = SortDirection.Asc;
  public sortValue: SortBy = SortBy.Id;
  public onPageChange?: (newPage: number) => void;
  public onSortChange?: () => void;
  private winners: IWinner[] = [];
  private caption: IElementCreator | undefined = undefined;
  private body: IElementCreator | undefined = undefined;
  private headerElements: IElementCreator[] = [];

  constructor(parameters: IElementParameters, page?: number) {
    super(parameters);
    if (page) this.page = page;
    this.createElement(parameters);
    setTimeout(() => {
      this.updateSortUI();
    }, 0);
  }

  private static isValidTableColumn(
    columnIndex: number
  ): columnIndex is TableColumn {
    return Object.values(TableColumn).includes(columnIndex);
  }

  private static isValidSortBy(value: string): value is SortBy {
    return value === 'id' || value === 'wins' || value === 'time';
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

  private static createRaceCreatorMiniature(car: ICar): ElementCreator {
    const container = new ElementCreator(miniatureParameters);
    container.element?.setAttribute('style', miniatureParameters.options.style);

    const raceCreator = new RaceCreator(raceCreatorParameters, car);

    raceCreator['car'].position = 0.5;
    raceCreator.updateCarColor(car.color);

    raceCreator['drawTrack'] = (): void => {};
    raceCreator['drawFinish'] = (): void => {};

    raceCreator['renderFrame'] = function (): void {
      if (this.element instanceof HTMLCanvasElement && this.context) {
        this.context.clearRect(0, 0, this.element.width, this.element.height);
        if (this.car.assets.body && this.car.assets.wheels) {
          this.drawCar();
        }
      }
    };

    if (raceCreator.element) {
      container.addInnerElement(raceCreator);
    }

    return container;
  }

  private static async createTableRow(
    winner: IWinner
  ): Promise<ElementCreator> {
    const row = new ElementCreator(rowParameters);
    const car = await ApiClient.getCar(winner.id);

    row.addInnerElement(TableCreator.createIdCell(winner));
    row.addInnerElement(TableCreator.createCarCell(car));
    row.addInnerElement(TableCreator.createWinsCell(winner));
    row.addInnerElement(TableCreator.createTimeCell(winner));

    return row;
  }
  private static createIdCell(winner: IWinner): ElementCreator {
    return new ElementCreator({
      tag: CssTags.Td,
      classNames: [headerClasses[0]],
      textContent: winner.id.toString(),
    });
  }

  private static createCarCell(car: ICar): ElementCreator {
    const carCell = new ElementCreator({
      tag: CssTags.Td,
      classNames: [headerClasses[TableColumn.Name]],
      textContent: '',
    });

    const carMiniature = TableCreator.createRaceCreatorMiniature(car);
    carCell.addInnerElement(carMiniature);

    const carName = new ElementCreator({
      tag: CssTags.Span,
      classNames: [],
      textContent: car.name,
    });
    carCell.addInnerElement(carName);

    return carCell;
  }

  private static createWinsCell(winner: IWinner): ElementCreator {
    return new ElementCreator({
      tag: CssTags.Td,
      classNames: [headerClasses[TableColumn.Wins]],
      textContent: winner.wins.toString(),
    });
  }

  private static createTimeCell(winner: IWinner): ElementCreator {
    return new ElementCreator({
      tag: CssTags.Td,
      classNames: [headerClasses[TableColumn.Time]],
      textContent: `${winner.time.toFixed(digitsAfterDot)}s`,
    });
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

  public async fillTable(winners?: IWinner[]): Promise<void> {
    if (winners) this.winners = winners;

    if (this.caption?.element)
      this.caption.element.textContent = `Page: ${this.page}`;

    if (this.body?.element instanceof HTMLElement)
      this.body.element.replaceChildren();

    try {
      for (const winner of this.winners) {
        const row = await TableCreator.createTableRow(winner);
        this.body?.addInnerElement(row);
      }
    } catch (error) {
      console.error('Error filling table:', error);
    }
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

    this.headerElements = [];

    const column = headerClasses.length;
    for (let index = 0; index < column; index += 1) {
      const parameters = {
        tag: CssTags.Th,
        classNames: [headerClasses[index]],
        textContent: headerText[index],
      };
      const element = new ElementCreator(parameters);
      this.headerElements.push(element);
      if (index !== 1) {
        element.element?.style.setProperty('position', 'relative');
        element.element?.style.setProperty('z-index', '2');
        element.element?.addEventListener('click', () => {
          this.handleHeaderClick(index);
        });
      }
      row.addInnerElement(element);
      this.updateSortUI();
    }
  }

  private updateSortUI(): void {
    for (const [index, header] of this.headerElements.entries()) {
      if (index === 1) continue;

      const currentText = header.element?.textContent;
      if (currentText) {
        const textWithoutArrows = currentText
          .replace(sortAsc, '')
          .replace(sortDesc, '');

        header.setTextContent(textWithoutArrows);

        if (
          (index === id && this.sortValue === SortBy.Id) ||
          (index === wins && this.sortValue === SortBy.Wins) ||
          (index === time && this.sortValue === SortBy.Time)
        ) {
          const arrow =
            this.sortDirection === SortDirection.Asc ? sortAsc : sortDesc;
          header.setTextContent(textWithoutArrows + arrow);
        }
      }
    }
  }

  private handleHeaderClick(columnIndex: number): void {
    let newSortValue: SortBy;
    if (TableCreator.isValidTableColumn(columnIndex)) {
      switch (columnIndex) {
        case TableColumn.Id: {
          newSortValue = SortBy.Id;
          break;
        }
        case TableColumn.Wins: {
          newSortValue = SortBy.Wins;
          break;
        }
        case TableColumn.Time: {
          newSortValue = SortBy.Time;
          break;
        }
        default: {
          return;
        }
      }

      if (
        TableCreator.isValidSortBy(newSortValue) &&
        this.sortValue === newSortValue
      ) {
        this.sortDirection =
          this.sortDirection === SortDirection.Asc
            ? SortDirection.Desc
            : SortDirection.Asc;
      } else {
        this.sortValue = newSortValue;
        this.sortDirection = SortDirection.Asc;
      }

      this.updateSortUI();
      if (this.onSortChange) {
        this.onSortChange();
      }
    }
  }

  private createBody(): void {
    this.body = new ElementCreator(tableBodyParameters);
    this.addInnerElement(this.body);
  }
}
