import { Component, ViewChild, inject, signal } from '@angular/core';
import { TicketsService } from '../../services/tickets-.service';
import { TicketByTeam } from 'src/app/core/models/Ticket';
import { Table } from 'primeng/table';
import { HelpersService } from 'src/app/core/services/helpers.service';

@Component({
  selector: 'app-table',
  templateUrl: './table.component.html'
})
export class TableComponent {

  @ViewChild('tbOnDemand') dataTable!: Table;

  private ticketsService = inject(TicketsService);
  private helpersService = inject(HelpersService);

  tickets = signal<TicketByTeam[]>([]);
  selectedTicket = signal<TicketByTeam>( new TicketByTeam );
  firstPage = 0;
  rows = 10;
  optionsPage = signal([5, 10, 20]);
  loading = signal(false);
  totalRecords!: number;
  fieldFilters = {
    enterpriseId: '',
    code: '',
    categoryId: '',
    subCategoryId: '',
    statusId: '',
    initialDate: '',
    endDate: ''
  }

  ngOnInit() {
    this.ticketsService.eventTableComponent.emit(this);
    this.ticketsService.eventFilterTickets.subscribe( (res) => {
      this.fieldFilters = res;
      this.reload();
    })
  }

  onGlobalFilter(table: Table, event: Event) {
    table.filterGlobal((event.target as HTMLInputElement).value, 'contains');
  }

  clear(table: Table) {
      table.clear();
  }

  reload (): void {
    this.firstPage = 0;
    this.rows = 10;
    this.dataTable.onLazyLoad.emit({ first: this.firstPage, rows: this.rows, globalFilter: '' });
  }

  onRowSelect(event: any) {
    this.selectedTicket.set(event.data);
  }

  onRowUnselect() {
    this.selectedTicket.set(new TicketByTeam);
  }

  loadTickets(event: any) {
    this.loading.set(true);
    let params: any = {
      sortBy: event.sortField?? '',
      sortOrder: event.sortOrder == 1? 'asc': 'desc',
      page: event.first == 0? 0: (event.first/event.rows),
      size: event.rows,
      search: event.globalFilter? event.globalFilter: ''
    }
    params = Object.assign({}, params, this.fieldFilters);
    this.ticketsService.listByTeam(params).subscribe({
      next: (res) => {
        this.tickets.set(res.ticketTeam?? []);
        this.totalRecords = this.tickets().length > 0? this.tickets()[0].totalRecords: 0;
        this.loading.set(false);
      }, error: (err) => {
        this.loading.set(false);
        this.tickets.set([]);
        console.log(err);
        this.helpersService.messageNotification("error", 'Error', err.message, 3000);
      }
    });
  }
}
