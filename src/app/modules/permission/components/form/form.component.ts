import { Component, inject } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { HelpersService } from 'src/app/core/services/helpers.service';
import { Permission } from 'src/app/core/models/Permission';
import { PermissionService } from '../../services/permission.service';
import { SelectItem } from 'primeng/api';
import { HttpMethod } from '@core/enums/http-method.enum';
import { MESSAGES } from '@core/constants/messages';
import { regex } from '@core/constants/regexs';
import { LIMITS } from '@core/constants/limits';
import { LABELS } from '@core/constants/labels';
import { RoleService } from 'src/app/modules/role/services/role.service';
import { Severity } from '@core/enums/severity';
import { TypeSubmitEnum } from '@core/enums/type-submit';
import { MessageRequiredFieldComponent } from '../../../../shared/components/message-required-field/message-required-field.component';
import { PrimeModules } from '@shared/prime-components/prime-components.module';


@Component({
    selector: 'app-form',
    templateUrl: './form.component.html',
    imports: [ReactiveFormsModule, MessageRequiredFieldComponent, PrimeModules]
})
export class FormComponent {

  private formBuilder = inject(FormBuilder);
  private helpersService = inject(HelpersService);
  private permissionService = inject(PermissionService);
  private roleService = inject(RoleService);

  public readonly messages = MESSAGES;
  public readonly labels = LABELS;
  private permission: Permission;
  public openModal = false;
  public titleForm = "";
  private tableComponent = this.permissionService.eventTableComponent;
  public optionsMethod: SelectItem[] = [
    { label: HttpMethod.POST, value: HttpMethod.POST },
    { label: HttpMethod.GET, value: HttpMethod.GET },
    { label: HttpMethod.PUT, value: HttpMethod.PUT },
    { label: HttpMethod.DELETE, value: HttpMethod.DELETE },
  ]

  public formPermission: FormGroup = this.formBuilder.group({
    id: [],
    name: [, [Validators.required, Validators.pattern(regex.fieldName)]],
    code: [, [Validators.required, Validators.minLength(LIMITS.minLengthFive), Validators.pattern(regex.fieldCode)]],
    description: [, [Validators.required]],
    url: [, [Validators.required]],
    urlWithoutIds: [, [Validators.required]],
    httpMethod: [, [Validators.required]]
  });

  ngOnInit() {
    this.permissionService.eventFormComponent.set(this);
  };

  public hideModal() {
    this.openModal = false;
  };

  public openCreate(){
    this.reset();
    this.titleForm = "Nuevo permiso";
    this.openModal = true;

  };

  public openEdit(id: number){
    this.reset();
    this.titleForm = 'Editar permiso';
    this.permissionService.getById(id).subscribe({
      next: (res) => {
        this.permission = res;
        this.formPermission.patchValue(res);
        this.openModal = true;
      }
    })
  };

  public savePermission() {
    if (this.formPermission.valid) {
      this.permission.id
        ? this.submit(TypeSubmitEnum.UPDATE)
        : this.submit(TypeSubmitEnum.CREATE);
    }
  };

  private reset(): void {
    this.formPermission.reset();
    this.permission = new Permission;
  };

  private submit(type: TypeSubmitEnum) {
    const data: Permission = {
      ...this.formPermission.value,
    };
    const service = type == TypeSubmitEnum.CREATE
      ? this.permissionService.create(data)
      : this.permissionService.update(this.permission.id, data)
    service.subscribe({
      next: () => {
        const message: string = type == TypeSubmitEnum.CREATE
          ? this.messages.recordCreated
          : this.messages.recordUpdated;
        this.tableComponent().onRowUnselect();
        this.roleService.eventReloadPermissionByRol.emit();
        this.helpersService.messageNotification(Severity.success, "Correcto", message, 3000);
        this.hideModal();
      }, complete: () => {
        this.tableComponent().reload();
      }
    })
  };
}
