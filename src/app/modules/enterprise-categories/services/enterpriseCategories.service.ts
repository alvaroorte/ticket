import { HttpClient } from '@angular/common/http';
import { Injectable, Output, EventEmitter, inject  } from '@angular/core';
import { DataCommon } from '@core/models/FieldsCommons';
import { EnterpriseCategory, EnterpriseCategorySend, EnterpriseCategoryTableDouble } from '@core/models/EnterpriseCategory';
import { Team } from '@core/models/Team';
import { environment } from '@core/environments/environment.development';

@Injectable({
  providedIn: 'root'
})
export class EnterpriseCategoriesService {

  @Output() eventFormComponent: EventEmitter<any> = new EventEmitter();
  @Output() eventTableComponent: EventEmitter<any> = new EventEmitter();
  @Output() eventModalDeleteComponent: EventEmitter<any> = new EventEmitter();
  @Output() eventToolbarComponent: EventEmitter<any> = new EventEmitter();
  @Output() eventTableDobleComponent: EventEmitter<any> = new EventEmitter();

  private http = inject(HttpClient);

  private serverUrl: string = environment.server_url;

  public getAll() {
    return this.http.get<EnterpriseCategory[]>(this.serverUrl+'enterpriseCategory')
  }

  public getById(id: number) {
    return this.http.get<EnterpriseCategory>(this.serverUrl + 'enterpriseCategory/' + id)
  }

  public create(enterpriseCategory: EnterpriseCategorySend) {
    return this.http.post<EnterpriseCategory>(this.serverUrl + 'enterpriseCategory', enterpriseCategory)
  }

  public createList(enterpriseCategory: EnterpriseCategorySend[]) {
    return this.http.post<EnterpriseCategory>(this.serverUrl + 'enterpriseCategory/createList', enterpriseCategory)
  }

  public deleteList(body: any) {
    return this.http.post<void>(this.serverUrl + 'enterpriseCategory/deleteList', body)
  }

  public update(id: number, enterpriseCategory: EnterpriseCategorySend) {
    return this.http.put<EnterpriseCategorySend>(this.serverUrl + 'enterpriseCategory/' + id, enterpriseCategory)
  }

  public delete(id: number) {
    return this.http.delete<string>(this.serverUrl + 'enterpriseCategory/' + id)
  }

  public search(code: string | undefined) {
    let params: any = {};
    ( code )? params['code'] = code : "";
    return this.http.get<EnterpriseCategory[]>(this.serverUrl+'enterpriseCategory/enterpriseSearch', { params })
  }

  public listByEnterprise(id: number) {
    return this.http.get<EnterpriseCategory[]>(this.serverUrl + 'enterpriseCategory/listByEnterprise/' + id)
  }

  public listAsignation(id: number) {
    return this.http.get<EnterpriseCategoryTableDouble[]>(this.serverUrl + 'enterpriseCategory/listAsignation/' + id)
  }

  public getTeams() {
    return this.http.get<Team[]>(this.serverUrl + 'team/teamSearch')
  }

  public getByLeader(idEnterprises: number) {
    return this.http.get<DataCommon[]>(this.serverUrl + 'enterpriseCategory/getByLeader/' + idEnterprises)
  }
}
