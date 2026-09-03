import { Component, OnInit, computed, inject, signal, input, output } from '@angular/core';
import { HelpersService } from '@core/services/helpers.service';
import { StepperComponent } from '@shared/components/stepper/stepper.component';
import { Ticket, TicketById, TicketSend } from '@core/models/Ticket';
import { TicketService } from '@ticket-historical/services/tickets.service';
import { FileService } from '@core/services/file-service.service';
import { CategoryShort, CategoryWithEnterprise } from '@core/models/Category';
import { DataTicket } from '@core/interfaces/ticket.interface';
import { Router } from '@angular/router';
import { TYPE_VIEW_LIST_TICKET } from '@core/constants/ticket-view-type';
import { Severity } from '@core/enums/severity';
import { LABELS } from '@core/constants/labels';
import { CardsCategoriesComponent } from './components/cards-categories/cards-categories.component';
import { MESSAGES } from '@core/constants/messages';
import { switchMap } from 'rxjs';
import { FormTicketRequesterComponent } from '@shared/components/form-ticket-requester/form-ticket-requester.component';

@Component({
    selector: 'app-home',
    imports: [StepperComponent, FormTicketRequesterComponent, CardsCategoriesComponent],
    templateUrl: './home.component.html',
    providers: [HelpersService]
})
export class HomeComponent implements OnInit {

    readonly parentTicketId = input<number>();
    readonly dataRecursive = input<TicketById>();
    readonly onTicketAssociatedORDerivated = output();

    private ticketService = inject(TicketService);
    private fileService = inject(FileService);
    private helpersService = inject(HelpersService);
    private router = inject(Router);

    public indexCurrent = signal<number>(1);
    public category = signal<CategoryShort>(null);
    public enterpriseSelectedId = signal<number>(null);
    public enterpriseSelectedName = signal<string>('');
    public hasCostCenter = signal<boolean>(false);
    public steps = computed(() => {
        const result: string[] = [
            this.category()?.id? `Categoría: ${this.category().name}`: 'Categoría',
            'Datos del ticket',
        ];
        return result;
    })

    ngOnInit(): void {
        this.resetForm();
    }

    private resetForm() {
        this.category.set(null);
        this.changedIndex(1);
    }

    public changedIndex(index: number) {
        switch (index) {
            case 1:
                this.category.set(null);
                this.indexCurrent.set(index);
                break;
            case 2:
                if (!this.category()) {
                    this.helpersService.messageNotification(Severity.warn, LABELS.please, MESSAGES.firstSelectedACategory);
                }
                break;
        }
        
    };

    public setSelectedCategoryAndEnterprise(data: CategoryWithEnterprise) {
        this.category.set(data.category);
        this.enterpriseSelectedId.set(data.enterpriseId);
        this.enterpriseSelectedName.set(data.enterpriseName);
        this.hasCostCenter.set(data.hasCostCenter);
        this.indexCurrent.set(2);
    }

    public saveTicket(dataTicket: DataTicket) {
      dataTicket.file
          ? this.saveWithAttachment(dataTicket)
          : this.createTicket(dataTicket);
    }

    private saveWithAttachment(dataTicket: DataTicket) {
        const body: FormData = this.fileService.getDataForUploadFile(dataTicket.file, dataTicket.values.title);
        this.fileService.upload(body).pipe(
          switchMap((resp) => {
            const data: TicketSend = {
                ...dataTicket.values,
                parentTicketId: this.parentTicketId(),
                attachmentId: resp.id
            };  
            return this.ticketService.createRequest(data)
          })
        ).subscribe({
            next: (res) => this.onCreateTicket(res)
        });
    }

    private createTicket(dataTicket: DataTicket) {
        const data: TicketSend = {
            ...dataTicket.values,
            parentTicketId: this.parentTicketId(),
        };        
        this.ticketService.createRequest(data).subscribe({
            next: (res) => this.onCreateTicket(res)
        })
    }

    private onCreateTicket(ticket: Ticket) {
        let message: string = MESSAGES.recordCreated;
        if ( this.parentTicketId() ) {
            this.onTicketAssociatedORDerivated.emit()
            message = MESSAGES.ticketAssociationWasCreatedSuccessfully(ticket.code);
        } else {
            this.router.navigateByUrl(`/tickets/${TYPE_VIEW_LIST_TICKET.myTicket}`);
        }
        this.resetForm();
        this.helpersService.messageNotification(Severity.success, LABELS.ok, message);
    }
}
