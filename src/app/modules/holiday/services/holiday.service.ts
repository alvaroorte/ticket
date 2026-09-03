import { HttpClient } from '@angular/common/http';
import { Injectable, Output, EventEmitter, inject, signal  } from '@angular/core';
import { environment } from '@core/environments/environment.development';
import { Observable } from 'rxjs';
import { Holiday } from '@core/models/holiday';
import { IServiceCommon } from '@core/interfaces/service-common.interface';
import { GenericTableComponent } from '@shared/components/generic-table/generic-table.component';
import { ModalDeleteComponent } from '@shared/components/modal-delete/modal-delete.component';
import { IGenericModalForm } from '@core/interfaces/generic-modal-form.interface';

@Injectable({
  providedIn: 'root'
})
export class HolidayService implements IServiceCommon {

  public eventFormComponent = signal<IGenericModalForm>(null);
  public eventTableComponent = signal<GenericTableComponent<Holiday>>(null);
  public eventModalDeleteComponent = signal<ModalDeleteComponent>(null);

  private http = inject(HttpClient);

  private serverUrl: string = environment.server_url;

  public getAll() {
    return this.http.get<Holiday[]>(this.serverUrl+'holiday')
  }

  public getById(id: number) {
    return this.http.get<Holiday>(this.serverUrl + 'holiday/' + id)
  }

  public create(holiday: Holiday) {
    return this.http.post<Holiday>(this.serverUrl + 'holiday', holiday)
  }

  public update(id: number, holiday: Holiday) {
    return this.http.put<Holiday>(this.serverUrl + 'holiday/' + id, holiday)
  }

  public delete(id: number): Observable<string> {
    return this.http.delete(this.serverUrl + 'holiday/' + id, { responseType:'text'})
  }

  public getHolidayTypes() {
    return this.http.get<string[]>(this.serverUrl + 'holiday/holiday-types')
  }

}
