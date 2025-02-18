import { Component, Input, OnChanges, inject, signal } from '@angular/core';
import { TicketsCardModule } from './tickets-card.module';
import { TicketsService } from '@ticket-historical/services/tickets-.service';
import { TicketResponse } from '@core/models/Ticket';
import { HelpersService } from '@core/services/helpers.service';
import { DatePipe } from '@angular/common';
import { MenuItem } from 'primeng/api';
import { Params } from '@angular/router';

@Component({
    selector: 'app-tickets-card',
    standalone: true,
    imports: [ TicketsCardModule ],
    templateUrl: './tickets-card.component.html',
    providers: [ DatePipe ]
})
export class TicketsCardComponent implements OnChanges {

    @Input() typeTicketCard?: string;

    public orderFields: any[] = [
        { name: 'Prioridad', code: 'ranking' },
        { name: 'Estado', code: 'status' },
        { name: 'Técnico', code: 'technical' },
        { name: 'Solicitante', code: 'applicant' },
        { name: 'Empresa', code: 'enterprise' },
        { name: 'Fecha', code: 'created' }
    ];
    public selectedOrderField: string = '';
    public searchInput: string = '';
    private selectedSort: string = '';
    public selectedIdTeam: string = '0';

    private ticketsService = inject(TicketsService);
    private helpersService = inject(HelpersService);

    private ticketsBase = signal<TicketResponse[]>([]);
    public tickets = signal<TicketResponse[]>([]);
    public teams: MenuItem[] = [];
    public activeTeam: MenuItem;


    ngOnInit() {
        this.ticketsService.eventTableComponent.emit(this);
    }

    ngOnChanges(): void {
        this.getAll();
    }


    public getAll(): void {
        const params: Params = {
            isApplicant: this.typeTicketCard == 'ticket'? true: false,
            teamId: this.selectedIdTeam,
            orderField: this.selectedOrderField?? '',
            sort: this.selectedSort
        };
        this.ticketsService.ticketList(params).subscribe({
            next: (res: TicketResponse[]) => {
                this.ticketsBase.set(res) ;
                this.tickets.set(res) ;
                this.selectedIdTeam == '0'? this.getTeamsByTickets(): '';
                this.filterTickets();
            },
            error: (err) => {
                console.log(err);
                this.helpersService.messageNotification("error", 'Error', err.message, 3000);
            }
        })
    }

    public async filterTickets() {
        this.tickets.set(await this.helpersService.filterOfArrayByFields(this.searchInput, this.ticketsBase(), ['title', 'enterprise', 'applicant', 'code', 'status', 'technical'])!);
    }

    private getTeamsByTickets() {
        let teams: MenuItem[] = [{
            label: "Todos",
            icon: 'pi pi-users',
            id: "0",
            command: () => {
              this.changeTeam('0');
            }
        }]
        this.ticketsBase().forEach( ticket => {
            if (!teams.find( team => team.label == ticket.team! )) {
                teams.push({
                    label: ticket.team!,
                    icon: 'pi pi-users',
                    id: ticket.teamId.toString(),
                    command: () => {
                        this.changeTeam(ticket.teamId.toString());
                    }
                })
            }
        });
        this.teams = teams;
        this.activeTeam = this.teams[0];
    }

    public changeTeam(idTeam: string) {
        this.selectedIdTeam = idTeam;
        this.getAll();
    }

    public setSort(sort: string) {
        this.selectedSort = sort;
        this.getAll();
    }
}
