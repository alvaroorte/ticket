import { Component, inject, signal } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { TicketsService } from '@ticket-historical/services/tickets-.service';
import { HelpersService } from '@core/services/helpers.service';
import { SendChangeTicket, TeamByLeader, TicketByTeam } from '@core/models/Ticket';
import { ManagementTeamsModule } from './management-teams.module';
import { InfoTicketSidebarComponent } from '@shared/components/info-ticket-sidebar/info-ticket-sidebar.component';
import { TeamMember } from '@core/models/Team';
import { MenuItem } from 'primeng/api';
import { FormTicketModalComponent } from '@shared/components/form-ticket-modal/form-ticket-modal.component';
import { ModalGraphGanttComponent } from '@shared/components/modal-graph-gantt/modal-graph-gantt.component';
import { ModalTimelineTicketComponent } from '@shared/components/modal-timeline-ticket/modal-timeline-ticket.component';
import { take } from 'rxjs';

@Component({
  selector: 'app-management-teams',
  standalone: true,
  imports: [CommonModule, ManagementTeamsModule, ModalTimelineTicketComponent, InfoTicketSidebarComponent, FormTicketModalComponent, ModalGraphGanttComponent],
  templateUrl: './management-teams.component.html',
  providers: [HelpersService, DatePipe]
})

export class ManagementTeamsComponent {

  ticketService = inject(TicketsService);
  helpersService = inject(HelpersService);

  ticketsByTechnical= signal<any[]>([]);
  teamsByLeader: MenuItem[] = [];
  activeTeam: MenuItem | undefined;
  membersByTeam= signal<TeamMember[]>([]);
  ticketsBase= signal<TicketByTeam[]>([]);
  idTicket = signal<number>(0);
  titleTicket = signal<string>('');
  draggedTicket!: TicketByTeam | null;
  idTeam: string = '0';
  
  ngOnInit() {
    this.getTcketsByTeam(true);
  }

  getTcketsByTeam(onlyInit: boolean = false) {
    let params = {
      teamId: this.idTeam
    }
    this.ticketService.listByTeam(params).subscribe({
      next: (res) => {
        this.ticketsByTechnical.set([]);
        this.membersByTeam.set(  this.filterMembers(res.teamMember!) );
        this.ticketsBase.set(  res.ticketTeam! );
        this.orderTicketsByTechnical(res.ticketTeam!, this.membersByTeam());
        ( onlyInit )? this.orderTeamsByLead(res.teamByLeader!): '';
      },
      error: (err) => {
        console.log(err);
        this.helpersService.messageNotification("error", 'Error', err.message, 3000);
      }
    })
  }

  filterMembers( technicals: TeamMember[]): TeamMember[] {
    let sinTecnico: TeamMember[] = [{  id: null,
      member: 'No Asignado',
      team: null,
    }];
    technicals = sinTecnico.concat(technicals) ;
    let technicalsFilter: TeamMember[] = [];
    technicals.forEach( tec => {
      if ( !technicalsFilter.some( tecFilter => tecFilter.id == tec.id ) ) {
        technicalsFilter.push(tec);
      }
    });
    return technicalsFilter;
  }

  orderTeamsByLead( teamByLeader: TeamByLeader[] ) {
    let teams: MenuItem[] = [{
      label: "Todos",
      icon: 'pi pi-users',
      id: '0',
      command: () => {
        this.changeTeam('0');
      }
    }]
    teamByLeader.forEach( team => {
      teams.push( {
        label: team.teamName,
        icon: 'pi pi-users',
        id: team.teamId.toString(),
        command: () => {
            this.changeTeam(team.teamId.toString());
        },
    } )
    })
    this.teamsByLeader = teams;
    this.activeTeam = this.teamsByLeader[0];
  }


  changeTeam( idTeam: string ) {
    this.idTeam = idTeam;
    this.getTcketsByTeam(false);
  }

  orderTicketsByTechnical(tickets:TicketByTeam[], technicals: TeamMember[] ) {
    technicals.forEach( technical => {
      this.ticketsByTechnical().push( tickets.filter( ticket => ticket.technicalId == technical.id))
    });
    this.ticketsByTechnical.set(this.ticketsByTechnical().filter(t => t));
  }

  dragStart(ticket: TicketByTeam) {
    this.draggedTicket = ticket;
  }

  drop(technicalId: number) {
    if (technicalId) {
      if ( this.draggedTicket!.technicalId != technicalId ) {
        let body: SendChangeTicket = { actorId: technicalId };
        this.ticketService.changeTechnical(this.draggedTicket?.ticketId as number, body) .subscribe({
          next: (res) => {
            this.getTcketsByTeam(false);
            this.helpersService.messageNotification("success", 'Correcto', res.message!, 2000);
          },
          error: (err) => {
            console.log(err);
            this.helpersService.messageNotification("error", 'Error', err.message, 3000);
          }
        })
      }
    } else {
      this.helpersService.messageNotification("warn", "Invalido", "No se puede asignar un ticket a esta persona", 3000);
    }
  }

  openModalTimeline(idTicket: number, title: string) {
    this.idTicket.set(idTicket);
    this.titleTicket.set(title);
    this.ticketService.eventOpenTimeline.emit();
  }

  openModalInfo(idTicket: number) {
    this.idTicket.set(idTicket);
    this.ticketService.eventOpenInfoTicket.emit();
  }

  public async filterCategories( event: any ) {
    this.ticketsByTechnical.set([]);
    this.orderTicketsByTechnical(await this.helpersService.filterOfArrayByFields(event.target.value,this.ticketsBase(), ['title', 'code', 'enterprise'])!, this.membersByTeam());
  }
}
