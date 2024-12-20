/**
 * @license
 * Copyright (C) Gnucoop soc. coop.
 *
 * This file is part of the Advanced JSON forms (ajf).
 *
 * Advanced JSON forms (ajf) is free software: you can redistribute it and/or
 * modify it under the terms of the GNU Affero General Public License as
 * published by the Free Software Foundation, either version 3 of the License,
 * or (at your option) any later version.
 *
 * Advanced JSON forms (ajf) is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. See the GNU Affero
 * General Public License for more details.
 *
 * You should have received a copy of the GNU Affero General Public License
 * along with Advanced JSON forms (ajf).
 * If not, see http://www.gnu.org/licenses/.
 *
 */

import {
  AjfBaseWidgetComponent,
  AjfColumnWidgetInstance,
  AjfDialogWidgetInstance,
  AjfLayoutWidgetInstance,
  AjfPaginatedListWidgetInstance,
  AjfPaginatedTableWidgetInstance,
  AjfReportWidget as CoreComponent,
  AjfWidgetComponentsMap,
  AjfWidgetInstance,
  AjfWidgetService as CoreService,
  AjfWidgetType as wt,
} from '@ajf/core/reports';
import {AjfTableCell} from '@ajf/core/table';
import {
  AfterContentChecked,
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  ElementRef,
  Injectable,
  OnChanges,
  OnInit,
  Renderer2,
  SimpleChanges,
  TemplateRef,
  ViewChild,
  ViewEncapsulation,
} from '@angular/core';
import {MatDialog} from '@angular/material/dialog';
import {Sort} from '@angular/material/sort';
import {BehaviorSubject, Observable} from 'rxjs';

import {AjfChartWidgetComponent} from './chart-widget';
import {AjfFormulaWidgetComponent} from './formula-widget';
import {AjfGraphWidgetComponent} from './graph-widget';
import {AjfHeatMapWidgetComponent} from './heat-map-widget';
import {AjfImageContainerWidgetComponent} from './image-container-widget';
import {AjfImageWidgetComponent} from './image-widget';
import {AjfMapWidgetComponent} from './map-widget';
import {AjfPageBreakWidgetComponent} from './page-break-widget';
import {AjfTableWidgetComponent} from './table-widget';
import {AjfTextWidgetComponent} from './text-widget';

const defaultWidgetsFactory = (): AjfWidgetComponentsMap => {
  const defaultWidgets: AjfWidgetComponentsMap = {};
  defaultWidgets[wt.Layout] = {component: AjfLayoutWidgetComponent};
  defaultWidgets[wt.PageBreak] = {component: AjfPageBreakWidgetComponent};
  defaultWidgets[wt.Image] = {component: AjfImageWidgetComponent};
  defaultWidgets[wt.Text] = {component: AjfTextWidgetComponent};
  defaultWidgets[wt.Chart] = {component: AjfChartWidgetComponent};
  defaultWidgets[wt.Table] = {component: AjfTableWidgetComponent};
  defaultWidgets[wt.DynamicTable] = {component: AjfTableWidgetComponent};
  defaultWidgets[wt.Map] = {component: AjfMapWidgetComponent};
  defaultWidgets[wt.Column] = {component: AjfColumnWidgetComponent};
  defaultWidgets[wt.Formula] = {component: AjfFormulaWidgetComponent};
  defaultWidgets[wt.ImageContainer] = {component: AjfImageContainerWidgetComponent};
  defaultWidgets[wt.Graph] = {component: AjfGraphWidgetComponent};
  defaultWidgets[wt.PaginatedList] = {component: AjfPaginatedListWidgetComponent};
  defaultWidgets[wt.PaginatedTable] = {component: AjfPaginatedTableWidgetComponent};

  defaultWidgets[wt.Dialog] = {component: AjfDialogWidgetComponent};
  defaultWidgets[wt.HeatMap] = {component: AjfHeatMapWidgetComponent};
  return defaultWidgets;
};

@Injectable({providedIn: 'root'})
export class AjfWidgetService extends CoreService {
  constructor() {
    super(defaultWidgetsFactory());
  }
}

