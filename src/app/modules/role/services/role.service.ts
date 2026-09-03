import { HttpClient } from '@angular/common/http';
import { Injectable, Output, EventEmitter, inject, signal  } from '@angular/core';
import { environment } from '@core/environments/environment.development';
import { Observable } from 'rxjs';
import { Role, RoleWithPermissions } from '@core/models/Role';
import { IServiceCommon } from '@core/interfaces/service-common.interface';
import { RolePermission } from '@core/interfaces/role-permission';
import { GenericTableComponent } from '@shared/components/generic-table/generic-table.component';
import { ModalDeleteComponent } from '@shared/components/modal-delete/modal-delete.component';
import { IGenericModalForm } from '@core/interfaces/generic-modal-form.interface';

@Injectable({
  providedIn: 'root'
})
export class RoleService implements IServiceCommon {

  public eventFormComponent = signal<IGenericModalForm>(null);
  public eventTableComponent = signal<GenericTableComponent<Role>>(null);
  public eventModalDeleteComponent = signal<ModalDeleteComponent>(null);
  @Output() eventReloadPermissionByRol: EventEmitter<void> = new EventEmitter();

  private http = inject(HttpClient);

  private serverUrlRole: string = environment.server_url + 'roles';

  public getAll() {
    return this.http.get<Role[]>(this.serverUrlRole)
  }

  public getById(id: number) {
    return this.http.get<Role>(`${this.serverUrlRole}/${id}`)
  }

  public create(role: Role) {
    return this.http.post<Role>(this.serverUrlRole, role)
  }

  public update(id: number, role: Role) {
    return this.http.put<Role>(`${this.serverUrlRole}/${id}`, role)
  }

  public delete(id: number): Observable<string>  {
    return this.http.delete(`${this.serverUrlRole}/${id}`, { responseType:'text'})
  }

  public permissionAssignedByRole(roleId: number) {
    return this.http.get<RolePermission>(`${this.serverUrlRole}/role-permissions/${roleId}`)
  }

  public addPermissions( body:RoleWithPermissions ) {
    return this.http.post(`${this.serverUrlRole}/addPermissions`, body);
  }
}
