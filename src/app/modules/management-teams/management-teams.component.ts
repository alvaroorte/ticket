import { Component, computed, inject, OnInit, signal } from '@angular/core';
import { DatePipe } from '@angular/common';
import { TicketService } from '@ticket-historical/services/tickets.service';
import { HelpersService } from '@core/services/helpers.service';
import { BodyChangeTechnical } from '@core/models/Ticket';
import { ModalInfoTicketComponent } from '@shared/components/modal-info-ticket/modal-info-ticket.component';
import { TeamWithMembers, technicianShort } from '@core/models/Team';
import { ModalTimelineTicketComponent } from '@shared/components/modal-timeline-ticket/modal-timeline-ticket.component';
import { InfoOpenModalCommon, InfoOpenModalPriority, TicketByTeam } from '@core/interfaces/ticket.interface';
import { TeamService } from '@team/services/teams.service';
import { Severity } from '@core/enums/severity';
import { filterOfArrayByFields } from '@core/utils/filter-by-fields';
import { ModalPriorityComponent } from '@shared/components/modal-priority/modal-priority.component';
import { LABELS } from '@core/constants/labels';
import { TOOLTIPS } from '@core/constants/tooltips';
import { MESSAGES } from '@core/constants/messages';
import { EnterpriseService } from '@enterprise/services/enterprises.service';
import { LoginService } from '@core/services/login.service';
import { ROLES_CODE_SYSTEM } from '@core/enums/roles';
import { EnterpriseShort } from '@core/interfaces/enterprise.interface';
import { PrimeModules } from '@shared/prime-components/prime-components.module';
import { CardComponent } from './components/card/card.component';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-management-teams',
  imports: [
    FormsModule,
    CardComponent,
    ModalTimelineTicketComponent,
    ModalInfoTicketComponent,
    ModalPriorityComponent, 
    PrimeModules
  ],
  templateUrl: './management-teams.component.html',
  styleUrls: ['./management-teams.component.scss'],
  providers: [HelpersService, DatePipe]
})

export class ManagementTeamsComponent implements OnInit {

  private ticketService = inject(TicketService);
  private teamService = inject(TeamService);
  private enterpriseService = inject(EnterpriseService);
  private loginService = inject(LoginService);
  private helpersService = inject(HelpersService);

  private readonly withOutTechnicianEmail: string = "Sin técnico";
  public readonly labels = LABELS;
  public readonly tooltips = TOOLTIPS;
  public readonly messages = MESSAGES;
  private readonly allTeamIdAndAllEnterpriseId = 0;
  public hasSupervisorRole = this.loginService.rolesUser().includes(ROLES_CODE_SYSTEM.SUPERVISOR);
  public teams = signal<TeamWithMembers[]>([]);
  public ticketBase = signal<TicketByTeam[]>([]);
  public selectedTeamId = signal<number>(null);
  public searchWithRoleSupervisor = signal<boolean>(false);
  public enterprises = signal<EnterpriseShort[]>([]);
  public selectedEnterpriseId = signal<number>(null);
  public searchInput = signal<string>(null);
  private draggedTicketId: number;
  private draggedTechnicianStartId: number;
  public readonly tooltipSearch: string = 'Este campo busca por: Código, Empresa, Título, Solicitante y Técnico';  
  public technicians = computed<technicianShort[]>(() => {
    let technicians: technicianShort[] = [];
    if (this.selectedTeamId()) {
      const foundTeam = this.teams().find( team => team.id == this.selectedTeamId() );
      technicians = foundTeam ? [...foundTeam.teamMembers] : [];
    } else {
      technicians = this.teams().reduce((result: technicianShort[], team: TeamWithMembers) => {
        team.teamMembers.forEach(member => {
          if (!result.find((m: technicianShort) => m.technicianCredentialId == member.technicianCredentialId)) {
            result.push(member);
          }
        });
        return result;
      }, [])
    }
    const withOutTechnician: technicianShort = { technicianCredentialEmail: this.withOutTechnicianEmail, technicianCredentialId: 0 };
    return [withOutTechnician, ...technicians];
  });

