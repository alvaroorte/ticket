import { HttpClient } from '@angular/common/http';
import { Injectable, Output, EventEmitter, inject  } from '@angular/core';
import { environment } from '@core/environments/environment.development';
import { DashboardResponse, LisInformationSystem, ReportSendParams } from '@core/models/Report';

@Injectable({
  providedIn: 'root'
})
export class ReportService {

  @Output() changeDataGraphics = new EventEmitter();

  private http = inject(HttpClient);

  private serverUrl: string = environment.server_url;

  public listInformationSystem(filters: any | null = null) {
    return this.http.get<LisInformationSystem>(this.serverUrl+'report/listInformationSystem', { params : filters})
  }

  public getDashboard(params: any) {
    return this.http.get<DashboardResponse>(this.serverUrl+'report/getDashboard', { params })
  }
}
