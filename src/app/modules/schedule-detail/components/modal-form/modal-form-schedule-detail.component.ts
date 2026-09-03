import { Component, inject, input } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { HelpersService } from '@core/services/helpers.service';
import { ScheduleDetailService } from '../../services/schedule-detail.service';
import { ScheduleDetail } from '@core/interfaces/schedule-detail.interface';
import { DatePipe } from '@angular/common';
import { MESSAGES } from '@core/constants/messages';
import { FORMAT_TIME } from '@core/constants/format-date-time';
import { LABELS } from '@core/constants/labels';
import { TypeSubmitEnum } from '@core/enums/type-submit';
import { MessageRequiredFieldComponent } from '../../../../shared/components/message-required-field/message-required-field.component';
import { ScheduleDetailModule } from '../../schedule-detail.module';

@Component({
    selector: 'app-modal-form-schedule-detail',
    templateUrl: './modal-form-schedule-detail.component.html',
    imports: [MessageRequiredFieldComponent, ScheduleDetailModule]
})
export class ModalFormformScheduleDetailComponent {

  public scheduleId = input.required<number>();

  private formBuilder = inject(FormBuilder);
  private helpersService = inject(HelpersService);
  private scheduleDetailService = inject(ScheduleDetailService);
  private datePipe = inject(DatePipe);

  public readonly labels = LABELS;
  public readonly messages = MESSAGES;
  public daysOfWeek: string[] = [];
  private scheduleDetailId = 0;
  public openModal = false;
  public titleForm = "";
  private tableComponent = this.scheduleDetailService.eventTableComponent;

  public formScheduleDetail: FormGroup = this.formBuilder.group({
    id: [],
    dayOfWeek: ['', Validators.required],
    startHour: [, Validators.required],
    endHour: [, Validators.required],
    breakStartHour: [, Validators.required],
    breakEndHour: [, Validators.required],
    scheduleId: ['', Validators.required],
  });

  ngOnInit() {
    this.scheduleDetailService.eventFormComponent.set(this);
    this.getDaysOfWeek();
  };


  private getDaysOfWeek() {
    this.scheduleDetailService.getDaysOfWeek().subscribe({
      next: (res) => {
        this.daysOfWeek = res;
      }
    })
  };
  
  public hideModal() {
    this.openModal = false;
  };

  public openCreate(){
    this.reset();
    this.titleForm = this.labels.newRegistration("horario de trabajo");
    this.formScheduleDetail.patchValue({ scheduleId: this.scheduleId() });
    this.openModal = true;
  };

  public openEdit(id: number ){
    this.reset();
    this.titleForm = this.labels.editRegistration("horario de trabajo");
    this.scheduleDetailService.getById(id).subscribe({
      next: (res) => {
        this.scheduleDetailId = res.id!;
        this.formScheduleDetail.patchValue(res);
        this.openModal = true;
      }
    })
  };

  public save() {
    if (this.formScheduleDetail.valid ) {
      this.scheduleDetailId > 0
        ? this.submit(TypeSubmitEnum.UPDATE)
        : this.submit(TypeSubmitEnum.CREATE);
    }
  };

  private reset(): void {
    this.formScheduleDetail.reset();
    this.scheduleDetailId = 0;
  };

  private getHourValue(formControlName: string): string {
    return typeof this.formScheduleDetail.get(formControlName).value == 'string'
      ? this.formScheduleDetail.get(formControlName).value
      : this.datePipe.transform(this.formScheduleDetail.get(formControlName).value, FORMAT_TIME)
  }

  private submit(typeSubmitEnum: TypeSubmitEnum) {
    const data: ScheduleDetail = {
      ...this.formScheduleDetail.value,
      startHour: this.getHourValue('startHour'),
      endHour: this.getHourValue('endHour'),
      breakStartHour: this.getHourValue('breakStartHour'),
      breakEndHour: this.getHourValue('breakEndHour')
    };
    const service = typeSubmitEnum === TypeSubmitEnum.CREATE
      ? this.scheduleDetailService.create(data)
      : this.scheduleDetailService.update(this.scheduleDetailId, data)
    service.subscribe({
      next: () => {
        const message = typeSubmitEnum === TypeSubmitEnum.CREATE
          ? MESSAGES.recordCreated
          : MESSAGES.recordUpdated;
        this.helpersService.messageNotification("success", "Correcto", message, 3000);
        this.hideModal();
        this.reset();
      }, complete: () => {
        this.tableComponent().reload();
      }
    })
  };

}
