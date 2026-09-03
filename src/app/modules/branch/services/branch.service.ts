import { HttpClient } from '@angular/common/http';
import { Injectable, Output, EventEmitter, inject, signal  } from '@angular/core';
import { environment } from '@core/environments/environment.development';
import { Observable } from 'rxjs';
import { Branch, BranchWithSchedule } from '@core/interfaces/branch.interface';
import { IServiceCommon } from '@core/interfaces/service-common.interface';
import { GenericTableComponent } from '@shared/components/generic-table/generic-table.component';
import { ModalDeleteComponent } from '@shared/components/modal-delete/modal-delete.component';
import { IGenericModalForm } from '@core/interfaces/generic-modal-form.interface';

@Injectable({
  providedIn: 'root'
})
export class BranchService implements IServiceCommon {

  public eventFormComponent = signal<IGenericModalForm>(null);
  public eventTableComponent = signal<GenericTableComponent<Branch>>(null);
  public eventModalDeleteComponent = signal<ModalDeleteComponent>(null);

  private http = inject(HttpClient);

  private serverUrl: string = environment.server_url;

  public getAll() {
    return this.http.get<Branch[]>(this.serverUrl+'branch')
  }

  public getById(id: number) {
    return this.http.get<BranchWithSchedule>(this.serverUrl + 'branch/' + id)
  }
  
  public create(country: Branch) {
    return this.http.post<Branch>(this.serverUrl + 'branch', country)
  }
  
  public update(id: number, country: Branch) {
    return this.http.put<Branch>(this.serverUrl + 'branch/' + id, country)
  }
  
  public delete(id: number): Observable<string> {
    return this.http.delete(this.serverUrl + 'branch/' + id, { responseType:'text'})
  }
  
  public getByEnterprise(id: number) {
    return this.http.get<Branch[]>(this.serverUrl + 'branch/by-enterprise/' + id)
  }

}
