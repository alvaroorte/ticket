import { HttpClient } from '@angular/common/http';
import { Injectable, Output, EventEmitter, inject, signal  } from '@angular/core';
import { environment } from '@core/environments/environment.development';
import { Observable } from 'rxjs';
import { ScheduleDetail } from '@core/interfaces/schedule-detail.interface';
import { IServiceCommon } from '@core/interfaces/service-common.interface';
import { GenericTableComponent } from '@shared/components/generic-table/generic-table.component';
import { ModalDeleteComponent } from '@shared/components/modal-delete/modal-delete.component';
import { IGenericModalForm } from '@core/interfaces/generic-modal-form.interface';

@Injectable({
  providedIn: 'root'
})
export class ScheduleDetailService implements IServiceCommon {

  public eventFormComponent = signal<IGenericModalForm>(null);
  public eventTableComponent = signal<GenericTableComponent<ScheduleDetail>>(null);
  public eventModalDeleteComponent = signal<ModalDeleteComponent>(null);
  @Output() eventOpenModalGanttSchedule: EventEmitter<void> = new EventEmitter();

  private http = inject(HttpClient);

  private serverUrl: string = environment.server_url;

  public getAll() {
    return this.http.get<ScheduleDetail[]>(this.serverUrl+'work-schedule-detail')
  }

  public getById(id: number) {
    return this.http.get<ScheduleDetail>(this.serverUrl + 'work-schedule-detail/' + id)
  }
  
  public create(country: ScheduleDetail) {
    return this.http.post<ScheduleDetail>(this.serverUrl + 'work-schedule-detail', country)
  }
  
  public update(id: number, country: ScheduleDetail) {
    return this.http.put<ScheduleDetail>(this.serverUrl + 'work-schedule-detail/' + id, country)
  }
  
  public delete(id: number): Observable<string> {
    return this.http.delete(this.serverUrl + 'work-schedule-detail/' + id, { responseType:'text'})
  }
  
  public getBySchedule(id: number): Observable<ScheduleDetail[]> {
    return this.http.get<ScheduleDetail[]>(this.serverUrl + 'work-schedule-detail/by-schedule/' + id)
  }
  
  public getDaysOfWeek() {
    return this.http.get<string[]>(this.serverUrl + 'work-schedule-detail/days-of-week')
  }

}
