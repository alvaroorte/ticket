import { Component, inject } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { HelpersService } from '@core/services/helpers.service';
import { noSpaceValidator } from '@core/validators/noSpaceValidator';
import { IncidentTitleService } from '../../services/incident-title.service';
import { MESSAGES } from '@core/constants/messages';
import { LIMITS } from '@core/constants/limits';
import { regex } from '@core/constants/regexs';
import { LABELS } from '@core/constants/labels';
import { IncidentTitle } from '@core/interfaces/incident-title';
import { TypeSubmitEnum } from '@core/enums/type-submit';
import { Severity } from '@core/enums/severity';
import { MessageRequiredFieldComponent } from '../../../../shared/components/message-required-field/message-required-field.component';
import { incidentTitleModule } from '../../incident-title.module';

@Component({
    selector: 'app-modal-form',
    templateUrl: './modal-form.component.html',
    imports: [MessageRequiredFieldComponent, incidentTitleModule]
})
export class ModalFormComponent {

  private formBuilder = inject(FormBuilder);
  private helpersService = inject(HelpersService);
  private incidentTitleService = inject(IncidentTitleService);

  public readonly labels = LABELS;
  public readonly messages = MESSAGES;
  private incidentTitleId = 0;
  public openModal = false;
  public titleForm = "";
  private tableComponent = this.incidentTitleService.eventTableComponent;

  public formIncidentTitle: FormGroup = this.formBuilder.group({
    id: [],
    title: [, [Validators.required, Validators.minLength(LIMITS.minLengthThree), Validators.pattern(regex.fieldName), noSpaceValidator]]
  });

  ngOnInit() {
    this.incidentTitleService.eventFormComponent.set(this);
  };
  
  public hideModal() {
    this.openModal = false;
  };
  
  public openCreate(){
    this.reset();
    this.titleForm = "Nuevo título de incidente";
    this.openModal = true;
  };

  public openEdit(id: number ){
    this.reset();
    this.titleForm="Editar título de incidente";
    this.incidentTitleService.getById(id).subscribe({
      next: (res) => {
        this.incidentTitleId = res.id;
        this.formIncidentTitle.patchValue(res);
        this.openModal = true;
      }
    })
  };

  public saveIncidentTitle() {
    if (this.formIncidentTitle.valid ) {
      this.incidentTitleId > 0 ? this.submit(TypeSubmitEnum.UPDATE) : this.submit(TypeSubmitEnum.CREATE);
    }
  };

  private reset(): void {
    this.formIncidentTitle.reset();
    this.incidentTitleId = 0;
  };

  private submit(type: TypeSubmitEnum) {
    const data: IncidentTitle = {
      ...this.formIncidentTitle.value,
    };
    const service = type == TypeSubmitEnum.CREATE
      ? this.incidentTitleService.create(data)
      : this.incidentTitleService.update(this.incidentTitleId, data);
    service.subscribe({
      next: () => {
        const message = type == TypeSubmitEnum.CREATE
          ? MESSAGES.recordCreated
          : MESSAGES.recordUpdated;
        this.helpersService.messageNotification(Severity.success, "Correcto", message);
        this.hideModal();
        this.reset();
      }, complete: () => {
        this.tableComponent().reload();
      }
    });
  }
}
