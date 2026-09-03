import { Component, ElementRef, OnInit, computed, inject, signal, input, viewChild, output } from '@angular/core';
import { DataOpenFormTicket, addObservers, TicketById, Observer, EstimateDates } from '@core/models/Ticket';
import { HelpersService } from '@core/services/helpers.service';
import { TicketService } from '@ticket-historical/services/tickets.service';
import { PipesModule } from '@core/pipes/pipes.module';
import { DatePipe, NgClass } from '@angular/common';
import { Subscription } from 'rxjs';
import { PrimeModules } from '@shared/prime-components/prime-components.module';
import { FormatImagesService } from '@core/services/format-image.service';
import { MultiSelectGenericUsersComponent } from '../multi-select-generic-users/multi-select-generic-users.component';
import { InfoOpenModalCommon, ISolution } from '@core/interfaces/ticket.interface';
import { ModalFormTicketComponent } from '../modal-form-ticket/modal-form-ticket.component';
import { FORMAT_DATE_SEND, FORMAT_DATE_TIME } from '@core/constants/format-date-time';
import { LABELS } from '@core/constants/labels';
import { MESSAGES } from '@core/constants/messages';
import { TOOLTIPS } from '@core/constants/tooltips';
import { Severity } from '@core/enums/severity';
import { FormsModule } from '@angular/forms';
import { STATES_TICKET_ENUM, TypeTicketEnum } from '@core/enums/ticket';
import { ViewFileComponent } from '../view-file/view-file.component';
import { LoginService } from '@core/services/login.service';
import { ModalDerivationComponent } from '../modal-derivation/modal-derivation.component';
import { AccordionValueEnum } from '@core/enums/modal-info-ticket.enum';
import { Image } from 'primeng/image';

@Component({
    selector: 'app-modal-info-ticket',
    imports: [
    FormsModule,
    PrimeModules,
    PipesModule,
    ModalFormTicketComponent,
    MultiSelectGenericUsersComponent,
    ModalDerivationComponent,
    ViewFileComponent,
    NgClass
],
    templateUrl: './modal-info-ticket.component.html',
    providers: [FormatImagesService]
})
export class ModalInfoTicketComponent implements OnInit {

    readonly showDeribationAndAssociatedButton = input<boolean>(false);
    readonly isVIewPending = input<boolean>(false);
    readonly descriptionTicket = viewChild.required<ElementRef>('descriptionTicket');
    readonly divPosibleSolution = viewChild.required<ElementRef>('divPosibleSolution');
    readonly imagePreview = viewChild.required<Image>('imagePreview');
    readonly accordionValue = input<AccordionValueEnum>(AccordionValueEnum.DESCRIPTION);
    readonly onTicketAsociatedORDerivated = output<void>();
    readonly onHideModal = output<void>();

    private formatImagesService = inject(FormatImagesService);
    private ticketService = inject(TicketService);
    private loginService = inject(LoginService);
    private helpersService = inject(HelpersService);
    private datePipe = inject(DatePipe);

    public readonly formatDateWithHours = FORMAT_DATE_TIME;
    public readonly labels = LABELS;
    public readonly messages = MESSAGES;
    public readonly tooltips = TOOLTIPS;
    public readonly TypeTicketEnum = TypeTicketEnum;
    public readonly STATES_TICKET_ENUM = STATES_TICKET_ENUM;
    public readonly accordionValueEnum = AccordionValueEnum;
    public today = new Date();
    public userEmailLogged = signal<string>('');
    public estimatedStartDate: Date;
    public estimatedEndDate: Date;
    public incidentStartDate: string;
    public incidentEndDate: string;
    public ticketId: number;
    public modalVisible: boolean = false;
    public ticket = signal<TicketById>(new TicketById());
    public posibleSolutions: ISolution[] = [];
    public observerList = signal<Observer[]>([]);
    public showAccordion = signal<boolean>(false);
    private observerIds: number[] = [];
    public textColorPriority = computed(() => {
      const priority = this.ticket().priorityName
      return priority.includes('BAJA')? 'text-green-500': priority.includes('ALTA')? 'text-red-500': 'text-yellow-500';
    });
    private subscription: Subscription;

