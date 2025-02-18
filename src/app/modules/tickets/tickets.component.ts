import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TicketsCardComponent } from '@ticketCard/tickets-card.component';
import { TicketsModule } from './tickets.module';
import { TicketsTableComponent } from '../tickets-table/tickets-table.component';

@Component({
   selector: 'app-tickets',
   standalone: true,
   imports: [CommonModule, TicketsCardComponent, TicketsTableComponent, TicketsModule],
   templateUrl: './tickets.component.html'
})
export class TicketsComponent {

   @Input() typeTicketCard?: string;

   public typeShowSelection: boolean = false;
   public showSwitch: boolean = false;
   public showOptions: any[] = [
      { label: 'Tarjetas', value: false },
      { label: 'Tabla', value: true }
   ];

   ngOnChanges() {
      if (this.typeTicketCard == 'ticket') {
         this.typeShowSelection = false;
         this.showSwitch = false;
      } else {
         this.showSwitch = true;
      }
   }
}
