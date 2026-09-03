import { HttpClient } from '@angular/common/http';
import { Injectable, Output, EventEmitter, inject, signal  } from '@angular/core';
import { environment } from '@core/environments/environment.development';
import { Observable } from 'rxjs';
import { TerritorialDivision } from '@core/models/territorial-division';
import { IServiceCommon } from '@core/interfaces/service-common.interface';
import { GenericTableComponent } from '@shared/components/generic-table/generic-table.component';
import { ModalDeleteComponent } from '@shared/components/modal-delete/modal-delete.component';
import { IGenericModalForm } from '@core/interfaces/generic-modal-form.interface';

@Injectable({
  providedIn: 'root'
})
export class TerritorialDivisionService implements IServiceCommon {

  public eventFormComponent = signal<IGenericModalForm>(null);
  public eventTableComponent = signal<GenericTableComponent<TerritorialDivision>>(null);
  public eventModalDeleteComponent = signal<ModalDeleteComponent>(null);

  private http = inject(HttpClient);

  private serverUrl: string = environment.server_url;

  public getAll() {
    return this.http.get<TerritorialDivision[]>(this.serverUrl+'territorial-division')
  }

  public getById(id: number) {
    return this.http.get<TerritorialDivision>(this.serverUrl + 'territorial-division/' + id)
  }
  
  public create(country: TerritorialDivision) {
    return this.http.post<TerritorialDivision>(this.serverUrl + 'territorial-division', country)
  }
  
  public update(id: number, country: TerritorialDivision) {
    return this.http.put<TerritorialDivision>(this.serverUrl + 'territorial-division/' + id, country)
  }
  
  public delete(id: number): Observable<string> {
    return this.http.delete(this.serverUrl + 'territorial-division/' + id, { responseType:'text'})
  }
  
  public getByCountry(id: number) {
    return this.http.get<TerritorialDivision[]>(this.serverUrl + 'territorial-division/by-country/' + id)
  }
  
  public getTerritorialDivisionTypes() {
    return this.http.get<string[]>(this.serverUrl + 'territorial-division/territorial-division-types')
  }

}
