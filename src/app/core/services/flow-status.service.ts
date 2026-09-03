import { HttpClient } from '@angular/common/http';
import { Injectable, inject  } from '@angular/core';
import { environment } from '@core/environments/environment.development';
import { FlowStatus } from '@core/interfaces/flow.interface';

@Injectable({
  providedIn: 'root'
})
export class FlowStatusService {
  private http = inject(HttpClient);

  private serverUrlFlowStatus: string = environment.server_url + "flowStatus";

  public getSelect() {
    return this.http.get<FlowStatus[]>(`${this.serverUrlFlowStatus}/select`);
  }
}
