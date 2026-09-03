import { Component, inject, signal } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { HelpersService } from 'src/app/core/services/helpers.service';
import { SupervisorService } from 'src/app/modules/supervisor/services/supervisor.service';
import { noSpaceValidator } from '@core/validators/noSpaceValidator';
import { MESSAGES } from '@core/constants/messages';
import { LIMITS } from '@core/constants/limits';
import { regex } from '@core/constants/regexs';
import { LABELS } from '@core/constants/labels';
import { Severity } from '@core/enums/severity';
import { TypeSubmitEnum } from '@core/enums/type-submit';
import { Supervisor } from '@core/models/Supervisor';
import { MessageRequiredFieldComponent } from '../../../../shared/components/message-required-field/message-required-field.component';
import { SelectGenericUsersComponent } from '../../../../shared/components/select-generic-users/select-generic-users.component';
import { PrimeModules } from '@shared/prime-components/prime-components.module';

@Component({
    selector: 'app-form',
    templateUrl: './form.component.html',
    imports: [ReactiveFormsModule, MessageRequiredFieldComponent, SelectGenericUsersComponent, PrimeModules]
})
export class FormComponent {

  
  private formBuilder = inject(FormBuilder);
  private helpersService = inject(HelpersService);
  private supervisorService = inject(SupervisorService);
  
  public readonly messages = MESSAGES;
  public readonly labels = LABELS;
  public openModal = false;
  public titleForm = "";
  public supervisorEdited = signal<Supervisor>(null);
  private isEdit = false;
  private tableComponent = this.supervisorService.eventTableComponent;

  public formSupervisor: FormGroup = this.formBuilder.group({
    id: [],
    name: [, [Validators.required, Validators.minLength(LIMITS.minLengthFive), Validators.pattern(regex.fieldName), noSpaceValidator]],
    supervisorCredentialId: [, Validators.required],
    active: []
  });

  ngOnInit() {
    this.supervisorService.eventFormComponent.set(this);
  };

  public hideModal() {
    this.openModal = false;
    this.reset();
  };

  public openCreate(){
    this.isEdit = false;
    this.reset();
    this.titleForm = this.labels.newRegistration("supervisor");
    this.openModal = true;
  };

  public openEdit(id: number ) {
    this.isEdit = true;
    this.reset();
    this.titleForm = this.labels.editRegistration("supervisor");
    this.supervisorService.getById(id).subscribe({
      next: (res) => {
        this.supervisorEdited.set(res);
        this.formSupervisor.patchValue(res);
        this.openModal = true;
      }
    })
  };

  public setUser(userId: number) {
    this.formSupervisor.patchValue({ supervisorCredentialId: userId })
  }

  public saveSupervisor() {
    if (this.formSupervisor.valid) {
      this.isEdit?
        this.submit(TypeSubmitEnum.UPDATE)
        : this.submit(TypeSubmitEnum.CREATE);
    }
  };

  private reset(): void {
    this.formSupervisor.reset();
    this.formSupervisor.patchValue({ active: true });
    this.supervisorEdited.set(null);
  };

  private submit(type: TypeSubmitEnum) {
    const data: Supervisor = {
      ...this.formSupervisor.value
    };
    const service = type == TypeSubmitEnum.CREATE?
      this.supervisorService.create(data)
      : this.supervisorService.update(this.supervisorEdited().id, data);
    const message: string = type == TypeSubmitEnum.CREATE?
      this.messages.recordCreated
      : this.messages.recordUpdated;
    service.subscribe({
      next: () => {
        this.helpersService.messageNotification(Severity.success, "Correcto", message);
        this.hideModal();
        this.reset();
      }, complete: () => {
        this.tableComponent().reload();
      }
    })
  }
}
