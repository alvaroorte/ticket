import { HttpClient } from '@angular/common/http';
import { Injectable, inject, signal  } from '@angular/core';
import { Supervisor } from 'src/app/core/models/Supervisor';
import { environment } from '@core/environments/environment.development';
import { Observable } from 'rxjs';
import { IServiceCommon } from '@core/interfaces/service-common.interface';
import { GenericTableComponent } from '@shared/components/generic-table/generic-table.component';
import { ModalDeleteComponent } from '@shared/components/modal-delete/modal-delete.component';
import { IGenericModalForm } from '@core/interfaces/generic-modal-form.interface';

@Injectable({
  providedIn: 'root'
})
export class SupervisorService implements IServiceCommon {

  public eventFormComponent = signal<IGenericModalForm>(null);
  public eventTableComponent = signal<GenericTableComponent<Supervisor>>(null);
  public eventModalDeleteComponent = signal<ModalDeleteComponent>(null);

  private http = inject(HttpClient);

  private serverUrl: string = environment.server_url;

  public getAll() {
    return this.http.get<Supervisor[]>(this.serverUrl+'supervisor')
  }

  public getById(id: number) {
    return this.http.get<Supervisor>(this.serverUrl + 'supervisor/' + id)
  }

  public create(supervisor: Supervisor) {
    return this.http.post<Supervisor>(this.serverUrl + 'supervisor', supervisor)
  }

  public delete(id: number): Observable<string> {
    return this.http.delete(this.serverUrl + 'supervisor/' + id, { responseType:'text'})
  }

  public update(idSupervisor: number, body: Supervisor) {
    return this.http.put<Supervisor>(this.serverUrl+'supervisor/' + idSupervisor, body)
  }
}