    ngOnInit(): void {
      this.subscription = this.ticketService.eventOpenInfoTicket.subscribe( (ticketId: number) => {
        this.ticketId = ticketId;
        this.getInfoTIcket();
        this.userEmailLogged.set(this.loginService.userEmail());
      })
    }

    ngOnDestroy(): void {
      (this.subscription)? this.subscription.unsubscribe(): '';
    }

    public fillDescriptionTicket(divDescriptionTicket: ElementRef) {
        const descriptionTicket = divDescriptionTicket.nativeElement;
        const images: HTMLImageElement[] = descriptionTicket.querySelectorAll('img');
        this.formatImagesService.widthImgaesInsideContainer(images, '75%', this.imagePreview());
        this.fillPosibleSolution();
    }
    
    public fillPosibleSolution() {
      if (this.posibleSolutions.length > 0) {
        const divPosibleSolution = this.divPosibleSolution().nativeElement;
        const images: HTMLImageElement[] = divPosibleSolution.querySelectorAll('img');
        this.formatImagesService.widthImgaesInsideContainer(images, '75%', this.imagePreview());
      }
    }

    public handleOpenFormTicketModal() {
      const data: DataOpenFormTicket = {
        parentTicketId: this.ticket().id,
        dataTicket: this.ticket()
      }
      this.ticketService.eventOpenFormTicket.emit(data);
    }
    
    public handleOpenModalDerivation() {
      this.ticketService.eventOpenModalDeribation.emit();
    }

    public getInfoTIcket () {
      if (this.ticketId > 0) {
        this.ticketService.getById(this.ticketId).subscribe({
          next: (res) => {
            this.posibleSolutions = res.solutions;
            this.ticket.set(res);
            this.today = new Date();
            this.modalVisible = true;
            setTimeout(() => {
              this.showAccordion.set(true);
            }, 100);
            this.getObserversByTicket();
            if (this.ticket().typeTicket == TypeTicketEnum.INCIDENTE) {
              this.incidentStartDate = res.incidentStartDate? this.datePipe.transform(res.incidentStartDate, FORMAT_DATE_TIME): "Sin fecha inicio.";
              this.incidentEndDate = res.incidentEndDate? this.datePipe.transform(res.incidentEndDate, FORMAT_DATE_TIME): "Sin fecha fin.";
            }
          }
        })
      }
    }

    public hideModal() {
      this.onHideModal.emit();
      this.modalVisible = false;
      this.showAccordion.set(false);
    }
    
    public eventTicketAsociatedORDerivated() {
      this.onTicketAsociatedORDerivated.emit();
      this.hideModal();
    }
    
    public setSelectObservers(observerIds: number[]) {
      this.observerIds = observerIds;
    }

    public saveObservers() {
      const body: addObservers = {
          ticketId: this.ticketId,
          credentialId: this.observerIds
        };
      this.ticketService.createObservers(body).subscribe({
        next: () => {
          this.observerIds = [];
          this.helpersService.messageNotification(Severity.success, 'Correcto', 'Lista de observadores actualizada.');
        }, complete: () => {
          this.getObserversByTicket();
        }
      })
    }
    
    public saveEstimatedDates() {
      const body: EstimateDates = {
        dateRange: {
          startDate: this.datePipe.transform(this.estimatedStartDate, FORMAT_DATE_SEND),
          endDate: this.datePipe.transform(this.estimatedEndDate, FORMAT_DATE_SEND)
        }
      };
      this.ticketService.addEstimateDates(this.ticketId, body).subscribe({
        next: () => {
          this.helpersService.messageNotification(Severity.success, 'Correcto', 'Fechas estimadas actualizadas.');
        }, complete: () => {
          this.estimatedEndDate = null;
          this.estimatedStartDate = null;
          this.getInfoTIcket();
        }
      })
    }
    
    public handleOpenModalTimeLine() {
      const data: InfoOpenModalCommon = {
        ticketId: this.ticketId,
        ticketTitle: this.ticket().code
      };
      this.ticketService.eventOpenTimeline.emit(data);
    }

    public getObserversByTicket () {
      this.ticketService.getObserversByTicket(this.ticketId).subscribe({
        next: (res) => {
          this.observerList.set(res);
        }
      })
    }

}
