import { Component, inject } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { HelpersService } from 'src/app/core/services/helpers.service';
import { TableComponent } from '../table/table.component';
import { iconsPrime } from 'src/app/shared/icons/icons-pime';
import { Icon } from 'src/app/core/models/Icon';
import { Role } from 'src/app/core/models/Role';
import { limits, regex, messages } from '@core/constants/constants';
import { RoleService } from '../../services/role.service';


@Component({
  selector: 'app-form',
  templateUrl: './form.component.html'
})
export class FormComponent {

  private formBuilder = inject(FormBuilder);
  private helpersService = inject(HelpersService);
  private roleService = inject(RoleService);

  messages = messages;
  iconsPrime: Icon[] = iconsPrime;
  selectedIcon: Icon | null = null;
  roles!: Role[];
  roleId: number = 0;
  folder!: string;
  openModal: boolean = false;
  tittleForm: string = "";
  tableComponent!: TableComponent;
  isLoading = false;

  public formRole: FormGroup = this.formBuilder.group({
    id: [],
    name: [, [Validators.required, Validators.pattern(regex.fieldName)]],
    code: [, [Validators.required, Validators.minLength(limits.minLength), Validators.pattern(regex.fieldCode)]],
    description: [, [Validators.required]]
  });

  ngOnInit() {
    this.roleService.eventFormComponent.emit(this);
    this.roleService.eventTableComponent.subscribe((tableComponent) => {
      this.tableComponent = tableComponent;
    });
  };

  hideModal() {
    this.openModal = false;
    this.isLoading = false;
  };

  openCreate(){
    this.reset();
    this.tittleForm = "Nuevo rol";
    this.openModal = true;

  };

  openEdit(id: number){
    this.reset();
    this.tittleForm = 'Editar rol';
    this.roleService.getById(id).subscribe({
      next: (res) => {
        this.roleId = res.id!;
        this.formRole.patchValue(res)
        this.openModal=true;
      },
      error: (err) => {
        console.log(err);
        this.helpersService.messageNotification("error", 'Error', err.message, 3000);
      }
    })
  };

  saveRole() {
    this.isLoading = true;
    if (this.formRole.valid) {
      if(this.roleId > 0){
        this.submitUpdate(this.roleId);
      } else{
        this.submitCreate();
      }
    }
  };

  reset(): void {
    this.formRole.reset();
    this.roleId = 0;
  };

  submitCreate() {
    const data: Role = {
      ...this.formRole.value,
    };
    this.roleService.create(data).subscribe({
      next: (res) => {
        this.helpersService.messageNotification("success", "Correcto", `El rol ${res.name} ha sido creado.`, 3000);
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

  submitUpdate(idRole : number) {
    const data: Role = {
      ...this.formRole.value,
    };
    this.roleService.update(idRole, data).subscribe({
      next: (res) => {
        this.helpersService.messageNotification("success", "Correcto", `El rol ${res.name} ha sido actualizado.`, 3000);
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
