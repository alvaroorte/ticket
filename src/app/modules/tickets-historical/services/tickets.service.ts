import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable, Output, EventEmitter, inject  } from '@angular/core';
import { DataOpenFormTicket, DerivationTicket, addObservers, Ticket, TicketResponse, TicketSend, Observer, TicketById, BodyChangeTechnical, EstimateDates, IncidentDates } from 'src/app/core/models/Ticket';
import { environment } from '@core/environments/environment.development';
import { Observable } from 'rxjs';
import { HttpParamsTicketList, IBodychangeApproverOrModerator, IBodyModifyPriority, IFiltersTicketsHistorical, INextFunction, InfoOpenModalCommon, InfoOpenModalDescription, InfoOpenModalPriority, TicketByTeam, TicketHistory } from '@core/interfaces/ticket.interface';
import { IPageable } from '@core/interfaces/pageable.interface';
import { IParameterSelect } from '@core/models/Parameter';

@Injectable({
  providedIn: 'root'
})
export class TicketService {

  @Output() eventOpenInfoTicket: EventEmitter<number> = new EventEmitter();
  @Output() eventOpenFormTicket: EventEmitter<DataOpenFormTicket> = new EventEmitter();
  @Output() eventOpenTimeline: EventEmitter<InfoOpenModalCommon> = new EventEmitter();
  @Output() eventOpenModalDescription: EventEmitter<InfoOpenModalDescription> = new EventEmitter();
  @Output() eventCloseModalDescription: EventEmitter<void> = new EventEmitter();
  @Output() eventOpenModalMessages: EventEmitter<InfoOpenModalCommon> = new EventEmitter();
  @Output() eventOpenModalPriority: EventEmitter<InfoOpenModalPriority> = new EventEmitter();
  @Output() eventOpenModalApproverModerator: EventEmitter<TicketHistory> = new EventEmitter<TicketHistory>();
  @Output() eventOpenModalDeribation: EventEmitter<TicketById> = new EventEmitter<TicketById>();

  private http = inject(HttpClient);

  private serverUrlTicket: string = environment.server_url + "ticket";
  private serverUrl: string = environment.server_url;
  
  public ticketListRequester(paramsTicketList: HttpParamsTicketList) {
    const params: HttpParams = new HttpParams({ fromObject: {...paramsTicketList} })
    return this.http.get<TicketResponse[]>(`${this.serverUrlTicket}/requester`, { params });
  }
  
  public ticketListTechnician(paramsTicketList: HttpParamsTicketList) {
    const params: HttpParams = new HttpParams({ fromObject: {...paramsTicketList} })
    return this.http.get<TicketResponse[]>(`${this.serverUrlTicket}/technician`, { params });
  }
  
  public ticketListApprover(paramsTicketList: HttpParamsTicketList) {
    const params: HttpParams = new HttpParams({ fromObject: {...paramsTicketList} })
    return this.http.get<TicketResponse[]>(`${this.serverUrlTicket}/approver-moderator`, { params });
  }

  public getById(ticketId: number) {
    return this.http.get<TicketById>(`${this.serverUrlTicket}/${ticketId}`)
  }

  public createRequest(ticket: TicketSend) {
    return this.http.post<Ticket>(`${this.serverUrlTicket}/request`, ticket);
  }
  
  public createIncident(ticket: TicketSend) {
    return this.http.post<Ticket>(`${this.serverUrlTicket}/incident`, ticket);
  }

  public derivationTicket(body: DerivationTicket) {
    return this.http.post(`${this.serverUrlTicket}/recategorize`, body)
  }
  
  public getByTeam(teamId: number) {
    return this.http.get<TicketByTeam[]>(`${this.serverUrlTicket}/by-team/${teamId}`);
  }
  
  public assignments(enterpriseId: number, teamId: number, supervisor: boolean) {
    let params: HttpParams = new HttpParams().set('supervisor', supervisor);
    params = enterpriseId? params.set('enterpriseId', enterpriseId): params;
    params = teamId? params.set('teamId', teamId): params;
    return this.http.get<TicketByTeam[]>(`${this.serverUrlTicket}/assignments`, {params});
  }
  
  public getHistory(filters: IFiltersTicketsHistorical) {
    const params: HttpParams = new HttpParams({ fromObject: {...filters} });
    return this.http.get<IPageable<TicketHistory>>(`${this.serverUrlTicket}/history`, { params });
  }
  
  public getHistoryPageable(params: HttpParams) {
    return this.http.get<IPageable<TicketHistory>>(`${this.serverUrlTicket}/history`, { params });
  }
  
  public modifyPriority(body: IBodyModifyPriority) {
    return this.http.patch(`${this.serverUrlTicket}/modify-priority`, body);
  }

  public ticketFunction(body: INextFunction): Observable<string> {
    return this.http.post(this.serverUrl + 'flowConfigurations/function', body, { responseType: 'text' });
  }
  
  public changeTechnical(body: BodyChangeTechnical) {
    return this.http.post(this.serverUrl + 'technicalChange/technician', body)
  }
  
  public createObservers(body: addObservers): Observable<string[]> {
    return this.http.post<string[]>(`${this.serverUrl}technicalChange/observer`, body);
  }
  
  public getObserversByTicket(ticketId: number): Observable<Observer[]> {
    return this.http.get<Observer[]>(`${this.serverUrl}technicalChange/observers/by-ticket/${ticketId}`);
  }
  
  public changeApprover(body: IBodychangeApproverOrModerator) {
    return this.http.post(this.serverUrl + 'technicalChange/approver', body)
  }
  
  public changeModerator(body: IBodychangeApproverOrModerator) {
    return this.http.post(this.serverUrl + 'technicalChange/moderator', body)
  }

  public addEstimateDates(ticketId: number, body: EstimateDates): Observable<void> {
    return this.http.put<void>(`${this.serverUrlTicket}/estimateDates/${ticketId}`, body);
  }
  
  public updateIncidentDates(ticketId: number, body: IncidentDates): Observable<void> {
    return this.http.put<void>(`${this.serverUrlTicket}/incident/${ticketId}`, body);
  }
  
  public getAvailableTagsByTicketId(ticketId: number) {
    return this.http.get<IParameterSelect[]>(`${this.serverUrlTicket}/getAvailableTagsByTicketId/${ticketId}`);
  }
  
  public setTagToTicket(ticketId: number, parameterId: number) {
    const params: HttpParams = new HttpParams().set('tagId', parameterId);
    return this.http.put<void>(`${this.serverUrlTicket}/setTagToTicket/${ticketId}`, null, {params});
  }

}
