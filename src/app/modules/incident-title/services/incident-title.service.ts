import { HttpClient } from '@angular/common/http';
import { Injectable, Output, EventEmitter, inject, signal  } from '@angular/core';
import { environment } from '@core/environments/environment.development';
import { Observable } from 'rxjs';
import { IServiceCommon } from '@core/interfaces/service-common.interface';
import { IncidentTitle } from '@core/interfaces/incident-title';
import { GenericTableComponent } from '@shared/components/generic-table/generic-table.component';
import { ModalDeleteComponent } from '@shared/components/modal-delete/modal-delete.component';
import { IGenericModalForm } from '@core/interfaces/generic-modal-form.interface';

@Injectable({
  providedIn: 'root'
})
export class IncidentTitleService implements IServiceCommon {

  public eventFormComponent = signal<IGenericModalForm>(null);
  public eventTableComponent = signal<GenericTableComponent<IncidentTitle>>(null);
  public eventModalDeleteComponent = signal<ModalDeleteComponent>(null);

  private http = inject(HttpClient);

  private serverUrlIncidentTitle: string = environment.server_url + 'incidentTitles';

  public getAll() {
    return this.http.get<IncidentTitle[]>(this.serverUrlIncidentTitle)
  }

  public getById(id: number) {
    return this.http.get<IncidentTitle>(this.serverUrlIncidentTitle + '/' + id)
  }

  public create(incidentTitle: IncidentTitle) {
    return this.http.post<IncidentTitle>(this.serverUrlIncidentTitle, incidentTitle)
  }

  public update(id: number, incidentTitle: IncidentTitle) {
    return this.http.put<IncidentTitle>(this.serverUrlIncidentTitle + '/' + id, incidentTitle)
  }

  public delete(id: number): Observable<string> {
    return this.http.delete(this.serverUrlIncidentTitle + '/' + id, { responseType:'text'})
  }

}
