import { Component, computed, inject, OnChanges, OnDestroy, OnInit, signal, input, AfterViewInit, SimpleChanges, DestroyRef } from '@angular/core';
import { ModalInfoTicketComponent } from '@shared/components/modal-info-ticket/modal-info-ticket.component';
import { ModalTimelineTicketComponent } from '@shared/components/modal-timeline-ticket/modal-timeline-ticket.component';
import { ToolbarCardsComponent } from './components/toolbar-cards/toolbar-cards.component';
import { CardsComponent } from './components/cards/cards.component';
import { TicketService } from '@ticket-historical/services/tickets.service';
import { HelpersService } from '@core/services/helpers.service';
import { keyTicketResponse, TicketFunctionArrays, TicketResponse, TicketSolutionProjection } from '@core/models/Ticket';
import { HttpParamsTicketList, INextFunction, INextFunctionAndFile, InfoOpenModalDescription } from '@core/interfaces/ticket.interface';
import { TableTicketsComponent } from './components/table-tickets/table-tickets.component';
import { ModalFormDescriptionComponent } from '@shared/components/modal-form-description/modal-form-description.component';
import { TYPE_VIEW_LIST_TICKET } from '@core/constants/ticket-view-type';
import { nameFunction } from '@core/interfaces/buttons-ticket.interface';
import { Severity } from '@core/enums/severity';
import { ConfirmationService } from 'primeng/api';
import { filterOfArrayByFields } from '@core/utils/filter-by-fields';
import { ModalPriorityComponent } from '@shared/components/modal-priority/modal-priority.component';
import { buttonsOfTickets } from '@core/constants/buttons-ticket';
import { LABELS } from '@core/constants/labels';
import { MESSAGES } from '@core/constants/messages';
import { STATES_TICKET_ENUM, TypeTicketEnum } from '@core/enums/ticket';
import { PrimeModules } from '@shared/prime-components/prime-components.module';
import { FormsModule } from '@angular/forms';
import { SelectButtonOptionClickEvent } from 'primeng/selectbutton';
import { MessageWsService } from '@core/services/message.service';
import { attachmentResponse } from '@core/interfaces/Attachment.interface';
import { FileService } from '@core/services/file-service.service';
import { DropdownCommonInterface } from '@core/interfaces/dropdow-common.interface';
import { Router } from '@angular/router';
import { AccordionValueEnum } from '@core/enums/modal-info-ticket.enum';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

@Component({
    selector: 'app-tickets',
    imports: [
      FormsModule,
      ModalInfoTicketComponent,
      ModalTimelineTicketComponent,
      ToolbarCardsComponent,
      CardsComponent,
      TableTicketsComponent,
      ModalFormDescriptionComponent,
      ModalPriorityComponent,
      PrimeModules
    ],
    templateUrl: './tickets.component.html',
    providers: [ConfirmationService]
})
export class TicketsComponent implements OnChanges, OnInit, OnDestroy, AfterViewInit {

   readonly typeOfListTicket = input<string>();
   readonly showCodeTicket = input<number>();

   private ticketService = inject(TicketService);
   private helpersService = inject(HelpersService);
   private confirmationService = inject(ConfirmationService);
   private messageWsService = inject(MessageWsService);
   private fileService = inject(FileService);
   private destroyRef = inject(DestroyRef);
   private router = inject(Router);

   public showInCards = signal<boolean>(true);
   public textSearchInput: string = '';
   public ticketsBase = signal<TicketResponse[]>([]);
   public showSolvedMessage = computed(() => this.tickets().some( ticket => ticket.flowStatusName == STATES_TICKET_ENUM.SOLVED ))
   public tickets = signal<TicketResponse[]>([]);
   public ticketsIncident = signal<TicketResponse[]>([]);
   private params: HttpParamsTicketList;
   public selectorTicketFunction = signal(new TicketFunctionArrays());
   public nameFunction: nameFunction;
   public titleModalDescription = signal('');
   public solutionTemp: TicketSolutionProjection;
   public ticketId = signal<number>(0);
   public titleTicket = signal<string>('');
   public accordionValue = signal<AccordionValueEnum>(AccordionValueEnum.DESCRIPTION)
   public readonly optionsOfView: DropdownCommonInterface[] = [
      { label: 'Tarjetas', value: true },
      { label: 'Tabla', value: false }
   ];
   private readonly functionsWithExtraData: nameFunction[] = ['finishTicket', 'rejectByApprover', 'rejectByModerator', 'rejectSolution', 'scheduleTicket', 'acceptSolution'];
   private readonly functionsWithQuestion: nameFunction[] = ['approveByApprover', 'approveByModerator', 'assignTicketToMe', 'closeTicket'];
   public readonly labels = LABELS;
   public readonly messages = MESSAGES;
   public isViewTicket = computed(() => this.typeOfListTicket() === TYPE_VIEW_LIST_TICKET.myTicket);
   public isViewPending = computed(() => this.typeOfListTicket() === TYPE_VIEW_LIST_TICKET.pending);

   ngOnInit(): void {
      if (this.messageWsService.stompClientConnect()) {
         this.subscriptionsOnInitcomponent();
      }
      this.messageWsService.eventOnConnect.pipe(takeUntilDestroyed(this.destroyRef)).subscribe(() => {
         this.subscriptionsOnInitcomponent();
      })
      this.messageWsService.eventChangedTicketStatus.pipe(takeUntilDestroyed(this.destroyRef)).subscribe(() => {
         this.getAll();
      })
   }
   
