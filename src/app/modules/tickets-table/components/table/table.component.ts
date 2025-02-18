import { Component, inject, signal, OnInit } from '@angular/core';
import { Table } from 'primeng/table';
import { HelpersService } from 'src/app/core/services/helpers.service';
import { TicketsService } from '@ticket-historical/services/tickets-.service';
import { Params } from '@angular/router';
import { Ticket, TicketFunctionArrays, TicketFunctionSend, TicketResponse, TicketSolutionProjection } from '@core/models/Ticket';
import { MenuItem } from 'primeng/api';
import { SimpleResponse } from '@core/models/FieldsCommons';
import { DatePipe } from '@angular/common';


@Component({
  selector: 'app-table',
  templateUrl: './table.component.html',
  styleUrls: ['./table.component.scss'],
  providers: [ DatePipe ]
})

export class TableComponent implements OnInit {

  private ticketsService = inject(TicketsService);
  private helpersService = inject(HelpersService);

  public tickets = signal<TicketResponse[]>([]);
  public ticketSelected = signal<TicketResponse>(new TicketResponse);
  public firstPage = 0;
  public rows = 10;
  public optionsPage = signal([5, 10, 20]);
  public loading = signal(false);
  public selectedIdTeam: number = 0;
  public teams: MenuItem[] = [];
  public activeTeam: MenuItem | undefined;
  public idTicket = signal<number>(0);

  public sidebarInfoVisible = signal<boolean>(false);
  public nameFunction = signal('');
  public namePreFunction = signal('');
  public titleModalDescription = signal('');
  public solutionTemp!: TicketSolutionProjection;
  public titleTicket = signal<string>('');
  public sidebarformTicketVisible: boolean = false;
  public selectorTicketFunction = signal(new TicketFunctionArrays);

  ngOnInit() {
    this.getAll();
  }

  getAll(): void {
    this.loading.set(true);
    let params: Params = {
      isApplicant: false,
      teamId: this.selectedIdTeam,
      orderField: '',
      sort: ''
    }
    this.ticketsService.ticketList(params).subscribe({
      next: (res: TicketResponse[]) => {
          this.loading.set(false);
          this.tickets.set(res) ;
            this.selectedIdTeam == 0? this.getTeamsByTickets(): '';
        },
        error: (err) => {
            console.log(err);
            this.helpersService.messageNotification("error", 'Error', err.message, 3000);
        }
    });
  }

  onGlobalFilter(table: Table, event: Event) {
    table.filterGlobal((event.target as HTMLInputElement).value, 'contains');
  }

  clear(table: Table) {
      table.clear();
  }

  reload (): void {
    this.getAll();
    this.firstPage = 0;
    this.onRowUnselect();
  }

  onRowSelect(event: any) {
    this.ticketSelected.set(event.data);
    this.openInfoSidebar(this.ticketSelected().ticket!);
  }

  onRowUnselect() {
    this.ticketSelected.set(new TicketResponse);
  }

  getTeamsByTickets() {
    let teams: MenuItem[] = [{
        label: "Todos",
        icon: 'pi pi-users',
        command: () => {
          this.changeTeam(0);
        }
    }]
    this.tickets().forEach( ticket => {
        if (!teams.find( team => team.label == ticket.team! )) {
            teams.push({
                label: ticket.team!,
                icon: 'pi pi-users',
                command: () => {
                    this.changeTeam(ticket.teamId!);
                }
            })
        }
      });
      this.teams = teams;
      this.activeTeam = this.teams[0];
  }

  changeTeam(idTeam: number) {
      this.selectedIdTeam = idTeam;
      this.getAll();
  }

  openInfoSidebar ( ticketId: number ) {
    this.idTicket.set(ticketId);
    this.ticketsService.eventOpenInfoTicket.emit();
  }

  openTimelineSidebar ( idTicket: number, title: string ) {
    this.idTicket.set(idTicket);
    this.titleTicket.set(title);
    this.ticketsService.eventOpenTimeline.emit();
  }

  openModalGantt ( idTicket: number, title: string ) {
    this.idTicket.set(idTicket);
    this.titleTicket.set(title);
    this.ticketsService.eventOpenReportGantt.emit();
  }

  ticketFuncion( idTicket: number, typeTicket: string, nameFunction: string, namePreFunction: string ) {
    this.idTicket.set(idTicket);
    if ( typeTicket == 'No definido') {
        this.ticketsService.eventOpenModalTypeTicket.emit();
        this.nameFunction.set(nameFunction);
        this.namePreFunction.set(namePreFunction);
    } else {
        let ticketFunctionSend: TicketFunctionSend = new TicketFunctionSend;
        ticketFunctionSend.function = ( namePreFunction )? namePreFunction: nameFunction;
        this.ticketsService.ticketFunction( this.idTicket(), ticketFunctionSend ).subscribe({
            next: (res: SimpleResponse) => {
                ( res.title )? this.modalDescription( nameFunction, this.idTicket(), res): this.helpersService.messageNotification("success", "Correcto", res.message!, 3000);
                this.emitReloadTicketsCard();
            },
            error: (err) => {
                console.log(err);
                this.helpersService.messageNotification("error", 'Error', err.message, 3000);
            }
        })
    }
}

emitReloadTicketsCard() {
    this.reload();
}

modalDescription ( nameFunction:string, idTicket:number, data: SimpleResponse ) {
    this.selectorTicketFunction.set(this.helpersService.getArraysByTicketFunction(data.selector));
    this.nameFunction.set(nameFunction);
    this.titleModalDescription.set(data.title);
    this.solutionTemp = data.solutionTemp;
    this.idTicket.set(idTicket);
    this.ticketsService.eventOpenModalDescription.emit();
}

stringToObject(text: string | null) {
    return JSON.parse(text as string);
}

saveTypeTicket(ticket: Ticket) {
    this.ticketFuncion(ticket.id!, ticket.typeTicket!, this.nameFunction(), this.namePreFunction());
}
}
