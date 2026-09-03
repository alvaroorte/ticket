import { Component, inject, signal } from '@angular/core';
import { ModalDeleteComponent } from '@shared/components/modal-delete/modal-delete.component';
import { PermissionComponent } from '../permission/permission.component';
import { ToolbarComponent } from '@shared/components/toolbar/toolbar.component';
import { Role } from '@core/models/Role';
import { RoleService } from './services/role.service';
import { TableColumn } from '@core/interfaces/table.interface';
import { TableColumnDefinitions } from '@core/utils/table-column-definitions';
import { GenericTableComponent } from '@shared/components/generic-table/generic-table.component';
import { PrimeTableProps } from '@core/utils/prime-table-props';
import { COMMON } from '@core/constants/common';
import { FormComponent } from './components/form/form.component';
import { assignPermissionsComponent } from './components/assign-permissions/assign-permissions.component';
import { FieldsetModule } from 'primeng/fieldset';

@Component({
    selector: 'app-role',
    imports: [ModalDeleteComponent, PermissionComponent, ToolbarComponent, GenericTableComponent, FormComponent, assignPermissionsComponent, FieldsetModule],
    templateUrl: './role.component.html'
})
export class RoleComponent {

  public roleService = inject(RoleService);

  public titleTable = "Lista de roles";
  public roleSelected = signal<Role | null>(null);
  public roles = signal<Role[]>([]);
  public tableColumnRoleDefinitions: TableColumn<Role>[] = TableColumnDefinitions.getRoleColumnsDefinition();
  public tableProps: PrimeTableProps = new PrimeTableProps({rows: COMMON.minimumRows});

  ngOnInit(): void {
    this.getRole();
  }

  public setRole( role: Role  ) {
    this.roleSelected.set(role);
  }

  public getRole(): void {
    this.roleService.getAll().subscribe({
      next: (res) => {
        this.roles.set(res);
      }
    })
  }

  public onTableSelfEmision(table: GenericTableComponent<Role>) {
    this.roleService.eventTableComponent.set(table);
  }
}
