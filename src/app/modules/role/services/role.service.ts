import { HttpClient } from '@angular/common/http';
import { Injectable, Output, EventEmitter, inject  } from '@angular/core';
import { DataCommon } from '@core/models/FieldsCommons';
import { environment } from '@core/environments/environment.development';
import { Observable } from 'rxjs';
import { Role, RoleWithPermissions } from '@core/models/Role';

@Injectable({
  providedIn: 'root'
})
export class RoleService {

  @Output() eventFormComponent: EventEmitter<any> = new EventEmitter();
  @Output() eventTableComponent: EventEmitter<any> = new EventEmitter();
  @Output() eventModalDeleteComponent: EventEmitter<any> = new EventEmitter();
  @Output() eventToolbarComponent: EventEmitter<any> = new EventEmitter();
  @Output() eventToolbarCategoryComponent: EventEmitter<any> = new EventEmitter();
  @Output() eventTableDobleComponent: EventEmitter<any> = new EventEmitter();
  @Output() eventDeleteRow: EventEmitter<any> = new EventEmitter();

  private http = inject(HttpClient);

  private serverUrl: string = environment.server_url;
  private serverUrlSecurity: string = environment.server_security_url;

  public getAll() {
    return this.http.get<Role[]>(this.serverUrlSecurity+'roles')
  }

  public getById(id: number) {
    return this.http.get<Role>(this.serverUrlSecurity + 'roles/' + id)
  }

  public create(role: Role) {
    return this.http.post<Role>(this.serverUrlSecurity + 'roles', role)
  }

  public update(id: number, role: Role) {
    return this.http.put<Role>(this.serverUrlSecurity + 'roles/' + id, role)
  }

  public delete(id: number): Observable<Object> | Observable<string>  {
    return this.http.delete(this.serverUrlSecurity + 'roles/' + id, { responseType:'text'})
  }

  public permissionAssignedByRole(idRole: number) {
    return this.http.get<DataCommon[]>(this.serverUrlSecurity + 'roles/permissionAssignedByRole/' + idRole)
  }

  public createList( body:RoleWithPermissions ) {
    return this.http.post(this.serverUrlSecurity + 'roles/addPermissions', body);
  }

  public deleteList( body:RoleWithPermissions ) {
    return this.http.post(this.serverUrlSecurity + 'roles/removeRolePermissions', body);
  }
}
