
import { DatePipe, NgClass } from '@angular/common';
import { Component, ElementRef, OnDestroy, OnInit, inject, signal, viewChild, output } from '@angular/core';
import { FormGroup, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { buttonsOfTickets } from '@core/constants/buttons-ticket';
import { FoldersParametersEnum } from '@core/enums/folder-parameters.enum';
import { nameFunction } from '@core/interfaces/buttons-ticket.interface';
import { IFieldForFuntion } from '@core/interfaces/modal-description';
import { INextFunctionAndFile } from '@core/interfaces/ticket.interface';
import { FormUtils } from '@core/utils/forms';
import { ParameterService } from '@parameter/services/parameters.service';
import { PrimeModules } from '@shared/prime-components/prime-components.module';
import { TicketService } from '@ticket-historical/services/tickets.service';
import { Subscription } from 'rxjs';
import { InputFileComponent } from '../input-file/input-file.component';
import { fileTypeAllowed } from '@core/constants/file';
import { ModeInputFile } from '@core/enums/file.enum';
import { LABELS } from '@core/constants/labels';
import { TypeFieldEnum } from '@core/enums/type-fields';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';
import { IncidentDates, TicketById } from '@core/models/Ticket';
import { FormatImagesService } from '@core/services/format-image.service';
import { FORMAT_DATE_TIME_SEND } from '@core/constants/format-date-time';
import { TypeTicketEnum } from '@core/enums/ticket';
import { getFieldsByTypeTicketAndNameFunction } from '@core/utils/parameters-by-function';
import { IParameterSelect } from '@core/models/Parameter';
import { Image } from 'primeng/image';

@Component({
    selector: 'app-modal-form-description',
    imports: [PrimeModules, FormsModule, ReactiveFormsModule, NgClass, InputFileComponent],
    templateUrl: './modal-form-description.component.html',
    providers: [FormatImagesService]
})
export class ModalFormDescriptionComponent implements OnInit, OnDestroy {

    readonly descriptionTicket = viewChild<ElementRef>('descriptionTicket');
    readonly imagePreview = viewChild.required<Image>('imagePreview');
    readonly eventSendData = output<INextFunctionAndFile>();

    private ticketService = inject(TicketService);
    private parameterService = inject(ParameterService);
    private sanitizer = inject(DomSanitizer);
    private formatImagesService = inject(FormatImagesService);
    private datePipe = inject(DatePipe);

    public readonly labels = LABELS;
    public readonly FoldersParametersEnum = FoldersParametersEnum;
    public readonly allowedFormats: string = `${fileTypeAllowed.allowedImageFormat},${fileTypeAllowed.allowedOfficeFormat},${fileTypeAllowed.allowedCompressedFormat},${fileTypeAllowed.allowedOtherFormats}`;
    public readonly modeInputFile = ModeInputFile;
    public readonly TypeTicketEnum = TypeTicketEnum;
    public readonly TypeFieldEnum = TypeFieldEnum;
    public fieldsModalDescription: IFieldForFuntion[] = [];
    public today = new Date();
    public incidentStartDate: Date;
    public incidentEndDate: Date;
    public selectedTag: number;
    public openModal: boolean = false;
    public titleModal: string = "";
    public ticket = signal<TicketById>(new TicketById());
    public descriptionTicketHtml: SafeHtml;
    public tags = signal<IParameterSelect[]>([]);
    public showDatesIncident = signal<boolean>(false);
    public formDescription: FormGroup = new FormGroup({});
    private nameFunction: nameFunction;
    private ticketId: number;
    private fileUploaded: File;
    private subscriptions: Subscription = new Subscription();

    ngOnInit(): void {
        this.subscriptions.add(
            this.ticketService.eventOpenModalDescription.subscribe((data) => {
                this.nameFunction = data.nameFunction;
                this.ticketId = data.ticketId;
                this.titleModal = buttonsOfTickets[this.nameFunction].tooltip
                this.getInfoTicket();
            })
        )
        this.ticketService.eventCloseModalDescription.subscribe(() => this.closeModal());
    }

    ngOnDestroy(): void {
        this.subscriptions.unsubscribe();
    }

    private setForm(fieldsModalDescription: IFieldForFuntion[]) {
        this.formDescription = FormUtils.getFromGroupByFieldsOfNameFunction(fieldsModalDescription);
        this.reset();
    }

    private getParameters() {
        this.fieldsModalDescription = getFieldsByTypeTicketAndNameFunction(this.ticket().typeTicket, this.nameFunction);
        this.setForm(this.fieldsModalDescription);
        const folders: FoldersParametersEnum[] = this.fieldsModalDescription.filter( field => field.folder).map(dropdown => dropdown.folder);
        this.parameterService.select(folders).subscribe({
            next: (parameters) => {
                this.fieldsModalDescription.forEach( dropdown => {
                    if (dropdown.folder) {
                        dropdown.list = parameters.filter(parameter => parameter.folder == dropdown.folder ).sort((a, b) => a.ranking - b.ranking);
                    }
                });
                this.today = new Date();
                this.openModal = true;
            }
        });
    }

    private getInfoTicket () {
        this.ticketService.getById(this.ticketId).subscribe({
            next: (res) => {
                this.ticket.set(res);
                this.descriptionTicketHtml = this.sanitizer.bypassSecurityTrustHtml(res.description);
                if (res.typeTicket == TypeTicketEnum.INCIDENTE) {
                    this.incidentStartDate = res.incidentStartDate? new Date(res.incidentStartDate): null;
                    this.incidentEndDate = res.incidentEndDate? new Date(res.incidentEndDate): null;
                    this.showDatesIncident.set(this.nameFunction === 'acceptSolution');
                    this.nameFunction == 'acceptSolution'? this.getTagsOfTicket(): '';
                } else {
                    this.showDatesIncident.set(false);
                }
            }, complete: () => {
                this.getParameters();
            },
        })
    }

    private getTagsOfTicket() {
        this.ticketService.getAvailableTagsByTicketId(this.ticketId).subscribe({
            next: (res) => {
                this.tags.set(res);
            }
        });
    }

    public loadFile(dataFile: File) {
        this.fileUploaded = dataFile;
    }

    public fillDescriptionTicket(divDescriptionTicket: ElementRef) {
        if (divDescriptionTicket) {
            const descriptionTicket = divDescriptionTicket.nativeElement;
            const images: HTMLImageElement[] = descriptionTicket.querySelectorAll('img');
            this.formatImagesService.widthImgaesInsideContainer(images, '75%', this.imagePreview()); 
        }
    }

    private reset(): void {
        this.formDescription.reset();
        if (this.nameFunction == 'acceptSolution')
            this.formDescription.patchValue({ serviceQuality: 7 });
        if (this.nameFunction == 'finishTicket')
            this.formDescription.patchValue({ sendEmail: true });
    };
    
    public closeModal(): void {
        this.openModal = false;
    };

    public saveData() {
        this.nameFunction == 'acceptSolution' && this.ticket().typeTicket == TypeTicketEnum.INCIDENTE?
            this.saveIncidentDates()
            : this.submitModalDescription();
    }

    private saveIncidentDates() {
        const body: IncidentDates = {
            startDate: this.datePipe.transform(this.incidentStartDate, FORMAT_DATE_TIME_SEND),
            endDate: this.datePipe.transform(this.incidentEndDate, FORMAT_DATE_TIME_SEND),
            tagId: this.selectedTag
        };
        this.ticketService.updateIncidentDates(this.ticketId, body).subscribe({
            next: () => {
                this.submitModalDescription();
            }
        })
    }

    private submitModalDescription() {
        if (this.formDescription.value.description) {
            this.formDescription.value.description = this.formDescription.value.description.split('&nbsp;').join(' ');
        }
        const data: INextFunctionAndFile = {
            body: {...this.formDescription.value},
            attachment: this.fileUploaded
        }
        if (this.nameFunction == 'acceptSolution') {
            const serviceQuality = this.fieldsModalDescription.find( field => field.formControlName == 'serviceQuality').list[this.formDescription.value.serviceQuality-1].value;
            data.body.serviceQuality = serviceQuality as string;
        }
        this.eventSendData.emit(data);
    };
}
