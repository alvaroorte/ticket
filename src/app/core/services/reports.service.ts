import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { environment } from '@core/environments/environment.development';
import { AttachmenReport, IFiltersReport } from '@core/interfaces/reports.interface';

@Injectable({
   providedIn: 'root'
})
export class ReportsService {

   private http = inject(HttpClient);

   private serverUrlReports: string = environment.server_url + "ticketReport";

   public generatereportHistory(filters: IFiltersReport) {
      const params: HttpParams = new HttpParams({ fromObject: {...filters} });
      return this.http.get<AttachmenReport>(`${this.serverUrlReports}/history`, { params });
   }
   
   public generatereportTotals(filters: IFiltersReport) {
      const params: HttpParams = new HttpParams({ fromObject: { ...filters } });
      return this.http.get<AttachmenReport>(`${this.serverUrlReports}/totals`, { params });
   }
   
   public generatereportSubcategoryTotals(filters: IFiltersReport) {
      const params: HttpParams = new HttpParams({ fromObject: { ...filters } });
      return this.http.get<AttachmenReport>(`${this.serverUrlReports}/subcategoryTotals`, { params });
   }
   
   public generatereportTechnician(filters: IFiltersReport) {
      const params: HttpParams = new HttpParams({ fromObject: { ...filters } });
      return this.http.get<AttachmenReport>(`${this.serverUrlReports}/technician/response-time`, { params });
   }
   
   public generatereportAlertsEvents(filters: IFiltersReport) {
      const params: HttpParams = new HttpParams({ fromObject: { ...filters } });
      return this.http.get<AttachmenReport>(`${this.serverUrlReports}/alerts-events`, { params });
   }
}
