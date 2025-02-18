import { Component, EventEmitter, Input, Output } from '@angular/core';
import { TicketByTeam } from '@core/models/Ticket';

@Component({
  selector: 'app-card',
  templateUrl: './card.component.html'
})
export class CardComponent {

  @Input({ required: true }) ticket!: TicketByTeam;
  @Output() eventOpenModalTimeline = new EventEmitter<number>();
  @Output() eventOpenModalInfo = new EventEmitter<number>();

  openModalTimeline(idTicket: number) {
    this.eventOpenModalTimeline.emit(idTicket);
  }

  openModalInfo(idTicket: number) {
    this.eventOpenModalInfo.emit(idTicket);
  }
}
