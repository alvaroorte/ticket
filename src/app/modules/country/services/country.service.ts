import { HttpClient } from '@angular/common/http';
import { Injectable, Output, EventEmitter, inject, signal  } from '@angular/core';
import { environment } from '@core/environments/environment.development';
import { Observable } from 'rxjs';
import { Country } from '@core/models/country';
import { IServiceCommon } from '@core/interfaces/service-common.interface';
import { GenericTableComponent } from '@shared/components/generic-table/generic-table.component';
import { ModalDeleteComponent } from '@shared/components/modal-delete/modal-delete.component';
import { IGenericModalForm } from '@core/interfaces/generic-modal-form.interface';

@Injectable({
  providedIn: 'root'
})
export class CountryService implements IServiceCommon {

  public eventFormComponent = signal<IGenericModalForm>(null);
  public eventTableComponent = signal<GenericTableComponent<Country>>(null);
  public eventModalDeleteComponent = signal<ModalDeleteComponent>(null);

  private http = inject(HttpClient);

  private serverUrl: string = environment.server_url;

  public getAll() {
    return this.http.get<Country[]>(this.serverUrl+'country')
  }

  public getById(id: number) {
    return this.http.get<Country>(this.serverUrl + 'country/' + id)
  }

  public create(country: Country) {
    return this.http.post<Country>(this.serverUrl + 'country', country)
  }

  public update(id: number, country: Country) {
    return this.http.put<Country>(this.serverUrl + 'country/' + id, country)
  }

  public delete(id: number): Observable<string> {
    return this.http.delete(this.serverUrl + 'country/' + id, { responseType:'text'})
  }


}
