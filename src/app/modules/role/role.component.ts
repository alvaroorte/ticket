import { Component, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RoleModule } from './role.module';
import { ModaldeleteComponent } from '@shared/components/modal-delete/modal-delete.component';
import { TableDoubleHelper } from './helpers/table-double.helper';
import { PermissionComponent } from '../permission/permission.component';
import { TableDoubleComponent } from '@shared/components/table-double/table-double.component';

@Component({
  selector: 'app-role',
  standalone: true,
  imports: [CommonModule, RoleModule, ModaldeleteComponent, PermissionComponent, TableDoubleComponent],
  templateUrl: './role.component.html'
})
export class RoleComponent extends TableDoubleHelper {

  idDelete = signal<number>(0);
  ngOnInit(): void {
    this.roleService.eventDeleteRow.subscribe( id => this.idDelete.set(id) );
  }
}
