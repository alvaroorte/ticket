import { Component, inject, OnChanges, signal, input, output } from '@angular/core';
import { NgClass } from '@angular/common';
import { buttonBase, nameFunction } from '@core/interfaces/buttons-ticket.interface';
import { TooltipModule } from 'primeng/tooltip';
import { buttonsOfTickets} from '@core/constants/buttons-ticket';
import { ButtonModule } from 'primeng/button';
import { RippleModule } from 'primeng/ripple';
import { TicketResponse } from '@core/models/Ticket';
import { TOOLTIPS } from '@core/constants/tooltips';
import { InfoOpenModalCommon, InfoOpenModalPriority } from '@core/interfaces/ticket.interface';
import { TicketService } from '@ticket-historical/services/tickets.service';
import { STATES_TICKET_ENUM } from '@core/enums/ticket';
import { OverlayBadgeModule } from 'primeng/overlaybadge';
import { MessageWsService } from '@core/services/message.service';

@Component({
    selector: 'app-buttons-tickets',
    imports: [TooltipModule, ButtonModule, RippleModule, OverlayBadgeModule, NgClass],
    templateUrl: './buttons-tickets.component.html',
    styleUrls: ['./buttons-tickets.component.scss']
})
export class buttonsTicketsComponent implements OnChanges {

  readonly ticket = input.required<TicketResponse>();
  readonly isViewPending = input<boolean>(false);
  readonly onEventButton = output<nameFunction>();

  private ticketService = inject(TicketService);
  private messageWsService = inject(MessageWsService);

  public buttons = signal<buttonBase[]>([]);
  public readonly tooltips = TOOLTIPS;
  public readonly statesForShowChangePriority: string[] = [
    STATES_TICKET_ENUM.TECH_PENDING, 
    STATES_TICKET_ENUM.TECH_ASSIGNED, 
    STATES_TICKET_ENUM.RECATEGORIZATION
  ];

  get amountMessageUnreadByTicket(): number {
    return this.messageWsService.ticketsUnread().find(t => t.ticketId == this.ticket().id)?.unread;
  }

  ngOnChanges(): void {
    this.getButtonsByFunctions();
  }

  public playNextFunctionTicket( functionText: nameFunction ) {
    this.onEventButton.emit(functionText);
  }

  private getButtonsByFunctions() {
    let buttons: buttonBase[] = [];
    this.ticket().functions.forEach( f => {
      buttons.push(buttonsOfTickets[f])
    })
    this.buttons.set(buttons);
  }

  public openModalPriority(ticketId: number, priorityId: number) {
    const dataPriority: InfoOpenModalPriority = {
      ticketId: ticketId,
      priorityId: priorityId
    }
    this.ticketService.eventOpenModalPriority.emit(dataPriority);
  }

  public openModalTimeLine ( ticketId: number, ticketTitle: string ) {
    const data: InfoOpenModalCommon = {
      ticketId,
      ticketTitle
    };
    this.ticketService.eventOpenTimeline.emit(data);
  }
  
  public openModalMessages ( ticketId: number, ticketTitle: string ) {
    const data: InfoOpenModalCommon = {
      ticketId,
      ticketTitle
    };
    this.ticketService.eventOpenModalMessages.emit(data);
  }

}
