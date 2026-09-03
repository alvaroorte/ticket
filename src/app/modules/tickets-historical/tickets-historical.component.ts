import { Component, inject, signal } from '@angular/core';
import { PrimeModules } from 'src/app/shared/prime-components/prime-components.module';
import { LABELS } from '@core/constants/labels';
import { ModalTimelineTicketComponent } from '@shared/components/modal-timeline-ticket/modal-timeline-ticket.component';
import { ModalInfoTicketComponent } from '@shared/components/modal-info-ticket/modal-info-ticket.component';
import { PanelFiltersComponent } from './components/panel-filters/panel-filters.component';
import { TableOnDemnadComponent } from '@shared/components/table-on-demand/table-on-demand.component';
import { TicketService } from './services/tickets.service';
import { TableColumn } from '@core/interfaces/table.interface';
import { IFiltersTicketsHistorical, InfoOpenModalCommon, InfoOpenModalPriority, TicketHistory } from '@core/interfaces/ticket.interface';
import { TableColumnDefinitions } from '@core/utils/table-column-definitions';
import { HttpParams } from '@angular/common/http';
import { WaitingTimeStatusClass } from '@core/enums/waitng-time-status.enum';
import { openModalEnum, STATES_TICKET_ENUM } from '@core/enums/ticket';
import { TOOLTIPS } from '@core/constants/tooltips';
import { Severity } from '@core/enums/severity';
import { MESSAGES } from '@core/constants/messages';
import { CodeReportsEnum, TypeReportsEnum } from '@core/enums/type-reports';
import { HelpersService } from '@core/services/helpers.service';
import { ROLES_CODE_SYSTEM } from '@core/enums/roles';
import { LoginService } from '@core/services/login.service';
import { ReportsService } from '@core/services/reports.service';
import { FileService } from '@core/services/file-service.service';
import { MimeTypeEnum } from '@core/enums/mime-type';
import { FormsModule } from '@angular/forms';
import { MenuItem } from 'primeng/api';
import { ModalPriorityComponent } from '@shared/components/modal-priority/modal-priority.component';
import { ModalApproverModeratorComponent } from '@shared/components/modal-approver-moderator/modal-approver-moderator.component';

@Component({
    selector: 'app-tickets-historical',
    imports: [
      FormsModule,
      PrimeModules, 
      ModalTimelineTicketComponent, 
      ModalInfoTicketComponent,
      PanelFiltersComponent,
      TableOnDemnadComponent,
      ModalPriorityComponent,
      ModalApproverModeratorComponent
    ],
    templateUrl: './tickets-historical.component.html'
})

export class TicketsHistoricalComponent {

  private ticketService = inject(TicketService);
  private helpersService = inject(HelpersService);
  private loginService = inject(LoginService);
  private reportsService = inject(ReportsService);
  private fileService = inject(FileService);

  public readonly labels = LABELS;
  public readonly tooltips = TOOLTIPS;
  public readonly messages = MESSAGES;
  public readonly openModalEnum = openModalEnum;
  private loadDataOfTable = false;
  public columns: TableColumn<TicketHistory>[] = TableColumnDefinitions.getTicketsHistoricalColumnsDefinition();
  public tickets = signal<TicketHistory[]>([]);
  public selectedTicket = signal<TicketHistory>(null);
  public totalElements = signal<number>(0);
  public allowChangeApproverOrModerator = signal<boolean>(false);
  public allowChangePriority = signal<boolean>(false);
  public searchWithRoleSupervisor = signal<boolean>(false);
  public hasSupervisorRole = this.loginService.rolesUser().includes(ROLES_CODE_SYSTEM.SUPERVISOR);
  public fieldFilters: IFiltersTicketsHistorical;
  public paramsOfTicket: HttpParams;
  public menuItemsOfReports = signal<MenuItem[]>([
    {
      label: this.labels.downloadHistoricalPdf,
      icon: 'pi pi-file-pdf text-red-500',
      command: () => {
        this.downloadReport(CodeReportsEnum.HISTORY, TypeReportsEnum.PDF)
      }
    },
    {
      label: this.labels.downloadHistoricalExcel,
      icon: 'pi pi-file-excel text-green-500',
      command: () => {
        this.downloadReport(CodeReportsEnum.HISTORY, TypeReportsEnum.EXCEL)
      }
    },
    {
      label: this.labels.downloadIcidents,
      icon: 'pi pi-file-excel text-green-500',
      visible: this.loginService.rolesUser().includes(ROLES_CODE_SYSTEM.MONITOR),
      command: () => {
        this.downloadReport(CodeReportsEnum.INCIDENT, TypeReportsEnum.EXCEL)
      }
    },
    {
      label: this.labels.downloadAlertsAndEvents,
      icon: 'pi pi-file-excel text-green-500',
      visible: this.loginService.rolesUser().includes(ROLES_CODE_SYSTEM.MONITOR),
      command: () => {
        this.downloadReport(CodeReportsEnum.ALERTS_EVENTS, TypeReportsEnum.EXCEL)
      }
    },
  ]);

