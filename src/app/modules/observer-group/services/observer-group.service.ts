import { HttpClient } from '@angular/common/http';
import { Injectable, Output, EventEmitter, inject, signal  } from '@angular/core';
import { environment } from '@core/environments/environment.development';
import { Observable } from 'rxjs';
import { IServiceCommon } from '@core/interfaces/service-common.interface';
import { ObserverGroup, ObserverGroupSend } from '@core/interfaces/observer-group.inteface.';
import { GenericTableComponent } from '@shared/components/generic-table/generic-table.component';
import { ModalDeleteComponent } from '@shared/components/modal-delete/modal-delete.component';
import { IGenericModalForm } from '@core/interfaces/generic-modal-form.interface';

@Injectable({
  providedIn: 'root'
})
export class ObserverGroupService implements IServiceCommon {

  public eventFormComponent = signal<IGenericModalForm>(null);
  public eventTableComponent = signal<GenericTableComponent<ObserverGroup>>(null);
  public eventModalDeleteComponent = signal<ModalDeleteComponent>(null);

  private http = inject(HttpClient);

  private serverUrlObserverGroup: string = environment.server_url + 'observersGroup';

  public getAll() {
    return this.http.get<ObserverGroup[]>(this.serverUrlObserverGroup)
  }

  public getById(id: number) {
    return this.http.get<ObserverGroup>(this.serverUrlObserverGroup + '/' + id)
  }

  public create(observerGroup: ObserverGroupSend) {
    return this.http.post<ObserverGroup>(this.serverUrlObserverGroup, observerGroup)
  }

  public update(id: number, observerGroup: ObserverGroupSend) {
    return this.http.put<ObserverGroup>(this.serverUrlObserverGroup + '/' + id, observerGroup)
  }

  public delete(id: number): Observable<string> {
    return this.http.delete(this.serverUrlObserverGroup + '/' + id, { responseType:'text'})
  }
  
  public getByEnterpriseId(enterpriseId: number) {
    return this.http.get<ObserverGroup[]>(this.serverUrlObserverGroup + '/by-enterprise/' + enterpriseId)
  }

}