@Component({
  selector: 'ajf-widget',
  templateUrl: 'widget.html',
  styleUrls: ['widget.scss'],
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AjfReportWidget extends CoreComponent {
  readonly widgetsMap: AjfWidgetComponentsMap;

  constructor(renderer: Renderer2, widgetService: AjfWidgetService) {
    super(renderer);
    this.widgetsMap = widgetService.componentsMap;
  }
}

@Component({
  templateUrl: 'column-widget.html',
  styleUrls: ['column-widget.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
})
export class AjfColumnWidgetComponent extends AjfBaseWidgetComponent<AjfColumnWidgetInstance> {
  constructor(cdr: ChangeDetectorRef, el: ElementRef) {
    super(cdr, el);
  }
}

@Component({
  templateUrl: 'layout-widget.html',
  styleUrls: ['layout-widget.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
})
export class AjfLayoutWidgetComponent
  extends AjfBaseWidgetComponent<AjfLayoutWidgetInstance>
  implements AfterContentChecked
{
  private _allcolumnsRendered$: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);
  readonly allcolumnsRendered$: Observable<boolean> = this
    ._allcolumnsRendered$ as Observable<boolean>;

  constructor(cdr: ChangeDetectorRef, el: ElementRef) {
    super(cdr, el);
  }
  ngAfterContentChecked(): void {
    this._allcolumnsRendered$.next(true);
  }
}

@Component({
  templateUrl: 'dialog-widget.html',
  styleUrls: ['dialog-widget.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
})
export class AjfDialogWidgetComponent extends AjfBaseWidgetComponent<AjfDialogWidgetInstance> {
  @ViewChild('dialogContent', {read: TemplateRef}) dialogContent!: TemplateRef<HTMLElement>;

  constructor(cdr: ChangeDetectorRef, el: ElementRef, private _dialog: MatDialog) {
    super(cdr, el);
  }

  openDialog(): void {
    this._dialog.open(this.dialogContent);
  }
}

@Component({
  templateUrl: 'paginated-list-widget.html',
  styleUrls: ['paginated-list-widget.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
})
export class AjfPaginatedListWidgetComponent
  extends AjfBaseWidgetComponent<AjfPaginatedListWidgetInstance>
  implements OnChanges, OnInit
{
  get currentPage(): number {
    return this._currentPage;
  }
  private _currentPage = 0;

  get pages(): number {
    return this._pages;
  }
  private _pages = 0;

  get currentContent(): AjfWidgetInstance[] {
    return this._currentContent;
  }
  private _currentContent: AjfWidgetInstance[] = [];

  get canGoForward(): boolean {
    return this._canGoForward;
  }
  private _canGoForward = false;

  get canGoBackward(): boolean {
    return this._canGoBackward;
  }
  private _canGoBackward = false;

  constructor(cdr: ChangeDetectorRef, el: ElementRef) {
    super(cdr, el);
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['instance']) {
      this._updateCurrentContent();
    }
  }

  ngOnInit(): void {
    this._updateCurrentContent();
  }

  goToPage(direction: 'next' | 'previous'): void {
    const diff = direction === 'next' ? 1 : -1;
    const newPage = this._currentPage + diff;
    if (newPage <= 0 || newPage > this._pages) {
      return;
    }
    this._currentPage = newPage;
    this._canGoForward = newPage < this._pages;
    this._canGoBackward = newPage > 1;
    this._fillCurrentContent();
  }

  private _updateCurrentContent(): void {
    this._canGoBackward = false;
    if (this.instance == null || this.instance.content.length === 0) {
      this._currentPage = 0;
      this._pages = 0;
    } else {
      this._currentPage = 1;
      const {content} = this.instance;
      const {pageSize} = this.instance.widget;
      this._pages = Math.ceil(content.length / pageSize);
      this._canGoForward = this._pages > 1;
    }
    this._fillCurrentContent();
  }

  private _fillCurrentContent(): void {
    if (this.instance == null || this.instance.content.length === 0) {
      this._currentContent = [];
      return;
    }
    const {content} = this.instance;
    const {pageSize} = this.instance.widget;
    const start = (this._currentPage - 1) * pageSize;
    this._currentContent = content.slice(start, start + pageSize);
    this._cdr.markForCheck();
  }
}

@Component({
  templateUrl: 'paginated-table-widget.html',
  styleUrls: ['paginated-table-widget.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
})
export class AjfPaginatedTableWidgetComponent
  extends AjfBaseWidgetComponent<AjfPaginatedTableWidgetInstance>
  implements OnChanges, OnInit
{
  readonly paginatorConfig = {
    pageSize: 10,
    pageSizeOptions: [5, 10, 15, 20, 25, 30, 50, 100, 500],
  };

  get currentPage(): number {
    return this._currentPage;
  }
  private _currentPage = 0;

  get pages(): number {
    return this._pages;
  }
  private _pages = 0;

  get orderBy(): number {
    return this._orderBy;
  }
  private _orderBy = 0;

  get currentContent(): AjfTableCell[][] {
    return this._currentContent;
  }
  private _currentContent: AjfTableCell[][] = [];

  /**
   * full data table
   */
  private _allDataContent: AjfTableCell[][] = [];

  /**
   * full sorted data table
   */
  private _sortedAllDataContent: AjfTableCell[][] = [];

  get headerContent(): AjfTableCell[] {
    return this._headerContent;
  }
  private _headerContent: AjfTableCell[] = [];

  get canGoForward(): boolean {
    return this._canGoForward;
  }
  private _canGoForward = false;

  get canGoBackward(): boolean {
    return this._canGoBackward;
  }
  private _canGoBackward = false;

  constructor(cdr: ChangeDetectorRef, el: ElementRef) {
    super(cdr, el);
  }

  /**
   * Set initial data for the table on instance changes
   * @param changes
   */
  ngOnChanges(changes: SimpleChanges): void {
    if (changes['instance']) {
      if (
        this.instance != null &&
        this.instance.widget.pageSize &&
        this.instance.widget.pageSize > 0
      ) {
        this.paginatorConfig.pageSize = this.instance.widget.pageSize;
      }
      this._updateCurrentContent();
    }
  }

  ngOnInit(): void {
    if (
      this.instance != null &&
      this.instance.widget.pageSize &&
      this.instance.widget.pageSize > 0
    ) {
      this.paginatorConfig.pageSize = this.instance.widget.pageSize;
    }
    this._updateCurrentContent();
  }

  /**
   * Got to next or previous page
   * @param direction
   * @returns
   */
  goToPage(direction: 'next' | 'previous'): void {
    const diff = direction === 'next' ? 1 : -1;
    const newPage = this._currentPage + diff;
    if (newPage <= 0 || newPage > this._pages) {
      return;
    }
    this._currentPage = newPage;
    this._canGoForward = newPage < this._pages;
    this._canGoBackward = newPage > 1;
    this._fillCurrentContent();
  }

  onPageSizeChange(_pageSize: number) {
    this.paginatorConfig.pageSize = _pageSize;
    this._updateCurrentContent();
  }

  /**
   * Sort all data for the table, not only current page data
   * @param sort
   * @returns
   */
  sortPaginatedData(sort: Sort): void {
    if (this._allDataContent.length > 1) {
      if (!sort.active || sort.direction === '') {
        this._sortedAllDataContent = this._allDataContent.slice();
      } else {
        this._currentPage = 1;
        this._canGoForward = this._currentPage < this._pages;
        this._canGoBackward = false;

        const columnIdx = parseInt(sort.active.slice(-1)) || 0;
        this._sortedAllDataContent = this._allDataContent.slice().sort((a, b) => {
          const isAsc = sort.direction === 'asc';
          return this._compare(a[columnIdx], b[columnIdx], isAsc);
        });
      }
      this._fillCurrentContent();
    }
  }

  exportableContent(): AjfTableCell[][] {
    return [this._headerContent, ...this._sortedAllDataContent];
  }

  private _compare(a: AjfTableCell, b: AjfTableCell, isAsc: boolean) {
    return (a.value < b.value ? -1 : 1) * (isAsc ? 1 : -1);
  }

  /**
   * Set current header and data for the table, starting from page 1
   */
  private _updateCurrentContent(): void {
    this._canGoBackward = false;
    if (this.instance == null || this.instance.data.length === 0) {
      this._currentPage = 0;
      this._pages = 0;
      this._headerContent = [];
      this._currentContent = [];
      this._allDataContent = [];
      this._sortedAllDataContent = [];
    } else {
      this._headerContent = this.instance.data[0];
      this._allDataContent = this.instance.data.slice(1);
      this._sortedAllDataContent = [...this._allDataContent];
      this._currentPage = 1;

      this._pages = Math.ceil(this._allDataContent.length / this.paginatorConfig.pageSize);
      this._canGoForward = this._pages > 1;
    }
    this._fillCurrentContent();
  }

  /**
   * Update current data for the table, using page and sorted data
   */
  private _fillCurrentContent(): void {
    if (this._sortedAllDataContent.length === 0 && this._headerContent.length > 0) {
      this._currentContent = [this._headerContent];
    } else {
      const start = (this._currentPage - 1) * this.paginatorConfig.pageSize;
      this._currentContent = [
        this._headerContent,
        ...this._sortedAllDataContent.slice(start, start + this.paginatorConfig.pageSize),
      ];
    }
    this._cdr.markForCheck();
  }
}
