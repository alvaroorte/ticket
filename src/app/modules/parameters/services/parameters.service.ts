import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable, Output, EventEmitter, inject, signal  } from '@angular/core';
import { Params } from '@angular/router';
import { IFolder, IParameterSelect, Parameter } from 'src/app/core/models/Parameter';
import { environment } from '@core/environments/environment.development';
import { Observable } from 'rxjs';
import { IServiceCommon } from '@core/interfaces/service-common.interface';
import { FoldersParametersEnum } from '@core/enums/folder-parameters.enum';
import { GenericTableComponent } from '@shared/components/generic-table/generic-table.component';
import { ModalDeleteComponent } from '@shared/components/modal-delete/modal-delete.component';
import { IGenericModalForm } from '@core/interfaces/generic-modal-form.interface';

@Injectable({
  providedIn: 'root'
})
export class ParameterService implements IServiceCommon {

  public eventFormComponent = signal<IGenericModalForm>(null);
  public eventTableComponent = signal<GenericTableComponent<Parameter>>(null);
  public eventModalDeleteComponent = signal<ModalDeleteComponent>(null);

  private http = inject(HttpClient);

  private serverUrlParameter: string = environment.server_url + 'parameter';
  params: Params = {};

  public getAll(folder: string) {
    const params: HttpParams = new HttpParams().set('folder', folder);
    return this.http.get<Parameter[]>(this.serverUrlParameter, { params });
  }

  public getById(id: number) {
    return this.http.get<Parameter>(`${this.serverUrlParameter}/${id}`);
  }

  public create(parameter: Parameter) {
    return this.http.post<Parameter>(`${this.serverUrlParameter}`, parameter);
  }

  public update(id: number, parameter: Parameter) {
    return this.http.put<Parameter>(`${this.serverUrlParameter}/${id}`, parameter);
  }

  public delete(id: number): Observable<string> {
    return this.http.delete(`${this.serverUrlParameter}/${id}`, { responseType:'text'});
  }
  
  public select(folders: FoldersParametersEnum[]) {
    const params: HttpParams = new HttpParams().set('folder', folders.join(','));
    return this.http.get<IParameterSelect[]>(`${this.serverUrlParameter}/select`, {params} );
  }

  public getListFolder() {
    return this.http.get<IFolder[]>(`${this.serverUrlParameter}/folders`);
  }
}
