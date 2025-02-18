import { HttpClient } from '@angular/common/http';
import { Injectable, inject  } from '@angular/core';
import { environment } from '@core/environments/environment.development';
import { DataCommon } from '@core/models/FieldsCommons';

@Injectable({
  providedIn: 'root'
})
export class FlowStatusService {
  private http = inject(HttpClient);

  private serverUrl: string = environment.server_url;

  public listSelect(  ) {
    return this.http.get<DataCommon[]>(this.serverUrl+'flowStatus/listSelect');
  }
}
