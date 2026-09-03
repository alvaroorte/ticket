import { Component, inject, input, Input, OnInit } from '@angular/core';
import { ScheduleDetail } from '@core/interfaces/schedule-detail.interface';
import { HelpersService } from '@core/services/helpers.service';
import { ScheduleDetailService } from '../../services/schedule-detail.service';
import { Bind } from 'primeng/bind';
import { Dialog } from 'primeng/dialog';
import { PrimeTemplate } from 'primeng/api';
import { NgStyle } from '@angular/common';
import { GanttForHoursOfWeekComponent } from '../../../../shared/components/gantt-for-hours-of-week/gantt-for-hours-of-week.component';
import { ButtonDirective } from 'primeng/button';

@Component({
    selector: 'app-modal-gantt-schedule',
    templateUrl: './modal-gantt-schedule.component.html',
    imports: [Bind, Dialog, PrimeTemplate, NgStyle, GanttForHoursOfWeekComponent, ButtonDirective]
})
export class ModalGanttScheduleComponent implements OnInit {

  public scheduleId = input.required<number>();

  public openModal: boolean = false;
  public tittleForm: string = "Horarios";
  public scheduleDetails: ScheduleDetail[] = [];

  private helpersService = inject(HelpersService);
  private scheduleDetailService = inject(ScheduleDetailService);

  ngOnInit(): void {
    this.scheduleDetailService.eventOpenModalGanttSchedule.subscribe(() => {
      this.getScheduleDetail();
    });
  }
  
  public hideModal() {
    this.openModal = false;
  };

  private getScheduleDetail() {
    this.scheduleDetailService.getBySchedule(this.scheduleId()).subscribe({
      next: (res) => {
        this.scheduleDetails = res;
        this.openModal = true;
      }
    })
  };
}
