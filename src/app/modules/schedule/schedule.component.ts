import { Component, inject, OnInit, signal } from '@angular/core';

import { ScheduleService } from './services/schedule.service';
import { Schedule } from '@core/models/schedule';
import { ScheduleModule } from './schedule.module';
import { ToolbarComponent } from '@shared/components/toolbar/toolbar.component';
import { ModalDeleteComponent } from '@shared/components/modal-delete/modal-delete.component';
import { ScheduleDetailComponent } from '../schedule-detail/schedule-detail.component';
import { GenericTableComponent } from '@shared/components/generic-table/generic-table.component';
import { TableColumn } from '@core/interfaces/table.interface';
import { TableColumnDefinitions } from '@core/utils/table-column-definitions';
import { ModalFormComponent } from './components/modal-form/modal-form.component';

@Component({
    selector: 'app-schedule',
    imports: [ScheduleModule, ToolbarComponent, ModalDeleteComponent, ScheduleDetailComponent, GenericTableComponent, ModalFormComponent],
    templateUrl: './schedule.component.html',
    styles: []
})
export class ScheduleComponent implements OnInit {

  public scheduleService = inject(ScheduleService);
  
  public titleTable = "Lista de horarios";
  public scheduleSelected = signal<Schedule | null>(null);;
  public schedules = signal<Schedule[]>([]);
  public tableColumnScheduleDefinitions: TableColumn<Schedule>[] = TableColumnDefinitions.getSchedulesColumnsDefinition();

  ngOnInit(): void {
    this.getSchedules();
  }

  public setSchedule( schedule: Schedule  ) {
    this.scheduleSelected.set(schedule);
  }

  public getSchedules(): void {
    this.scheduleService.getAll().subscribe({
      next: (res) => {
        this.schedules.set(res);
      }
    })
  }

  public onTableSelfEmision(table: GenericTableComponent<Schedule>) {
    this.scheduleService.eventTableComponent.set(table);
  }

}
