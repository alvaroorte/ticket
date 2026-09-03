import { Component, inject, OnInit, signal } from '@angular/core';
import { ToolbarComponent } from '@shared/components/toolbar/toolbar.component';
import { ModalDeleteComponent } from '@shared/components/modal-delete/modal-delete.component';
import { HolidayModule } from './holiday.module';
import { HolidayService } from './services/holiday.service';
import { Holiday } from '@core/models/holiday';
import { GenericTableComponent } from '@shared/components/generic-table/generic-table.component';
import { TableColumnDefinitions } from '@core/utils/table-column-definitions';
import { TableColumn } from '@core/interfaces/table.interface';
import { ModalFormComponent } from './components/modal-form/modal-form.component';

@Component({
    selector: 'app-holiday',
    imports: [HolidayModule, ToolbarComponent, ModalDeleteComponent, GenericTableComponent, ModalFormComponent],
    templateUrl: './holiday.component.html'
})
export class HolidayComponent implements OnInit {

  public holidayService = inject(HolidayService);

  public holidays = signal<Holiday[]>([]);
  public holidaySelected = signal<Holiday | null>(null);
  public tableColumnHolidayDefinitions: TableColumn<Holiday>[] = TableColumnDefinitions.getHolidaysColumnsDefinition();
  public titleTable = "Lista de feriados";

  ngOnInit(): void {
    this.getHolidays();
  }

  public setHoliday( holiday: Holiday  ) {
    this.holidaySelected.set(holiday);
  }

  public getHolidays(): void {
    this.holidayService.getAll().subscribe({
      next: (res) => {
        this.holidays.set(res);
      }
    })
  }

  public onTableSelfEmision(table: GenericTableComponent<Holiday>) {
    this.holidayService.eventTableComponent.set(table);
  }
}
