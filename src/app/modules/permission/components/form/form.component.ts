import { Component, inject } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { HelpersService } from 'src/app/core/services/helpers.service';
import { TableComponent } from '../table/table.component';
import { iconsPrime } from 'src/app/shared/icons/icons-pime';
import { Icon } from 'src/app/core/models/Icon';
import { Permission } from 'src/app/core/models/Permission';
import { limits, regex, messages } from '@core/constants/constants';
import { PermissionService } from '../../services/permission.service';
import { SelectItem } from 'primeng/api';
import { HttpMethod } from '@core/enums/http-method.enum';


@Component({
  selector: 'app-form',
  templateUrl: './form.component.html'
})
export class FormComponent {

  private formBuilder = inject(FormBuilder);
  private helpersService = inject(HelpersService);
  private permissionService = inject(PermissionService);

  messages = messages;
  iconsPrime: Icon[] = iconsPrime;
  selectedIcon: Icon | null = null;
  permissions!: Permission[];
  permission!: Permission;
  folder!: string;
  openModal: boolean = false;
  tittleForm: string = "";
  tableComponent!: TableComponent;
  isLoading = false;
  optionsMethod: SelectItem[] = [
    { label: HttpMethod.POST, value: HttpMethod.POST },
    { label: HttpMethod.GET, value: HttpMethod.GET },
    { label: HttpMethod.PUT, value: HttpMethod.PUT },
    { label: HttpMethod.DELETE, value: HttpMethod.DELETE },
  ]

  public formPermission: FormGroup = this.formBuilder.group({
    id: [],
    name: [, [Validators.required, Validators.pattern(regex.fieldName)]],
    code: [, [Validators.required, Validators.minLength(limits.minLength), Validators.pattern(regex.fieldCode)]],
    description: [, [Validators.required]],
    url: [, [Validators.required]],
    httpMethod: [, [Validators.required]]
  });

  ngOnInit() {
    this.permissionService.eventFormComponent.emit(this);
    this.permissionService.eventTableComponent.subscribe((tableComponent) => {
      this.tableComponent = tableComponent;
    });
  };

  hideModal() {
    this.openModal = false;
    this.isLoading = false;
  };

  openCreate(){
    this.reset();
    this.tittleForm = "Nuevo permiso";
    this.openModal = true;

  };

  openEdit(id: number){
    this.reset();
    this.tittleForm = 'Editar permiso';
    this.permissionService.getById(id).subscribe({
      next: (res) => {
        this.permission = res;
        this.openModal=true;
      },
      error: (err) => {
        console.log(err);
        this.helpersService.messageNotification("error", 'Error', err.message, 3000);
      }
    })
  };

  savePermission() {
    this.isLoading = true;
    if (this.formPermission.valid) {
      if(this.permission.id){
        this.submitUpdate(this.permission.id);
      } else{
        this.submitCreate();
      }
    }
  };

  reset(): void {
    this.formPermission.reset();
    this.permission = new Permission;
  };

  submitCreate() {
    const data: Permission = {
      ...this.formPermission.value,
    };
    this.permissionService.create(data).subscribe({
      next: (res) => {
        this.helpersService.messageNotification("success", "Correcto", `El permiso ${res.name} ha sido creado.`, 3000);
        this.hideModal();
        this.tableComponent.reload();
      },
      error: (err) => {
        this.isLoading = false;
        console.log(err);
        this.helpersService.messageNotification("error", 'Error', err.message, 3000);
      }
    })
  };

  submitUpdate(idPermission : number) {
    const data: Permission = {
      ...this.formPermission.value,
    };
    this.permissionService.update(idPermission, data).subscribe({
      next: (res) => {
        this.helpersService.messageNotification("success", "Correcto", `El permiso ${res.name} ha sido actualizado.`, 3000);
        this.hideModal();
        this.tableComponent.reload();
      },
      error: (err) => {
        console.log(err);
        this.helpersService.messageNotification("error", 'Error', err.message, 3000);
        this.isLoading = false;
      }
    });
  }
}
