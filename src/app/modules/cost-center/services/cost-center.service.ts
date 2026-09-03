import { HttpClient } from '@angular/common/http';
import { Injectable, Output, EventEmitter, inject, signal  } from '@angular/core';
import { environment } from '@core/environments/environment.development';
import { Observable } from 'rxjs';
import { IServiceCommon } from '@core/interfaces/service-common.interface';
import { ICostCenter, IUploadExcelCostCenter } from '@core/interfaces/cost-center.inteface.';
import { AttachmenReport } from '@core/interfaces/reports.interface';
import { GenericTableComponent } from '@shared/components/generic-table/generic-table.component';
import { ModalDeleteComponent } from '@shared/components/modal-delete/modal-delete.component';
import { IGenericModalForm } from '@core/interfaces/generic-modal-form.interface';

@Injectable({
  providedIn: 'root'
})
export class CostCenterService implements IServiceCommon {

  public eventFormComponent = signal<IGenericModalForm>(null);
  public eventTableComponent = signal<GenericTableComponent<ICostCenter>>(null);
  public eventModalDeleteComponent = signal<ModalDeleteComponent>(null);
  @Output() eventOpenModalFile: EventEmitter<void> = new EventEmitter();

  private http = inject(HttpClient);

  private urlCostCenter: string = environment.server_url + 'cost-center';

  public getById(id: number) {
    return this.http.get<ICostCenter>(`${this.urlCostCenter}/${id}`)
  }

  public create(team: ICostCenter) {
    return this.http.post<ICostCenter>(this.urlCostCenter, team)
  }

  public update(id: number, team: ICostCenter) {
    return this.http.put<ICostCenter>(`${this.urlCostCenter}/${id}`, team)
  }

  public delete(id: number): Observable<string> {
    return this.http.delete(`${this.urlCostCenter}/${id}`, { responseType:'text'})
  }
  
  public getByEnterprise(enterpriseId: number) {
    return this.http.get<ICostCenter[]>(`${this.urlCostCenter}/by-enterprise/${enterpriseId}`)
  }
  
  public getSelectByEnterprise(enterpriseId: number) {
    return this.http.get<ICostCenter[]>(`${this.urlCostCenter}/select/by-enterprise/${enterpriseId}`)
  }
 
  public exportExcel() {
    return this.http.get<AttachmenReport>(`${this.urlCostCenter}/exportExcel`)
  }
  
  public uploadExcel(body: IUploadExcelCostCenter) {
    return this.http.post<void>(`${this.urlCostCenter}/uploadExcel`, body)
  }
}
