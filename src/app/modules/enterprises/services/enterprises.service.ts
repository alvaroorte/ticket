import { HttpClient } from '@angular/common/http';
import { Injectable, Output, EventEmitter, inject  } from '@angular/core';
import { Enterprise } from 'src/app/core/models/Enterprise';
import { environment } from '@core/environments/environment.development';
import { DataCommon } from '@core/models/FieldsCommons';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class EnterprisesService {

  @Output() eventFormComponent: EventEmitter<any> = new EventEmitter();
  @Output() eventTableComponent: EventEmitter<any> = new EventEmitter();
  @Output() eventModalDeleteComponent: EventEmitter<any> = new EventEmitter();
  @Output() eventToolbarComponent: EventEmitter<any> = new EventEmitter();

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

  public search(code: string | void) {
    let params: any = {};
    ( code )? params['code'] = code : "";
    return this.http.get<Enterprise[]>(this.serverUrl+'enterprise/enterpriseSearch', { params })
  }

  public getByLeader() {
    return this.http.get<DataCommon[]>(this.serverUrl+'enterprise/getByLeader')
  }
}