   ngOnChanges(changes: SimpleChanges) {
      this.showInCards.set(true);
      this.getAll();
      if (!changes['showCodeTicket']?.firstChange) {
         this.ngAfterViewInit();
      }  
   }

   ngAfterViewInit(): void {
      if (this.showCodeTicket()) {
         this.accordionValue.set(AccordionValueEnum.SOLUTIONS);
         this.ticketService.eventOpenInfoTicket.emit(this.showCodeTicket());
      }
   }

   ngOnDestroy(): void {
      this.messageWsService.unsubscribeUnreadByUserEmail();
      this.messageWsService.unsubscriptionTicketChanged();
   }

   private subscriptionsOnInitcomponent() {
      this.messageWsService.getAndSetMessagesUnreadByTicket();
      this.messageWsService.handlerMessagesUnreadByUserEmail();
      this.messageWsService.handlerticketchanged();
   }
   
   public setShowInCards(option: SelectButtonOptionClickEvent) {
      this.showInCards.update( value => {
         if (!((option.index === 0) === value)) {
            this.resetParams();
         }
         return option.index === 0;
      });
   }
   public resetParams() {
      this.params = {
         sortBy: '',
         sortOrder: ''
      };
      this.getAll();
   }

   public setParams(params: HttpParamsTicketList) {
      this.params = params;
      this.getAll()
   }

   public getAll() {
      const typeOfListTicket = this.typeOfListTicket();
      const serviceObservable = typeOfListTicket == TYPE_VIEW_LIST_TICKET.myTicket?
         this.ticketService.ticketListRequester(this.params)
         : typeOfListTicket == TYPE_VIEW_LIST_TICKET.pending?
            this.ticketService.ticketListTechnician(this.params)
            : this.ticketService.ticketListApprover(this.params);
      serviceObservable.subscribe({
         next: (res) => {
            this.ticketsBase.set(res);
            this.filterTickets(this.textSearchInput);
         }
      })
   }

   public filterTickets(text: string) {
      this.textSearchInput = text;
      const fieldsForSearch = this.isViewPending()? ['title', 'code', 'enterpriseCode', 'requester', 'flowStatusName', 'tag', 'priorityName']: ['title', 'code', 'enterpriseCode', 'requester', 'flowStatusName', 'technician', 'priorityName'];
      const tickets: TicketResponse[] = filterOfArrayByFields(this.textSearchInput, this.ticketsBase(), fieldsForSearch);
      this.ticketsIncident.set(tickets.filter(t => t.typeTicket == TypeTicketEnum.INCIDENTE));
      this.tickets.set(tickets.filter(t => t.typeTicket == TypeTicketEnum.SOLICITUD));
   }
   
   public orderTickets(field: keyTicketResponse) {
      this.tickets().sort((a, b) => b[field].localeCompare(a[field]))
   }

   public playNextFunctionTicket( data: INextFunction ) {
      this.ticketId.set(data.ticketId);
      this.nameFunction = data.function;
      if ( this.functionsWithExtraData.includes(this.nameFunction) ) {
         this.openModalDescription();
      } else if(this.functionsWithQuestion.includes(this.nameFunction)) {
         this.modalQuestion(data)
      } else {
         this.sendFunction(data)
      }
   }

   private sendFunction(body: INextFunction) {
      this.ticketService.ticketFunction( body ).subscribe({
         next: () => { 
            this.helpersService.messageNotification(Severity.success, LABELS.ok, MESSAGES.taskCompletedSuccessfully);
            this.ticketService.eventCloseModalDescription.emit();
         }, complete: () => {
            this.getAll();
         }
      })
   }

   public async mapperDataForSendFunction (data: INextFunctionAndFile) {
      const attachment: attachmentResponse = data.attachment? await this.fileService.uploadFile(data.attachment, `File of solution of ticket ${this.ticketId()}`): null;
      data.body.ticketId = this.ticketId();
      data.body.function = this.nameFunction;
      const body: INextFunction = {
         ...data.body,
         attachmentId: attachment?.id
      }
      this.sendFunction(body);
   }
   
   private openModalDescription () {
      const data: InfoOpenModalDescription = {
         nameFunction: this.nameFunction,
         ticketId: this.ticketId()
      }
      this.ticketService.eventOpenModalDescription.emit(data);
   }

   private modalQuestion(body: INextFunction) {
      this.confirmationService.confirm({
         message: MESSAGES.areYouSureWantToTakeThisAction,
         header: buttonsOfTickets[body.function].tooltip + ' ' + body.ticketCode,
         icon: 'pi pi-exclamation-triangle',
         acceptIcon:"pi pi-check mr-2",
         rejectIcon:"pi pi-times mr-2",
         acceptLabel: this.labels.yes,
         rejectLabel: this.labels.no,
         rejectButtonStyleClass:"p-button-sm p-button-danger p-button-rounded mb-2 p-2 hover-danger shadow-3",
         acceptButtonStyleClass:"p-button-sm p-button-rounded mb-2 p-2 hover-primary shadow-3 mr-3",
         accept: () => {
            this.sendFunction(body);
         }
      });
  }

   public onHideModalInfo() {
      if (this.showCodeTicket()) this.router.navigate([`/tickets/${this.typeOfListTicket()}`]);
      this.accordionValue.set(AccordionValueEnum.DESCRIPTION);
   }

}
