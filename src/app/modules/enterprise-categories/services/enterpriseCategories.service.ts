import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable, Output, EventEmitter, inject, signal  } from '@angular/core';
import { ApproversAndModeratorsEnterpriseCategory, EnterpriseCategory, EnterpriseCategorySend, EnterpriseCategorySubcategory, EnterpriseCategoryTableDouble, EnterpriseCategoryUpdate, IUpdateTags } from '@core/models/EnterpriseCategory';
import { environment } from '@core/environments/environment.development';
import { Observable } from 'rxjs';
import { EnterpriseCategoryDetailSend } from '@core/models/EnterpriseCategory';
import { IServiceCommon } from '@core/interfaces/service-common.interface';
import { IGenericTable } from '@core/interfaces/generic-table.interface';
import { ModalDeleteComponent } from '@shared/components/modal-delete/modal-delete.component';
import { IGenericModalForm } from '@core/interfaces/generic-modal-form.interface';

@Injectable({
  providedIn: 'root'
})
export class EnterpriseCategoryService implements IServiceCommon {

  public eventFormComponent = signal<IGenericModalForm>(null);
  public eventTableComponent = signal<IGenericTable>(null);
  public eventModalDeleteComponent = signal<ModalDeleteComponent>(null);
  @Output() eventModalApproverModeratorComponent: EventEmitter<any> = new EventEmitter();
  @Output() eventModalRolesComponent: EventEmitter<void> = new EventEmitter();
  @Output() eventOpenModalTagsComponent: EventEmitter<void> = new EventEmitter();

  private http = inject(HttpClient);

  private serverUrlEnterpriseCategory: string = environment.server_url + 'enterpriseCategory';
  private serverUrlEnterpriseCategoryDetail: string = environment.server_url + 'enterpriseCategoryDetail';
  
  public save(body: EnterpriseCategorySend): Observable<string> {
    return this.http.post(`${this.serverUrlEnterpriseCategory}/save`, body, { responseType: "text" });
  }

  public update(id: number, roles: EnterpriseCategoryUpdate) {
    return this.http.put<EnterpriseCategory>(`${this.serverUrlEnterpriseCategory}/${id}`, roles);
  }

  public delete(id: number) {
    return this.http.delete<string>(`${this.serverUrlEnterpriseCategory}/${id}`);
  }

  public listAsignation(id: number) {
    return this.http.get<EnterpriseCategoryTableDouble[]>(`${this.serverUrlEnterpriseCategory}/listAsignation/${id}`);
  }

  public getByEnterprise(enterpriseId: number) {
    return this.http.get<EnterpriseCategory[]>(`${this.serverUrlEnterpriseCategory}/by-enterprise/${enterpriseId}`);
  }
  
  public assignApproverModerator(body: EnterpriseCategoryDetailSend): Observable<string> {
    return this.http.post(`${this.serverUrlEnterpriseCategoryDetail}/assign-approver-moderator`, body, { responseType: "text" });
  }
  
  public getApproversAndModerators(body: EnterpriseCategorySubcategory) {
    const params: HttpParams = new HttpParams({fromObject: {...body}})
    return this.http.get<ApproversAndModeratorsEnterpriseCategory>(`${this.serverUrlEnterpriseCategoryDetail}/get-approver-moderator`, {params});
  }
  
  public updateTags(enterpriseCategoryId: number, body: IUpdateTags) {
    return this.http.put<void>(`${this.serverUrlEnterpriseCategory}/addTags/${enterpriseCategoryId}`, body);
  }
  
  public getTagsByTicketId(ticketId: number) {
    return this.http.get<void>(`${this.serverUrlEnterpriseCategory}/getTagsByTicketId/${ticketId}`);
  }
}
