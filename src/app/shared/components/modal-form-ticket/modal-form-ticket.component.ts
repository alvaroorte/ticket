
import { Component, OnInit, inject, signal, output } from '@angular/core';
import { DataOpenFormTicket } from '@core/models/Ticket';
import { TicketService } from '@ticket-historical/services/tickets.service';
import { DialogModule } from 'primeng/dialog';
import { HomeComponent } from 'src/app/modules/home/home.component';

@Component({
    selector: 'app-modal-form-ticket',
    imports: [DialogModule, HomeComponent],
    templateUrl: './modal-form-ticket.component.html'
})
export class ModalFormTicketComponent implements OnInit {

  readonly eventTicketAsociatedORDerivated = output();

  private ticketService = inject(TicketService);
  public titleModal = signal<string>('');
  public modalformTicketVisible = false;
  public data!: DataOpenFormTicket;

  ngOnInit(): void {
    this.ticketService.eventOpenFormTicket.subscribe( (res) => {
      this.openFormTicket(res)
    });
  }

  private openFormTicket( data: DataOpenFormTicket ) {
    this.data = data;
    this.titleModal.set('Crear ticket asociado a: ' + this.data.dataTicket.title);
    this.modalformTicketVisible = true;
  }

  public ticketAsociatedORDerivated() {
    this.eventTicketAsociatedORDerivated.emit();
    this.hideSidebarformTicketVisible();
  }

  private hideSidebarformTicketVisible() {
    this.modalformTicketVisible = false;
  }
}
