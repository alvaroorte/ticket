import { Component, inject, signal } from '@angular/core';
import { TicketsService } from '../../services/tickets-.service';
import { HelpersService } from 'src/app/core/services/helpers.service';
import { TableComponent } from '../table/table.component';
import { ReportService } from 'src/app/modules/reports/services/report.service';

@Component({
  selector: 'app-toolbar',
  templateUrl: './toolbar.component.html'
})
export class ToolbarComponent {

  public ticketsService = inject(TicketsService);
  public reportService = inject(ReportService);
  private helpersService = inject(HelpersService);

  idTicket = signal<number>(0);
  titleTicket = signal<string>('');

  tableComponent!: TableComponent;

  ngOnInit() {
    this.ticketsService.eventTableComponent.subscribe((tableComponent) => {
      this.tableComponent = tableComponent;
    });
  }

  reload() {
    this.tableComponent.reload();
  }

  showInfoTicket() {
    if ( this.tableComponent.selectedTicket() && this.tableComponent.selectedTicket().ticketId ) {
      this.idTicket.set(this.tableComponent.selectedTicket().ticketId!);
      this.ticketsService.eventOpenInfoTicket.emit();
    } else {
      this.helpersService.messageNotification("warn", "Por favor", `Seleccione un Ticket`, 3000);
    }
  }

  showTimeline() {
    if ( this.tableComponent.selectedTicket() && this.tableComponent.selectedTicket().ticketId ) {
      this.idTicket.set(this.tableComponent.selectedTicket().ticketId!);
      this.titleTicket.set(this.tableComponent.selectedTicket().title!);
      this.ticketsService.eventOpenTimeline.emit();
    } else {
      this.helpersService.messageNotification("warn", "Por favor", `Seleccione un Ticket`, 3000);
    }
  }
}
