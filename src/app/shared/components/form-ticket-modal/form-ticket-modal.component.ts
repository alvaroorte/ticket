import { CommonModule } from '@angular/common';
import { Component, EventEmitter, OnInit, Output, inject, signal } from '@angular/core';
import { DataOpenFormTicket } from '@core/models/Ticket';
import { TicketsService } from '@ticket-historical/services/tickets-.service';
import { DialogModule } from 'primeng/dialog';
import { HomeComponent } from 'src/app/modules/home/home.component';

@Component({
  selector: 'app-form-ticket-modal',
  standalone: true,
  imports: [ CommonModule, DialogModule, HomeComponent ],
  templateUrl: './form-ticket-modal.component.html'
})
export class FormTicketModalComponent implements OnInit {

  @Output() reloadTicketsCard = new EventEmitter();

  private ticketService = inject(TicketsService);
  public titleSidebar = signal<string>('');
  public modalformTicketVisible = false;
  public data!: DataOpenFormTicket;

  ngOnInit(): void {
    this.ticketService.eventOpenFormTicket.subscribe( (res) => {
      this.openFormTicket(res)
    });
  }

  private openFormTicket( data: DataOpenFormTicket ) {
    this.data = data;
    this.titleSidebar.set( this.data.isDerivation? 'Derivar ticket':'Crear ticket asociado a: ' + this.data.dataTicket.title);
    this.modalformTicketVisible = true;
  }

  public ticketCreated() {
    this.reloadTicketsCard.emit();
    this.hideSidebarformTicketVisible();
  }

  private hideSidebarformTicketVisible() {
    this.modalformTicketVisible = false;
  }
}
