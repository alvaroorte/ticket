import { HttpClient } from '@angular/common/http';
import { Injectable, Output, EventEmitter, inject  } from '@angular/core';
import { DataCommon } from '@core/models/FieldsCommons';
import { SupervisorCategory, SupervisorCategorySend } from '@core/models/SupervisorCategory';
import { environment } from '@core/environments/environment.development';

@Injectable({
  providedIn: 'root'
})
export class SupervisorCategoriesService {

  @Output() eventFormComponent: EventEmitter<any> = new EventEmitter();
  @Output() eventTableComponent: EventEmitter<any> = new EventEmitter();
  @Output() eventModalDeleteComponent: EventEmitter<any> = new EventEmitter();
  @Output() eventToolbarComponent: EventEmitter<any> = new EventEmitter();
  @Output() eventTableDobleComponent: EventEmitter<any> = new EventEmitter();

  private http = inject(HttpClient);

  private serverUrl: string = environment.server_url;
  
  public create(supervisorDetail: SupervisorCategorySend) {
    return this.http.post<SupervisorCategory>(this.serverUrl + 'supervisorDetail', supervisorDetail)
  }

  public createList(supervisorDetail: SupervisorCategorySend[]) {
    return this.http.post<SupervisorCategory>(this.serverUrl + 'supervisorDetail/createList', supervisorDetail)
  }
  
  public delete(id: number) {
    return this.http.delete<string>(this.serverUrl + 'supervisorDetail/' + id)
  }

  public deleteList(body: any) {
    return this.http.post<void>(this.serverUrl + 'supervisorDetail/deleteList', body)
  }
  
  public getBySupervisor(idSupervisor: number) {
    return this.http.get<DataCommon[]>(this.serverUrl + 'supervisorDetail/getBySupervisor/' + idSupervisor)
  }
  
  public listAsignation(idEnterprise: number, idSupervisor: number) {
    return this.http.get<DataCommon[]>(`${this.serverUrl}supervisorDetail/listAsignation/${idEnterprise}/${idSupervisor}`)
  }
}
