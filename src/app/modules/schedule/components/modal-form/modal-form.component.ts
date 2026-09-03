import { Component, inject } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { HelpersService } from '@core/services/helpers.service';
import { noSpaceValidator } from '@core/validators/noSpaceValidator';
import { ScheduleService } from '../../services/schedule.service';
import { Schedule } from '@core/models/schedule';
import { MESSAGES } from '@core/constants/messages';
import { LIMITS } from '@core/constants/limits';
import { regex } from '@core/constants/regexs';
import { LABELS } from '@core/constants/labels';
import { GenericTableComponent } from '@shared/components/generic-table/generic-table.component';
import { TypeSubmitEnum } from '@core/enums/type-submit';
import { MessageRequiredFieldComponent } from '../../../../shared/components/message-required-field/message-required-field.component';
import { ScheduleModule } from '../../schedule.module';

@Component({
    selector: 'app-modal-form',
    templateUrl: './modal-form.component.html',
    imports: [MessageRequiredFieldComponent, ScheduleModule]
})
export class ModalFormComponent {

  private formBuilder = inject(FormBuilder);
  private helpersService = inject(HelpersService);
  private scheduleService = inject(ScheduleService);

  public readonly labels = LABELS;
  public readonly messages = MESSAGES;
  private scheduleId: number = 0;
  public openModal: boolean = false;
  public tittleForm: string = "";
  private tableComponent = this.scheduleService.eventTableComponent;

  public formSchedule: FormGroup = this.formBuilder.group({
    id: [],
    name: [, [Validators.required, Validators.minLength(LIMITS.minLengthFive), Validators.pattern(regex.fieldName), noSpaceValidator]]
  });

  ngOnInit() {
    this.scheduleService.eventFormComponent.set(this);
  };


  public hideModal() {
    this.openModal = false;
  };

  public openCreate(){
    this.reset();
    this.tittleForm = "Nuevo horario";
    this.openModal = true;
  };

  public openEdit(id: number ){
    this.reset();
    this.tittleForm="Editar horario";
    this.scheduleService.getById(id).subscribe({
      next: (res) => {
        this.scheduleId = res.id!;
        this.formSchedule.patchValue(res);
        this.openModal = true;
      }
    })
  };

  public saveSchedule() {
    if (this.formSchedule.valid ) {
      this.scheduleId > 0? this.submit(TypeSubmitEnum.UPDATE): this.submit(TypeSubmitEnum.CREATE);
    }
  };

  private reset(): void {
    this.formSchedule.reset();
    this.scheduleId = 0;
  };

  private submit(typeSubmitEnum: TypeSubmitEnum) {
    const data: Schedule = {
      ...this.formSchedule.value,
    };
    const service = typeSubmitEnum == TypeSubmitEnum.CREATE 
      ? this.scheduleService.create(data) 
      : this.scheduleService.update(this.scheduleId, data);
    service.subscribe({
      next: () => {
        const message = typeSubmitEnum == TypeSubmitEnum.CREATE 
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
