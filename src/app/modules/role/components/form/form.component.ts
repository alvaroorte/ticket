import { Component, inject } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { HelpersService } from 'src/app/core/services/helpers.service';
import { Role } from 'src/app/core/models/Role';
import { RoleService } from '../../services/role.service';
import { MESSAGES } from '@core/constants/messages';
import { regex } from '@core/constants/regexs';
import { LIMITS } from '@core/constants/limits';
import { LABELS } from '@core/constants/labels';
import { MessageRequiredFieldComponent } from '../../../../shared/components/message-required-field/message-required-field.component';
import { PrimeModules } from '@shared/prime-components/prime-components.module';
import { TypeSubmitEnum } from '@core/enums/type-submit';
import { Severity } from '@core/enums/severity';


@Component({
    selector: 'app-form',
    templateUrl: './form.component.html',
    imports: [MessageRequiredFieldComponent, PrimeModules, ReactiveFormsModule]
})
export class FormComponent {

  private formBuilder = inject(FormBuilder);
  private helpersService = inject(HelpersService);
  private roleService = inject(RoleService);

  public readonly labels = LABELS;
  public readonly messages = MESSAGES;
  public roles: Role[];
  public roleId = 0;
  public openModal = false;
  public titleForm = "";
  private tableComponent = this.roleService.eventTableComponent;

  public formRole: FormGroup = this.formBuilder.group({
    id: [],
    name: [, [Validators.required, Validators.pattern(regex.fieldName)]],
    code: [, [Validators.required, Validators.minLength(LIMITS.minLengthThree), Validators.pattern(regex.fieldCode)]],
    description: [, [Validators.required]]
  });

  ngOnInit() {
    this.roleService.eventFormComponent.set(this);
  };

  public hideModal() {
    this.openModal = false;
  };

  public openCreate(){
    this.reset();
    this.titleForm = "Nuevo rol";
    this.openModal = true;

  };

  public openEdit(id: number){
    this.reset();
    this.titleForm = 'Editar rol';
    this.roleService.getById(id).subscribe({
      next: (res) => {
        this.roleId = res.id!;
        this.formRole.patchValue(res)
        this.openModal = true;
      }
    })
  };

  public saveRole() {
    if (this.formRole.valid ) {
      this.roleId > 0
        ? this.submit(TypeSubmitEnum.UPDATE)
        : this.submit(TypeSubmitEnum.CREATE);
    }
  };

  private reset(): void {
    this.formRole.reset();
    this.roleId = 0;
  };

  private submit(type: TypeSubmitEnum) {
    const data: Role = {
      ...this.formRole.value,
    };
    const service = type == TypeSubmitEnum.CREATE
      ? this.roleService.create(data)
      : this.roleService.update(this.roleId, data)
    service.subscribe({
      next: () => {
        const message = type == TypeSubmitEnum.CREATE
          ? MESSAGES.recordCreated
          : MESSAGES.recordUpdated;
        this.helpersService.messageNotification(Severity.success, LABELS.ok, message);
        this.hideModal();
        this.reset();
      }, complete: () => {
        this.tableComponent().reload();
      }
    })
  };

}
