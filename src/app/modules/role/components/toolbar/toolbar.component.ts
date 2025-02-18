import { Component, inject } from '@angular/core';
import { RoleService } from '../../services/role.service';
import { FormComponent } from '../form/form.component';
import { TableComponent } from '../table/table.component';
import { HelpersService } from 'src/app/core/services/helpers.service';
import { ModaldeleteComponent } from 'src/app/shared/components/modal-delete/modal-delete.component';

@Component({
  selector: 'app-toolbar',
  templateUrl: './toolbar.component.html'
})
export class ToolbarComponent {

  private roleService = inject(RoleService);
  private helpersService = inject(HelpersService);

  formComponent!: FormComponent;
  modalDeleteComponent!: ModaldeleteComponent;
  tableComponent!: TableComponent;

  ngOnInit() {
    this.roleService.eventToolbarComponent.emit(this);

    this.roleService.eventFormComponent.subscribe((formComponent) => {
      this.formComponent = formComponent;
    });

    this.roleService.eventModalDeleteComponent.subscribe((modalDeleteComponent) => {
      this.modalDeleteComponent = modalDeleteComponent;
    });

    this.roleService.eventTableComponent.subscribe((tableComponent) => {
      this.tableComponent = tableComponent;
    });
  }

  create() {
    this.formComponent.openCreate();
  }

  edit() {
    if ( this.tableComponent.selectedRole() && this.tableComponent.selectedRole().id ) {
      this.formComponent.openEdit(this.tableComponent.selectedRole().id!);
    } else {
      this.helpersService.messageNotification("warn", "Por favor", `Seleccione un rol`, 3000);
    }
  }

  deleteRole() {
    if ( this.tableComponent.selectedRole() && this.tableComponent.selectedRole().id ) {
      this.roleService.eventDeleteRow.emit(this.tableComponent.selectedRole().id);
      this.modalDeleteComponent.openConfirm();
    } else {
      this.helpersService.messageNotification("warn", "Por favor", `Seleccione un rol`, 3000);
    }
  }

  reload() {
    this.tableComponent.reload();
  }
}
