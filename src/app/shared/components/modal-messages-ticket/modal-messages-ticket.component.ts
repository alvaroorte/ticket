import { Component, ElementRef, inject, signal, viewChild } from '@angular/core';
import { NgClass } from '@angular/common';
import { Image } from 'primeng/image';
import { Subscription } from 'rxjs';
import { TicketService } from '@ticket-historical/services/tickets.service';
import { PrimeModules } from '@shared/prime-components/prime-components.module';
import { PipesModule } from '@core/pipes/pipes.module';
import { ICreateMessages, IMessages } from '@core/interfaces/follow';
import { InputFileComponent } from '../input-file/input-file.component';
import { FileService } from '@core/services/file-service.service';
import { FormsModule } from '@angular/forms';
import { environment } from '@core/environments/environment.development';
import { HelpersService } from '@core/services/helpers.service';
import { Severity } from '@core/enums/severity';
import { FollowService } from '@core/services/follow.service';
import { FormatImagesService } from '@core/services/format-image.service';
import { TOOLTIPS } from '@core/constants/tooltips';
import { MESSAGES } from '@core/constants/messages';
import { fileTypeAllowed } from '@core/constants/file';
import { ModeInputFile } from '@core/enums/file.enum';
import { MessageWsService } from '@core/services/message.service';
import { ViewFileComponent } from '../view-file/view-file.component';
import { InfoOpenModalCommon } from '@core/interfaces/ticket.interface';

@Component({
    selector: 'app-modal-messages-ticket',
    imports: [PrimeModules, PipesModule, InputFileComponent, FormsModule, ViewFileComponent, NgClass],
    templateUrl: './modal-messages-ticket.component.html',
    styleUrls: ['./modal-messages-ticket.component.scss'],
    providers: [FormatImagesService]
})
export class ModalMessageTicketComponent {
    
    readonly lastMessage = viewChild<ElementRef>('lastMessage');
    readonly cardsmessages = viewChild<ElementRef>('cardsmessages');
    readonly imagePreview = viewChild<Image>('imagePreview');

    private followService = inject(FollowService);
    private ticketService = inject(TicketService);
    private fileService = inject(FileService);
    private helpersService = inject(HelpersService);
    private formatImagesService = inject(FormatImagesService);
    private messageWsService = inject(MessageWsService);
    
    public readonly tooltips = TOOLTIPS;
    public readonly messages = MESSAGES;
    public readonly modeInputFile = ModeInputFile;
    public readonly allowedFormats: string = `${fileTypeAllowed.allowedImageFormat},${fileTypeAllowed.allowedOfficeFormat},${fileTypeAllowed.allowedCompressedFormat},${fileTypeAllowed.allowedOtherFormats}`;
    public dataOpenModal: InfoOpenModalCommon;
    private subscriptionModalMessages: Subscription; 
    private subscriptionNewMessage: Subscription;
    public showModalMessages: boolean = false;
    public comment: string;
    public messagesChat = signal<IMessages[]>([]);
    public readonly serverUrl: string = environment.server_url;
    private archivoUploaded: File;

    ngOnInit(): void {
        this.subscriptionModalMessages = this.ticketService.eventOpenModalMessages.subscribe((data) => {
            this.dataOpenModal = {...data};
            this.handlerNewMessage();
            this.resetComment();
            this.getMessages();
        });
    }

    ngOnDestroy(): void {
        this.subscriptionModalMessages?.unsubscribe();
    }

    public onCloseModal() {
        this.unSubscribeNewMessage();
    }

    public unSubscribeNewMessage() {
        if (this.subscriptionNewMessage) this.subscriptionNewMessage.unsubscribe();
        this.messageWsService.unsubscribeNewMessageInModal();
    }

    private handlerNewMessage() {
        this.subscriptionNewMessage = this.messageWsService.eventNewMessageInmodal.subscribe(() => {
            this.getMessages();
        });
        this.messageWsService.handlerNewMessageInModal(this.dataOpenModal.ticketId);
    }

    private getMessages() {
        if (this.dataOpenModal.ticketId > 0) {
            this.followService.getMessages(this.dataOpenModal.ticketId).subscribe({
                next: (res) => {
                    this.messagesChat.set(res);
                    this.showModalMessages = true;
                    this.deleteTicketsUnread();
                    if (res.length > 0) {
                        this.scrollToBottom();
                        setTimeout(() => {
                            this.formatImages();
                        }, 200);
                    }
                }
            });
        }
    }

    private deleteTicketsUnread() {
        const ticketsUnread = [...this.messageWsService.ticketsUnread()];
        const index = ticketsUnread.findIndex(ticket => ticket.ticketId == this.dataOpenModal.ticketId);
        if (index >= 0) {
            ticketsUnread.splice(index, 1);
            this.messageWsService.ticketsUnread.set(ticketsUnread);
        }
    }

    private resetComment() {
        this.comment = "";
    }

    public loadFile(dataFile: File) {
        this.archivoUploaded = dataFile;
    }

    public sendMessage() {
        this.comment = this.comment.split('&nbsp;').join(' ').split('<p></p>').join('');
        if ( this.comment ) {
            this.archivoUploaded? this.uploadFile(): this.createMessage();
        } else {
            this.helpersService.messageNotification(Severity.warn, 'Aviso', 'El mensaje no puede estar vacio.')
            this.resetComment();
        }
    }
    
    public verifyComment() {
        if (this.comment?.includes('<pre')) { 
            this.comment = this.comment.replace('<pre class="ql-syntax" spellcheck="false">', '<p>').replace('</pre>', '</p>');
        }
    }
    
    private createMessage(attachmentId?: number) {
        const body: ICreateMessages = {
            ticketId: this.dataOpenModal.ticketId,
            comment: this.comment,
            attachmentId
        };
        this.followService.create(body).subscribe({
            next: () => {
                this.resetComment();
            }
        });
    }
    
    private uploadFile() {
        const body: FormData = this.fileService.getDataForUploadFile(this.archivoUploaded, "file of message");
        this.fileService.upload(body).subscribe((resp) => {
            this.createMessage(resp.id);
            this.fileService.eventClearFile.emit();
        })
    }

    private scrollToBottom() {
        setTimeout(() => {
          this.lastMessage().nativeElement.scrollIntoView({ behavior: 'smooth' });
        }, 150);
    }

    private formatImages() {
        const sectionCardsMessage = this.cardsmessages().nativeElement;
        const images: HTMLImageElement[] = sectionCardsMessage.querySelectorAll('img');
        this.formatImagesService.widthImgaesInsideContainer(images, '75%', this.imagePreview());
    }
}
