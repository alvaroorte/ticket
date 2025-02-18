import { HttpClient } from '@angular/common/http';
import { Injectable, Output, EventEmitter, inject  } from '@angular/core';
import { EnterpriseCategoryDetail, EnterpriseCategoryDetailSend, ListSubcategoryBody } from '@core/models/EnterpriseCategoryDetail';
import { environment } from '@core/environments/environment.development';

@Injectable({
  providedIn: 'root'
})
export class EnterpriseCategoryDetailService {

  @Output() eventFormComponent: EventEmitter<any> = new EventEmitter();
  @Output() eventTableComponent: EventEmitter<any> = new EventEmitter();
  @Output() eventModalDeleteComponent: EventEmitter<any> = new EventEmitter();
  @Output() eventToolbarComponent: EventEmitter<any> = new EventEmitter();

  private http = inject(HttpClient);

  private serverUrl: string = environment.server_url;

  public create(data: EnterpriseCategoryDetailSend) {
    return this.http.post<void>(this.serverUrl + 'enterpriseCategoryDetail', data );
  }
  public update( idEnterpriseCategoryDetail: number, data: EnterpriseCategoryDetailSend) {
    return this.http.put<void>(this.serverUrl + 'enterpriseCategoryDetail/' + idEnterpriseCategoryDetail, data );
  }

  public listSubcategory(body: ListSubcategoryBody) {
    return this.http.post<EnterpriseCategoryDetail[]>(this.serverUrl + 'enterpriseCategoryDetail/listSubcategory', body );
  }
}