  public loadTickets(event: HttpParams) {
    this.paramsOfTicket = event;
    this.getTickets();
  }

  public onChangedFiltersPanel(fieldFilters: IFiltersTicketsHistorical) {
    this.fieldFilters = fieldFilters;
    this.getTickets();
  }

  public getTickets() {
    const params = this.paramsOfTicket.appendAll({...this.fieldFilters, supervisor: this.searchWithRoleSupervisor()});
    if (this.loadDataOfTable) {
      this.ticketService.getHistoryPageable(params).subscribe({
        next: (res) => {
          res.content.map( row => {
            row.waitingTimeClass = WaitingTimeStatusClass[row.waitingTimeStatus?? 'NONE'] 
            return row;
          })
          this.tickets.set(res.content);
          this.totalElements.set(res.totalElements);
        }, error: () => {
          this.tickets.set([]);
        }
      });
    }
    this.loadDataOfTable = true;
  }

  public setTicketSelected( selectedTicket: TicketHistory  ) {
    this.selectedTicket.set(selectedTicket);
    this.allowChangeApproverOrModerator.set([STATES_TICKET_ENUM.APPROVER_WAITING, STATES_TICKET_ENUM.MODERATOR_WAITING].includes(selectedTicket?.flowStatus));
    this.allowChangePriority.set([STATES_TICKET_ENUM.TECH_ASSIGNED, STATES_TICKET_ENUM.TECH_REASSIGNMENT, STATES_TICKET_ENUM.TECH_PENDING, STATES_TICKET_ENUM.APPROVER_WAITING, STATES_TICKET_ENUM.MODERATOR_WAITING].includes(selectedTicket?.flowStatus));
  }

  public openModal(typeModal: openModalEnum) {
    if ( this.selectedTicket()?.id ) {
      const data: InfoOpenModalCommon = {
        ticketId: this.selectedTicket().id,
        ticketTitle: this.selectedTicket().code
      };
      switch (typeModal) {
        case openModalEnum.INFOTICKET:
          this.ticketService.eventOpenInfoTicket.emit(this.selectedTicket().id);
        break;
        case openModalEnum.MESSAGE:
          this.ticketService.eventOpenModalMessages.emit(data);
        break;
        case openModalEnum.TIMELINE:
          this.ticketService.eventOpenTimeline.emit(data);
        break;
        case openModalEnum.PRIORITY:
          const dataPriority: InfoOpenModalPriority = {
            ticketId: this.selectedTicket().id,
            priorityId: this.selectedTicket().ticketPriorityParameterId
          }
          this.ticketService.eventOpenModalPriority.emit(dataPriority);
        break;
        case openModalEnum.APPROVERMODERATOR:
          this.ticketService.eventOpenModalApproverModerator.emit(this.selectedTicket());
        break;
      }
    } else {
      this.helpersService.messageNotification(Severity.warn, this.labels.please, MESSAGES.selectARow);
    }
  }

  public downloadReport(reportCode: CodeReportsEnum, reportType: TypeReportsEnum) {
    const filters = {
        ...this.fieldFilters,
        supervisor: this.searchWithRoleSupervisor(),
        reportCode,
        reportType
    }
    const service = reportCode == CodeReportsEnum.ALERTS_EVENTS
      ? this.reportsService.generatereportAlertsEvents(filters)
      : this.reportsService.generatereportHistory(filters)
    service.subscribe({
      next: (resp) => {
        const file: File = this.fileService.convertBase64ToFile(resp.file, resp.name, reportType == TypeReportsEnum.PDF? MimeTypeEnum.PDF: MimeTypeEnum.EXCEL);
        reportType == TypeReportsEnum.PDF
          ? this.fileService.openFileInNewTab(file)
          : this.fileService.downloadFile(file, resp.name);
      },
    })
  }
}
