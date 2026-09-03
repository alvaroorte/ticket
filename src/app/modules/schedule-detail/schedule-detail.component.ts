import { Component, effect, inject, input, signal } from '@angular/core';
import { ScheduleDetailModule } from './schedule-detail.module';
import { ToolbarComponent } from '@shared/components/toolbar/toolbar.component';
import { ModalDeleteComponent } from '@shared/components/modal-delete/modal-delete.component';
import { ScheduleDetailService } from './services/schedule-detail.service';
import { GenericTableComponent } from '@shared/components/generic-table/generic-table.component';
import { PrimeTableProps } from '@core/utils/prime-table-props';
import { COMMON } from '@core/constants/common';
import { TableColumn } from '@core/interfaces/table.interface';
import { TableColumnDefinitions } from '@core/utils/table-column-definitions';
import { ScheduleDetail } from '@core/interfaces/schedule-detail.interface';
import { ModalFormformScheduleDetailComponent } from './components/modal-form/modal-form-schedule-detail.component';
import { ModalGanttScheduleComponent } from './components/modal-gantt-schedule/modal-gantt-schedule.component';

@Component({
    selector: 'app-schedule-detail',
    imports: [ScheduleDetailModule, ToolbarComponent, ModalDeleteComponent, GenericTableComponent, ModalFormformScheduleDetailComponent, ModalGanttScheduleComponent],
    templateUrl: './schedule-detail.component.html'
})
export class ScheduleDetailComponent {

  public scheduleId = input.required<number>();

  public scheduleDetailService = inject(ScheduleDetailService);

  public titleTable = 'Listado de horarios de trabajo';
  public scheduleDetailSelected = signal<ScheduleDetail | null>(null);
  public scheduleDetails = signal<ScheduleDetail[]>([]);
  public tableColumnScheduleDetailDefinitions: TableColumn<ScheduleDetail>[] = TableColumnDefinitions.getScheduleDetailsColumnsDefinition();
  public tableProps: PrimeTableProps = new PrimeTableProps({ rows: COMMON.minimumRows });
  
  public openModalGanttSchedule() {
    this.scheduleDetailService.eventOpenModalGanttSchedule.emit();
  }

  constructor() {
    effect(() => {
      if (this.scheduleId()) {
        this.setScheduleDetail(null)
        this.getBySchedule();
      }
    })
  }

  public setScheduleDetail(scheduleDetail: ScheduleDetail): void {
    this.scheduleDetailSelected.set(scheduleDetail);
  }

  public getBySchedule(): void {
    this.scheduleDetailService.getBySchedule(this.scheduleId()).subscribe({
      next: (res) => {
        this.scheduleDetails.set(res);
      }
    });
  }

  public onTableSelfEmision(table: GenericTableComponent<ScheduleDetail>): void {
    this.scheduleDetailService.eventTableComponent.set(table);
  }
}
