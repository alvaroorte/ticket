import { HttpClient } from '@angular/common/http';
import { Injectable, Output, EventEmitter, inject, signal  } from '@angular/core';
import { environment } from '@core/environments/environment.development';
import { Observable } from 'rxjs';
import { IServiceCommon } from '@core/interfaces/service-common.interface';
import { ISla, ISlaSend } from '@core/interfaces/sla.inteface.';
import { GenericTableComponent } from '@shared/components/generic-table/generic-table.component';
import { ModalDeleteComponent } from '@shared/components/modal-delete/modal-delete.component';
import { IGenericModalForm } from '@core/interfaces/generic-modal-form.interface';

@Injectable({
  providedIn: 'root'
})
export class SlaService implements IServiceCommon {

  public eventFormComponent = signal<IGenericModalForm>(null);
  public eventTableComponent = signal<GenericTableComponent<ISla>>(null);
  public eventModalDeleteComponent = signal<ModalDeleteComponent>(null);

  private http = inject(HttpClient);

  private urlSla: string = environment.server_url + 'sla';

  public getById(id: number) {
    return this.http.get<ISla>(`${this.urlSla}/${id}`)
  }

  public create(team: ISlaSend) {
    return this.http.post<ISla>(this.urlSla, team)
  }

  public update(id: number, team: ISlaSend) {
    return this.http.put<ISla>(`${this.urlSla}/${id}`, team)
  }

  public delete(id: number): Observable<string> {
    return this.http.delete(`${this.urlSla}/${id}`, { responseType:'text'})
  }
  
  public getByEnterprise(enterpriseId: number) {
    return this.http.get<ISla[]>(`${this.urlSla}/by-enterprise/${enterpriseId}`)
  }
}
