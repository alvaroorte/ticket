import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable, Output, EventEmitter, inject, signal  } from '@angular/core';
import { environment } from '@core/environments/environment.development';
import { Observable } from 'rxjs';
import { Permission } from '@core/models/Permission';
import { IServiceCommon } from '@core/interfaces/service-common.interface';
import { IPageable } from '@core/interfaces/pageable.interface';
import { TableOnDemnadComponent } from '@shared/components/table-on-demand/table-on-demand.component';
import { ModalDeleteComponent } from '@shared/components/modal-delete/modal-delete.component';
import { IGenericModalForm } from '@core/interfaces/generic-modal-form.interface';

@Injectable({
  providedIn: 'root'
})
export class PermissionService implements IServiceCommon {

  public eventFormComponent = signal<IGenericModalForm>(null);
  public eventTableComponent = signal<TableOnDemnadComponent<Permission>>(null);
  public eventModalDeleteComponent = signal<ModalDeleteComponent>(null);
  @Output() eventToolbarCategoryComponent: EventEmitter<any> = new EventEmitter();
  @Output() eventDeleteRow: EventEmitter<any> = new EventEmitter();

  private http = inject(HttpClient);

  private serverUrlPermissions: string = environment.server_url + 'permissions';

  public getById(id: number) {
    return this.http.get<Permission>(`${this.serverUrlPermissions}/${id}`)
  }

  public create(permission: Permission) {
    return this.http.post<Permission>(this.serverUrlPermissions, permission)
  }

  public update(id: number, permission: Permission) {
    return this.http.put<Permission>(`${this.serverUrlPermissions}/${id}`, permission)
  }

  public delete(id: number): Observable<string>  {
    return this.http.delete(`${this.serverUrlPermissions}/${id}`, { responseType:'text'})
  }

  public getPageable(params: HttpParams) {
    return this.http.get<IPageable<Permission>>(`${this.serverUrlPermissions}/pageable`, { params });
  }
}
