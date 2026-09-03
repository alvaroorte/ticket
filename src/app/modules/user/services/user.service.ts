import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable, Output, EventEmitter, inject, signal  } from '@angular/core';
import { Params } from '@angular/router';
import { environment } from '@core/environments/environment.development';
import { Observable } from 'rxjs';
import { IServiceCommon } from '@core/interfaces/service-common.interface';
import { User } from '@core/models/user';
import { IAddRoleToUSerByCode, IUpdateRolesToUSer } from '@core/interfaces/user.interface';
import { IPageable } from '@core/interfaces/pageable.interface';
import { Role } from '@core/models/Role';
import { TableOnDemnadComponent } from '@shared/components/table-on-demand/table-on-demand.component';
import { ModalDeleteComponent } from '@shared/components/modal-delete/modal-delete.component';
import { IGenericModalForm } from '@core/interfaces/generic-modal-form.interface';

@Injectable({
  providedIn: 'root'
})
export class UserService implements IServiceCommon {

  public eventFormComponent = signal<IGenericModalForm>(null);
  public eventTableComponent = signal<TableOnDemnadComponent<User>>(null);
  public eventModalDeleteComponent = signal<ModalDeleteComponent>(null);
  @Output() eventOpenModalAddRoles: EventEmitter<User> = new EventEmitter();

  private http = inject(HttpClient);

  private urlUser: string = environment.server_url + 'users';
  params: Params = {};

  public getAll() {
    return this.http.get<User[]>(this.urlUser);
  }

  public getById(id: number) {
    return this.http.get<User>(`${this.urlUser}/${id}`)
  }

  public create(team: User) {
    return this.http.post<User>(this.urlUser, team)
  }

  public update(id: number, team: User) {
    return this.http.put<User>(`${this.urlUser}/${id}`, team)
  }

  public delete(id: number): Observable<string> {
    return this.http.delete(`${this.urlUser}/${id}`, { responseType:'text'})
  }
  
  public getPageable(params: HttpParams) {
    return this.http.get<IPageable<User>>(`${this.urlUser}/pageable`, { params });
  }

  public updateRolesToUSer(body: IUpdateRolesToUSer) {
    return this.http.put(`${this.urlUser}/updateRoles`, body);
  }
  
  public addRoleByCode(body: IAddRoleToUSerByCode) {
    return this.http.post(`${this.urlUser}/addRoleByCode`, body);
  }
  
  public getRolesByUser(userId: number) {
    return this.http.get<Role[]>(`${this.urlUser}/getRolesByUser/${userId}`);
  }
  
}
