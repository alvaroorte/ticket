import { HttpClient } from '@angular/common/http';
import { Injectable, Output, EventEmitter, inject  } from '@angular/core';
import { Supervisor, SupervisorSend } from 'src/app/core/models/Supervisor';
import { environment } from '@core/environments/environment.development';
import { DataCommon } from '@core/models/FieldsCommons';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class SupervisorService {

  @Output() eventFormComponent: EventEmitter<any> = new EventEmitter();
  @Output() eventTableComponent: EventEmitter<any> = new EventEmitter();
  @Output() eventModalDeleteComponent: EventEmitter<any> = new EventEmitter();
  @Output() eventToolbarComponent: EventEmitter<any> = new EventEmitter();

  private http = inject(HttpClient);

  private serverUrl: string = environment.server_url;

  public getAll() {
    return this.http.get<Supervisor[]>(this.serverUrl+'supervisor')
  }

  public getById(id: number) {
    return this.http.get<Supervisor>(this.serverUrl + 'supervisor/' + id)
  }

  public create(supervisor: SupervisorSend) {
    return this.http.post<Supervisor>(this.serverUrl + 'supervisor', supervisor)
  }

  public delete(id: number): Observable<string> {
    return this.http.delete(this.serverUrl + 'supervisor/' + id, { responseType:'text'})
  }

  public search() {
    return this.http.get<DataCommon[]>(this.serverUrl+'supervisor/search')
  }

  public update(idSupervisor: number, body: SupervisorSend) {
    return this.http.put<Supervisor>(this.serverUrl+'supervisor/' + idSupervisor, body)
  }
}
