import { HttpClient } from '@angular/common/http';
import { Injectable, Output, EventEmitter, inject  } from '@angular/core';
import { Params } from '@angular/router';
import { SimpleResponse } from '@core/models/FieldsCommons';
import { Timeline } from '@core/models/Timeline';
import { DataOpenFormTicket, DerivationTicket, ListByTeam, Observator, ObservatorResponse, SendChangeTicket, Ticket, TicketByIdResponse, TicketFunctionSend, TicketOnDemandResponse, TicketResponse, TicketSend } from 'src/app/core/models/Ticket';
import { environment } from '@core/environments/environment.development';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class TicketsService {

  @Output() eventFormComponent: EventEmitter<any> = new EventEmitter();
  @Output() eventTableComponent: EventEmitter<any> = new EventEmitter();
  @Output() eventModalDeleteComponent: EventEmitter<any> = new EventEmitter();
  @Output() eventToolbarComponent: EventEmitter<any> = new EventEmitter();
  @Output() eventOpenInfoTicket: EventEmitter<any> = new EventEmitter();
  @Output() eventOpenFormTicket: EventEmitter<DataOpenFormTicket> = new EventEmitter();
  @Output() eventOpenTimeline: EventEmitter<any> = new EventEmitter();
  @Output() eventFilterTickets: EventEmitter<any> = new EventEmitter();
  @Output() eventOpenReportGantt: EventEmitter<any> = new EventEmitter();
  @Output() eventOpenModalTypeTicket: EventEmitter<any> = new EventEmitter();
  @Output() eventOpenModalDescription: EventEmitter<any> = new EventEmitter();

  private http = inject(HttpClient);

  private serverUrl: string = environment.server_url;
  params: Params = {};

  public getAll() {
    return this.http.get<Ticket[]>(this.serverUrl+'ticket');
  }

  public listByTeam(params: Params) {
    return this.http.get<ListByTeam>(this.serverUrl+'ticket/listByTeam', { params } );
  }

  public ticketList( params: Params ) {
    return this.http.get<TicketResponse[]>(`${this.serverUrl}ticket/ticketList`, { params });
  }

  public getById(id: number) {
    return this.http.get<TicketSend>(this.serverUrl + 'ticket/' + id)
  }

  public ticketById(id: number) {
    return this.http.get<TicketByIdResponse>(this.serverUrl + 'ticket/ticketById/' + id)
  }

  public listComments(id: number) {
    return this.http.get<Timeline[]>(this.serverUrl + 'ticket/listComments/' + id)
  }

  public ticketFunction(id: number, body: TicketFunctionSend) {
    return this.http.post<SimpleResponse>(this.serverUrl + 'ticket/ticketFunction/' + id, body);
  }

  public create(ticket: TicketSend) {
    return this.http.post<Ticket>(this.serverUrl + 'ticket', ticket);
  }

  public update(id: number, ticket: any) {
    return this.http.put<Ticket>(this.serverUrl + 'ticket/' + id, ticket)
  }

  public delete(id: number) {
    return this.http.delete(this.serverUrl + 'ticket/' + id)
  }

  public changeTechnical(idTicket: number, body: SendChangeTicket) {
    return this.http.put<SimpleResponse>(this.serverUrl + 'ticket/changeTechnical/' + idTicket, body)
  }

  public listOnDemand(params: any) {
    return this.http.get<TicketOnDemandResponse[]>(this.serverUrl + 'ticket/listOnDemand?', {params})
  }

  public derivationTicket(idTicket:number, body: DerivationTicket) {
    return this.http.post(this.serverUrl + 'ticket/derivationTicket/' + idTicket, body)
  }

  public createObserver(observator:Observator): Observable<ObservatorResponse> {
   return this.http.post<ObservatorResponse>(`${this.serverUrl}technicalChange/observer`,observator);
  }

  public deleteObserver(key: number): Observable<any> {
   return this.http.delete<any>(`${this.serverUrl}technicalChange/${key}`);
  }
}
