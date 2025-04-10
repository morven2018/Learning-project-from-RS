import ElementCreator from '../../components/element-creator';
import Pagination from '../../components/pagination';
import TableCreator from '../../components/table';
import View from '../../components/view';
import ApiClient from '../../lib/utils/api-client';

import {
  CssClasses,
  CssTags,
  SortBy,
  SortDirection,
} from '../../lib/types/enums';

import type {
  IPaginationConfig,
  IWinnersView,
} from '../../lib/types/interfaces';

import './winners.scss';

const pageElements = 10;

const headerParameters = {
  tag: CssTags.H1,
  classNames: [CssClasses.H1],
  textContent: '',
};

const parameters = {
  tag: CssTags.Section,
  classNames: [CssClasses.Winners],
};

const tableParameters = {
  tag: CssTags.Table,
  classNames: [CssClasses.Table],
  textContent: '',
};

const paginationParameters = {
  tag: CssTags.Div,
  classNames: [CssClasses.Pagination],
  textContent: '',
};

export default class WinnersView extends View implements IWinnersView {
  private total: number = 0;
  private page: number = 1;
  private header: ElementCreator | undefined = undefined;
  private table: TableCreator | undefined = undefined;
  private pagination: Pagination | undefined;

  constructor() {
    super(parameters);
    this.loadState();
    this.configureView().catch(console.error);
  }

  public async configureView(): Promise<void> {
    if (this.viewElementCreator)
      try {
        const response = await ApiClient.getWinners({ _limit: 1 });
        this.total = response.totalCount;
        headerParameters.textContent = `Winners: ${this.total}`;

        this.header = new ElementCreator(headerParameters);
        this.viewElementCreator?.addInnerElement(this.header);

        this.table = new TableCreator(tableParameters, this.page);
        this.loadState();
        this.table.onPageChange = (newPage: number): void => {
          this.page = newPage;
          this.pagination?.updateConfig({ currentPage: newPage });
          this.saveState();
          this.loadTableData().catch(console.error);
        };

        this.table.onSortChange = (): void => {
          this.pagination?.updateConfig({ currentPage: this.page });
          this.saveState();
          this.loadTableData().catch(console.error);
        };
        this.viewElementCreator?.addInnerElement(this.table);

        this.initPagination();

        await this.loadTableData();
      } catch (error) {
        console.error(error);
      }
  }

  private saveState(): void {
    sessionStorage.setItem(
      'winnersViewState',
      JSON.stringify({
        page: this.page,
        sortValue: this.table?.sortValue,
        sortDirection: this.table?.sortDirection,
      })
    );
  }

  private loadState(): void {
    const savedState = sessionStorage.getItem('winnersViewState');
    if (savedState) {
      const state: unknown = JSON.parse(savedState);
      if (state && typeof state === 'object') {
        if ('page' in state) this.page = Number(state.page) || this.page;
        if (
          this.table &&
          'sortValue' in state &&
          (state.sortValue === SortBy.Id ||
            state.sortValue === SortBy.Time ||
            state.sortValue === SortBy.Wins) &&
          'sortDirection' in state &&
          (state.sortDirection === SortDirection.Asc ||
            state.sortDirection === SortDirection.Desc)
        ) {
          this.table.sortValue = state.sortValue || SortBy.Id;
          this.table.sortDirection = state.sortDirection || SortDirection.Asc;
        }
      }
    }
  }

  private initPagination(): void {
    const paginationConfig: IPaginationConfig = {
      currentPage: this.page,
      totalItems: this.total,
      itemsPerPage: pageElements,
      onPageChange: (newPage: number) => {
        this.page = newPage;
        if (this.table) this.table.page = newPage;
        this.loadTableData().catch(console.error);
      },
    };

    this.pagination = new Pagination(
      {
        tag: CssTags.Div,
        classNames: [CssClasses.Pagination],
        textContent: '',
      },
      paginationConfig
    );

    const container = new ElementCreator(paginationParameters);
    container.addInnerElement(this.pagination);
    this.viewElementCreator?.addInnerElement(container);
  }

  private async loadTableData(): Promise<void> {
    if (!this.table || !this.pagination) return;

    try {
      const sortParameters = {
        _sort: this.table.sortValue,
        _order: this.table.sortDirection,
        _page: this.page,
        _limit: pageElements,
      };

      const response = await ApiClient.getWinners(sortParameters);
      this.total = response.totalCount;

      this.pagination.updateConfig({
        currentPage: this.page,
        totalItems: this.total,
      });

      this.updateHeader();
      await this.table.fillTable(response.winners);
    } catch (error) {
      console.error('Failed to load table data:', error);
    }
  }

  private updateHeader(): void {
    if (this.header) {
      this.header.setTextContent(`Winners: ${this.total}`);
    }
  }
}
