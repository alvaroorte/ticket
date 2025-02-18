import { Component, inject } from '@angular/core';
import { PermissionService } from '../../services/permission.service';
import { FormComponent } from '../form/form.component';
import { TableComponent } from '../table/table.component';
import { HelpersService } from 'src/app/core/services/helpers.service';
import { ModaldeleteComponent } from 'src/app/shared/components/modal-delete/modal-delete.component';

@Component({
  selector: 'app-toolbar',
  templateUrl: './toolbar.component.html'
})
export class ToolbarComponent {

  permissionService = inject(PermissionService);
  private helpersService = inject(HelpersService);

  formComponent!: FormComponent;
  modalDeleteComponent!: ModaldeleteComponent;
  tableComponent!: TableComponent;

  ngOnInit() {
    this.permissionService.eventToolbarComponent.emit(this);

    this.permissionService.eventFormComponent.subscribe((formComponent) => {
      this.formComponent = formComponent;
    });

    this.permissionService.eventModalDeleteComponent.subscribe((modalDeleteComponent) => {
      this.modalDeleteComponent = modalDeleteComponent;
    });

    this.permissionService.eventTableComponent.subscribe((tableComponent) => {
      this.tableComponent = tableComponent;
    });
  }

  create() {
    this.formComponent.openCreate();
  }

  edit() {
    if ( this.tableComponent.selectedPermission() && this.tableComponent.selectedPermission().id ) {
      this.formComponent.openEdit(this.tableComponent.selectedPermission().id!);
    } else {
      this.helpersService.messageNotification("warn", "Por favor", `Seleccione un rol`, 3000);
    }
  }

  deletePermission() {
    if ( this.tableComponent.selectedPermission() && this.tableComponent.selectedPermission().id ) {
      this.permissionService.eventDeleteRow.emit(this.tableComponent.selectedPermission().id);
      this.modalDeleteComponent.openConfirm();
    } else {
      this.helpersService.messageNotification("warn", "Por favor", `Seleccione un rol`, 3000);
    }
  }

  reload() {
    this.tableComponent.reload();
  }
}
