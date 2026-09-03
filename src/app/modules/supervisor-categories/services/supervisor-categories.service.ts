import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable, inject, signal } from '@angular/core';
import { environment } from '@core/environments/environment.development';
import { IGenericModalForm } from '@core/interfaces/generic-modal-form.interface';
import { IServiceCommon } from '@core/interfaces/service-common.interface';
import { ISupervisorCategory, ISupervisorCategoryAssignedUnassigned, ISupervisorCategorySave } from '@core/interfaces/supervisor-category.interface';
import { GenericTableComponent } from '@shared/components/generic-table/generic-table.component';
import { ModalDeleteComponent } from '@shared/components/modal-delete/modal-delete.component';

@Injectable({
  providedIn: 'root'
})
export class SupervisorCategoryService implements IServiceCommon {

  public eventFormComponent = signal<IGenericModalForm>(null);
  public eventTableComponent = signal<GenericTableComponent<ISupervisorCategory>>(null);
  public eventModalDeleteComponent = signal<ModalDeleteComponent>(null);

  private http = inject(HttpClient);

  private serverUrl: string = environment.server_url;

  public delete(id: number) {
    return this.http.delete<string>(this.serverUrl + 'supervisorDetail/' + id)
  }
  
  public getBySupervisor(supervisorId: number) {
    return this.http.get<ISupervisorCategory[]>(this.serverUrl + 'supervisorDetail/by-supervisor/' + supervisorId)
  }
  
  public save(body: ISupervisorCategorySave) {
    return this.http.post(this.serverUrl + 'supervisorDetail/save', body)
  }
  
  public getAssignedUnassigned(supervisorId: number, enterpriseId: number) {
    const params: HttpParams = new HttpParams()
      .set('supervisorId', supervisorId)
      .set('enterpriseId', enterpriseId)
    return this.http.get<ISupervisorCategoryAssignedUnassigned>(this.serverUrl + 'supervisorDetail/assigned-unassigned', { params })
  }
  
 
}
