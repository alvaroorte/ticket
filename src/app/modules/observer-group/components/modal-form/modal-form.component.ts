import { Component, inject, signal } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { HelpersService } from '@core/services/helpers.service';
import { noSpaceValidator } from '@core/validators/noSpaceValidator';
import { MESSAGES } from '@core/constants/messages';
import { LIMITS } from '@core/constants/limits';
import { regex } from '@core/constants/regexs';
import { LABELS } from '@core/constants/labels';
import { TypeSubmitEnum } from '@core/enums/type-submit';
import { Severity } from '@core/enums/severity';
import { ObserverGroupService } from '../../services/observer-group.service';
import { EnterpriseService } from '@enterprise/services/enterprises.service';
import { Enterprise } from '@core/models/Enterprise';
import { ObserverGroup, ObserverGroupSend } from '@core/interfaces/observer-group.inteface.';
import { MultiSelectGenericUsersComponent } from '../../../../shared/components/multi-select-generic-users/multi-select-generic-users.component';
import { ObserverGroupModule } from '../../observer-group.module';
import { MessageRequiredFieldComponent } from '@shared/components/message-required-field/message-required-field.component';

@Component({
    selector: 'app-modal-form',
    templateUrl: './modal-form.component.html',
    imports: [MultiSelectGenericUsersComponent, ObserverGroupModule, MessageRequiredFieldComponent]
})
export class ModalFormComponent {

  private formBuilder = inject(FormBuilder);
  private helpersService = inject(HelpersService);
  private observerGroupService = inject(ObserverGroupService);
  private enterpriseService = inject(EnterpriseService);

  public readonly labels = LABELS;
  public readonly messages = MESSAGES;
  public openModal = false;
  public titleForm = "";
  public observerGroupEdited = signal<ObserverGroup | null>(null);
  private tableComponent = this.observerGroupService.eventTableComponent;
  private isEdit = false;

  public enterprises: Enterprise[] = [];

  public formObserverGroup: FormGroup = this.formBuilder.group({
    id: [],
    name: [, [Validators.required, Validators.minLength(LIMITS.minLengthFive), Validators.pattern(regex.fieldName), noSpaceValidator]],
    enterpriseId: [, [Validators.required]],
    credentialId: [[], Validators.required],
    active: [ true, [Validators.required]],
  });

  ngOnInit() {
    this.observerGroupService.eventFormComponent.set(this);
  };

  private getEnterprise() {
    this.enterpriseService.getAll().subscribe({
      next: (res) => {
        this.enterprises = res;
      }
    })
  };

  public hideModal() {
    this.openModal = false;
  };
 
  public openCreate() {
    this.isEdit = false;
    this.getEnterprise();
    this.reset();
    this.titleForm = "Nuevo grupo de observadores";
    this.openModal = true;
  };

  public openEdit(id: number ) {
    this.isEdit = true;
    this.getEnterprise();
    this.reset();
    this.titleForm="Editar grupo de observadores";
    this.observerGroupService.getById(id).subscribe({
      next: (res) => {
        this.observerGroupEdited.set(res);
        this.formObserverGroup.patchValue({
          ...res,
        });
        this.openModal = true;
      }
    })
  };

  public setCredentialsId(ids: number[]) {
    this.formObserverGroup.patchValue({ credentialId: ids })
  }

  public save() {
    if (this.formObserverGroup.valid ) {
      this.isEdit
        ? this.submit(TypeSubmitEnum.UPDATE)
        : this.submit(TypeSubmitEnum.CREATE);
    }
  };

  private reset(): void {
    this.formObserverGroup.reset();
    this.formObserverGroup.patchValue({
      active: true
    });
    this.observerGroupEdited.set(null);
  };

  private submit(type: TypeSubmitEnum) {
    const data: ObserverGroupSend = {
      ...this.formObserverGroup.value,
    };
    const service = type == TypeSubmitEnum.CREATE
      ? this.observerGroupService.create(data)
      : this.observerGroupService.update(this.observerGroupEdited().id, data)
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
    })
  };
  
}
