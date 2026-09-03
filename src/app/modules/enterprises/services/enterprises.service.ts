import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable, Output, EventEmitter, inject, signal  } from '@angular/core';
import { Enterprise } from 'src/app/core/models/Enterprise';
import { environment } from '@core/environments/environment.development';
import { Observable } from 'rxjs';
import { IServiceCommon } from '@core/interfaces/service-common.interface';
import { EnterpriseShort } from '@core/interfaces/enterprise.interface';
import { GenericTableComponent } from '@shared/components/generic-table/generic-table.component';
import { ModalDeleteComponent } from '@shared/components/modal-delete/modal-delete.component';
import { IGenericModalForm } from '@core/interfaces/generic-modal-form.interface';

@Injectable({
  providedIn: 'root'
})
export class EnterpriseService implements IServiceCommon {

  public eventFormComponent = signal<IGenericModalForm>(null);
  public eventTableComponent = signal<GenericTableComponent<Enterprise>>(null);
  public eventModalDeleteComponent = signal<ModalDeleteComponent>(null);

  private http = inject(HttpClient);

  private serverUrl: string = environment.server_url;

  public getAll() {
    return this.http.get<Enterprise[]>(this.serverUrl+'enterprise')
  }

  public getById(id: number) {
    return this.http.get<Enterprise>(this.serverUrl + 'enterprise/' + id)
  }
  
  public create(enterprise: Enterprise) {
    return this.http.post<Enterprise>(this.serverUrl + 'enterprise', enterprise)
  }
  
  public update(id: number, enterprise: Enterprise) {
    return this.http.put<Enterprise>(this.serverUrl + 'enterprise/' + id, enterprise)
  }
  
  public delete(id: number): Observable<string> {
    return this.http.delete(this.serverUrl + 'enterprise/' + id, { responseType:'text'})
  }
  
  public select() {
    return this.http.get<Enterprise[]>(this.serverUrl + 'enterprise/select')
  }
  
  public getMe() {
    return this.http.get<Enterprise>(this.serverUrl+'enterprise/me')
  }
  
  public getMine(supervisor: boolean) {
    const params: HttpParams = new HttpParams().set('supervisor', supervisor);
    return this.http.get<EnterpriseShort[]>(this.serverUrl+'enterprise/mine', { params })
  }
}
