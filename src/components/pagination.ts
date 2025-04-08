import ElementCreator from './element-creator';
import { CssClasses, CssTags, PaginationButtons } from '../lib/types/enums';
import type { IElementParameters } from '../lib/types/interfaces';

const maxTotalPagesFull = 7;

export interface IPaginationConfig {
  currentPage: number;
  totalItems: number;
  itemsPerPage: number;
  onPageChange: (page: number) => void;
}

export default class Pagination extends ElementCreator {
  private config: IPaginationConfig;

  constructor(parameters: IElementParameters, config: IPaginationConfig) {
    super(parameters);

    this.config = config;

    this.createElement(parameters);

    this.renderPagination();
  }

  public updateConfig(newConfig: Partial<IPaginationConfig>): void {
    this.config = { ...this.config, ...newConfig };
    this.renderPagination();
  }

  private renderPagination(): void {
    this.clearInnerElements();
    const { currentPage, totalItems, itemsPerPage, onPageChange } = this.config;
    const totalPages = Math.ceil(totalItems / itemsPerPage);

    this.addPaginationButton(PaginationButtons.Previous, currentPage > 1, () =>
      onPageChange(currentPage - 1)
    );
    if (totalPages <= maxTotalPagesFull) {
      for (let index = 1; index <= totalPages; index++) {
        this.addPageButton(index, currentPage === index, onPageChange);
      }
    } else {
      this.addComplexPagination(currentPage, totalPages, onPageChange);
    }
    this.addPaginationButton(
      PaginationButtons.Next,
      currentPage < totalPages,
      () => onPageChange(currentPage + 1)
    );
  }

  private addComplexPagination(
    currentPage: number,
    totalPages: number,
    onPageChange: (page: number) => void
  ): void {
    this.addPageButton(1, currentPage === 1, onPageChange);

    if (currentPage > 3) {
      this.addEllipsis();
    }

    const start = Math.max(2, currentPage - 1);
    const end = Math.min(totalPages - 1, currentPage + 1);

    for (let index = start; index <= end; index++) {
      this.addPageButton(index, index === currentPage, onPageChange);
    }

    if (currentPage < totalPages - 2) {
      this.addEllipsis();
    }

    if (totalPages > 1) {
      this.addPageButton(totalPages, currentPage === totalPages, onPageChange);
    }
  }

  private addPaginationButton(
    text: string,
    enabled: boolean,
    callback: () => void
  ): void {
    const buttonClasses = [CssClasses.PaginationButton];

    if (!enabled) {
      buttonClasses.push(CssClasses.Disable);
    }

    const button = new ElementCreator({
      tag: CssTags.Button,
      classNames: buttonClasses,
      textContent: text,
    });

    if (!enabled && button.element) {
      button.element.setAttribute('disabled', 'true');
    }

    if (enabled && callback) {
      button.setCallback(() => {
        callback();
      });
    }

    this.addInnerElement(button);
  }

  private addPageButton(
    page: number,
    isCurrentPage: boolean,
    onPageChange: (page: number) => void
  ): void {
    const buttonClasses = [CssClasses.PaginationButton];
    if (isCurrentPage) {
      buttonClasses.push(CssClasses.Disable);
    }

    if (isCurrentPage) {
      buttonClasses.push(CssClasses.ActivePage);
    }

    const button = new ElementCreator({
      tag: CssTags.Button,
      classNames: buttonClasses,
      textContent: page.toString(),
    });

    if (isCurrentPage) {
      button.element?.setAttribute('disabled', 'true');
    }

    if (!isCurrentPage) {
      button.setCallback(() => onPageChange(page));
    }

    this.addInnerElement(button);
  }

  private addEllipsis(): void {
    this.addInnerElement(
      new ElementCreator({
        tag: CssTags.Span,
        classNames: [CssClasses.PaginationEllipsis],
        textContent: PaginationButtons.Ellipsis,
      })
    );
  }
}
