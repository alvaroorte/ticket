import { Component, inject, signal, input, output } from '@angular/core';
import { Table } from 'primeng/table';
import { TicketService } from '@ticket-historical/services/tickets.service';
import { TicketFunctionArrays, TicketResponse, TicketSolutionProjection } from '@core/models/Ticket';
import { HttpParamsTicketList, INextFunction } from '@core/interfaces/ticket.interface';
import { PrimeModules } from '@shared/prime-components/prime-components.module';
import { PipesModule } from '@core/pipes/pipes.module';
import { FormsModule } from '@angular/forms';
import { nameFunction } from '@core/interfaces/buttons-ticket.interface';
import { buttonsTicketsComponent } from '../buttons-tickets/buttons-tickets.component';
import { ButtonModule } from 'primeng/button';
import { RippleModule } from 'primeng/ripple';
import { LABELS } from '@core/constants/labels';
import { TOOLTIPS } from '@core/constants/tooltips';
import { MESSAGES } from '@core/constants/messages';


@Component({
    selector: 'app-table-tickets',
    imports: [PrimeModules, PipesModule, FormsModule, buttonsTicketsComponent, ButtonModule, RippleModule],
    templateUrl: './table-tickets.component.html',
})

export class TableTicketsComponent {

  readonly tickets = input.required<TicketResponse[]>();
  readonly isViewPending = input<boolean>(false);
  readonly onReloadTickets = output<HttpParamsTicketList>();
  readonly onPlayNextFunctionTicket = output<INextFunction>();

  private ticketService = inject(TicketService);

  public ticketSelected: TicketResponse = new TicketResponse();
  public firstPage = 0;
  public rows = 10;
  public optionsPage = signal([5, 10, 20]);
  public loading = signal(false);
  public ticketId = signal<number>(0);
  public nameFunction = signal('');
  public titleModalDescription = signal('');
  public solutionTemp!: TicketSolutionProjection;
  public titleTicket = signal<string>('');
  public selectorTicketFunction = signal(new TicketFunctionArrays);
  public readonly tooltipSearch = TOOLTIPS.thisFieldSearchOFTicketTable;;
  public readonly labels = LABELS;
  public readonly tooltips = TOOLTIPS;
  public readonly messages = MESSAGES;

  public onGlobalFilter(table: Table, event: Event) {
    table.filterGlobal((event.target as HTMLInputElement).value, 'contains');
  }

  public reload (): void {
    this.firstPage = 0;
    this.reloadTickets();
  }

  public onRowSelect() {
    this.openModalInfo(this.ticketSelected.id);
  }

  public reloadTickets(): void {
    const params: HttpParamsTicketList = {
      sortBy: '',
      sortOrder: ''
    };
    this.onReloadTickets.emit(params);
  }

  public openModalInfo ( ticketId: number ) {
    this.ticketService.eventOpenInfoTicket.emit(ticketId);
  }

  public playNextFunctionTicket(ticketId: number, nameFunction: nameFunction, ticketCode : string) {
    const data: INextFunction = {
      ticketId,
      function: nameFunction,
      ticketCode
    };
    this.onPlayNextFunctionTicket.emit(data);
  }

}
