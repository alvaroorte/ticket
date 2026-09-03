import { Component, inject, signal } from '@angular/core';
import { PermissionService } from './services/permission.service';
import { ModalDeleteComponent } from '@shared/components/modal-delete/modal-delete.component';
import { ToolbarComponent } from '@shared/components/toolbar/toolbar.component';
import { Permission } from '@core/models/Permission';
import { RoleService } from '../role/services/role.service';
import { TableOnDemnadComponent } from '@shared/components/table-on-demand/table-on-demand.component';
import { HttpParams } from '@angular/common/http';
import { FormComponent } from './components/form/form.component';
import { TableColumnDefinitions } from '@core/utils/table-column-definitions';

@Component({
    selector: 'app-permission',
    imports: [ModalDeleteComponent, ToolbarComponent, TableOnDemnadComponent, FormComponent],
    templateUrl: './permission.component.html'
})
export class PermissionComponent {

  public permissionService = inject(PermissionService);
  public roleService = inject(RoleService);
  
  public titleTable = 'Lista de permisos';
  public totalElements = 0;
  public permissions = signal<Permission[]>([]);
  public permissionSelected = signal<Permission | null>(null);

  public columns = TableColumnDefinitions.getPermissionColumnsDefinition();

  public setPermission( permissionSelected: Permission  ) {
    this.permissionSelected.set(permissionSelected);
  }

  public updatePermissionInRole() {
    this.roleService.eventReloadPermissionByRol.emit();
  }

  public loadPermissions(params: HttpParams) {
    this.permissionService.getPageable(params).subscribe({
      next: (res) => {
        this.permissions.set(res.content);
        this.totalElements = res.totalElements;
      }, error: () => {
        this.permissions.set([]);
      }
    });
  }

  public onTableSelfEmision(table: TableOnDemnadComponent<Permission>) {
    this.permissionService.eventTableComponent.set(table);
  }
}
