import { HttpClient } from '@angular/common/http';
import { Injectable, inject, signal  } from '@angular/core';
import { environment } from '@core/environments/environment.development';
import { Observable } from 'rxjs';
import { Schedule } from '@core/models/schedule';
import { IServiceCommon } from '@core/interfaces/service-common.interface';
import { GenericTableComponent } from '@shared/components/generic-table/generic-table.component';
import { ModalDeleteComponent } from '@shared/components/modal-delete/modal-delete.component';
import { IGenericModalForm } from '@core/interfaces/generic-modal-form.interface';

@Injectable({
  providedIn: 'root'
})
export class ScheduleService implements IServiceCommon {

  public eventFormComponent = signal<IGenericModalForm>(null);
  public eventTableComponent = signal<GenericTableComponent<Schedule>>(null);
  public eventModalDeleteComponent = signal<ModalDeleteComponent>(null);

  private http = inject(HttpClient);

  private serverUrl: string = environment.server_url;

  public getAll() {
    return this.http.get<Schedule[]>(this.serverUrl+'schedule')
  }

  public getById(id: number) {
    return this.http.get<Schedule>(this.serverUrl + 'schedule/' + id)
  }

  public create(schedule: Schedule) {
    return this.http.post<Schedule>(this.serverUrl + 'schedule', schedule)
  }

  public update(id: number, schedule: Schedule) {
    return this.http.put<Schedule>(this.serverUrl + 'schedule/' + id, schedule)
  }

  public delete(id: number): Observable<string> {
    return this.http.delete(this.serverUrl + 'schedule/' + id, { responseType:'text'})
  }


}