  public tickets = computed<TicketByTeam[]>(() => {
    return this.searchInput()
      ? filterOfArrayByFields(this.searchInput(), this.ticketBase(), ['code', 'enterpriseCode', 'requester', 'title', 'technician'])
      : this.ticketBase();
  });
  
  ngOnInit(): void {
    this.getEnterprises();
  }

  public onToggleSupervisor() {
    this.selectedEnterpriseId.set(null);
    this.selectedTeamId.set(null);
    this.getEnterprises();
  }

  private getEnterprises() {
    this.enterpriseService.getMine(this.searchWithRoleSupervisor()).subscribe({
      next: (res) => {
        if (res.length === 1) {
          this.enterprises.set(res);
          this.selectedEnterpriseId.set(res[0].id);
          this.onchangedEnterprise();
        } else {
          const enterpriseAllOption: EnterpriseShort = {
            id: this.allTeamIdAndAllEnterpriseId,
            name: 'TODOS',
            code: ''
          };
          this.enterprises.set([enterpriseAllOption, ...res]);
        }
      }
    });
  }

  public onchangedEnterprise() {
    this.selectedTeamId.set(this.allTeamIdAndAllEnterpriseId);
    this.getTeamsByEnterpriseAndSupervisor()

  }

  private getTeamsByEnterpriseAndSupervisor() {
    this.teamService.getMine(this.selectedEnterpriseId(), this.searchWithRoleSupervisor()).subscribe({
      next: (res) => {
        const teamAllOption: TeamWithMembers = {
          name: 'TODOS',
          active: null,
          id: this.allTeamIdAndAllEnterpriseId,
          leaderCredentialEmail: null,
          leaderCredentialId: null,
          teamMembers: [],
          teamMembersString: null,
          technicalAutomatic: null
        };
        this.teams.set([teamAllOption, ...res]);
      }, complete: () => {
          this.getTicketsByTeam();
      }
    })
  }

  public getTicketsByTeam() {
    this.ticketService.assignments(this.selectedEnterpriseId(), this.selectedTeamId(), this.searchWithRoleSupervisor()).subscribe({
      next: (res) => {
        this.ticketBase.set(res);
      }
    })
  }

  public getTicketsOfTechnician(technicianEmail: string): TicketByTeam[] {
    if (technicianEmail == this.withOutTechnicianEmail) {
      return this.tickets().filter(ticket => !ticket.technician);
    }
    return this.tickets().filter(ticket => ticket.technician == technicianEmail);
  }

  public dragTicketStart(ticketId: number, technicianId: number) {
    this.draggedTicketId = ticketId;
    this.draggedTechnicianStartId = technicianId;
  }
  
  public changeTechnician(technicianId: number) {
    if (technicianId) {
      if (this.draggedTechnicianStartId != technicianId) {
        const body: BodyChangeTechnical = {
          technicianCredentialId: technicianId,
          ticketId: this.draggedTicketId
        };
        this.ticketService.changeTechnical(body).subscribe({
          next: () => {
            this.helpersService.messageNotification(Severity.success, "Correcto", 'Se cambio de técnico correctamente.');
          },
          complete: () => {
            this.getTicketsByTeam();
          }
        })
      }
    } else this.helpersService.messageNotification(Severity.warn, "Aviso", "No se puede asignar el ticket a este técnico.")
  }

  public openModalTimeline(ticketId: number, ticketTitle: string) {
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

  public openModalInfo(ticketId: number) {
    this.ticketService.eventOpenInfoTicket.emit(ticketId);
  }
  
  public openModalPriority(ticketId: number, priorityId: number) {
    const dataPriority: InfoOpenModalPriority = {
      ticketId: ticketId,
      priorityId: priorityId
    }
    this.ticketService.eventOpenModalPriority.emit(dataPriority);
  }

}
