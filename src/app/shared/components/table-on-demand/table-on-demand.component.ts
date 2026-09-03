import { Component, ElementRef, SimpleChanges, signal, input, viewChild, output } from '@angular/core';
import { Table, TableLazyLoadEvent } from 'primeng/table';
import { MESSAGES } from '@core/constants/messages';
import { LABELS } from '@core/constants/labels';
import { IGenericTable } from '@core/interfaces/generic-table.interface';
import { TOOLTIPS } from '@core/constants/tooltips';
import { FORMAT_DATE, FORMAT_DATE_TIME, FORMAT_TIME } from '@core/constants/format-date-time';
import { TableColumnType } from '@core/enums/table-column-type.enum';
import { TableColumn } from '@core/interfaces/table.interface';
import { PrimeModules } from '@shared/prime-components/prime-components.module';
import { PipesModule } from '@core/pipes/pipes.module';
import { DatePipe, DecimalPipe, NgClass } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpParams } from '@angular/common/http';
import { changeTableLazyloadEventToParams } from '@core/utils/filter';
import { PLACEHOLDERS } from '@core/constants/placeholder';
import { MultiSelectChangeEvent } from 'primeng/multiselect';

@Component({
    selector: 'app-table-on-demand',
    templateUrl: './table-on-demand.component.html',
    styleUrls: ['./table-on-demand.component.scss'],
    imports: [PrimeModules, PipesModule, FormsModule, DatePipe, DecimalPipe, NgClass]
})
export class TableOnDemnadComponent<T> implements IGenericTable {

  readonly table = viewChild.required<Table>('tbOnDemand');
  readonly filter = viewChild.required<ElementRef>('filter');
  readonly dataList = input.required<T[]>();
  readonly columns = input.required<TableColumn<T>[]>();
  readonly totalElements = input.required<number>();
  readonly tooltipSearch = input<string>('');
  readonly showReload = input<boolean>(true);
  readonly showInputSearch = input<boolean>(true);
  readonly showMultiselect = input<boolean>(false);
  readonly showFilterButton = input<boolean>(true);
  readonly rows = input<number>(10);
  readonly titleTable = input<string>('');
  readonly eventRowSelected = output<T>();
  readonly eventloadItems = output<HttpParams>();
  readonly selfEmitter = output<TableOnDemnadComponent<T>>();

  public readonly messages = MESSAGES;
  public readonly labels = LABELS;
  public readonly tooltips = TOOLTIPS;
  public readonly formatDate = FORMAT_DATE;
  public readonly formatDateTime = FORMAT_DATE_TIME;
  public readonly formatTime = FORMAT_TIME;
  public readonly placeholders = PLACEHOLDERS;
  public readonly tableColumnType = TableColumnType;
  public rowSelected: T;
  public firstPage = 0;
  public optionsPage = signal([5, 10, 20]);
  public displayedColumns = signal<TableColumn<T>[]>([]);

  ngOnChanges(changes: SimpleChanges) {
    if (changes['dataList'] && changes['dataList'].currentValue.length >= 0) {
      this.onRowUnselect();
    }
  }

  ngOnInit() {
    this.selfEmitter.emit(this);
    this.displayedColumns.set(this.initializeColumnsStatus());
  }

  private initializeColumnsStatus(): TableColumn<T>[] {
    return this.columns().filter((column) => !column.initiallyHidden
    );
  }

  public clearFilters(table: Table) {
    this.filter().nativeElement.value = '';
    table.clear();
  }

  public reload() {
    this.table()._filter();
  }

  public onGlobalFilter(table: Table, event: Event) {
    table.filterGlobal((event.target as HTMLInputElement).value, 'contains');
  }

  public onToggleColumns(multiSelectChangeEvent: MultiSelectChangeEvent) {
    const selectedColumns: TableColumn<T>[] = multiSelectChangeEvent.value as TableColumn<T>[];
    const toggledItem: TableColumn<T> = multiSelectChangeEvent.itemValue as TableColumn<T>;
    const firstColumn: TableColumn<T> = this.columns()[0];

    this.displayedColumns.set(
      selectedColumns.length
      ? this.getColumnsInConsistentOrder(selectedColumns)
      : [toggledItem ?? firstColumn]
    );
  }

  private updateToggleColumnDisplay(event: MultiSelectChangeEvent) {
    
  }

  private getColumnsInConsistentOrder(selectedColumns: TableColumn<T>[]) {
    return this.columns().filter((col: TableColumn<T>) =>
      selectedColumns.some((selected: TableColumn<T>) => selected.field === col.field)
    );
  }

  public loadItems(event: TableLazyLoadEvent) {
    const tableParams: HttpParams = changeTableLazyloadEventToParams(event);
    this.eventloadItems.emit(tableParams);
  }

  public onRowSelect() {
    this.eventRowSelected.emit(this.rowSelected);
  }

  public onRowUnselect() {
    this.rowSelected = null;
    this.eventRowSelected.emit(this.rowSelected);
  }

}
