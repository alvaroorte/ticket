import { Component, EventEmitter, Input, Output, inject, signal } from '@angular/core';
import { FollowService } from './service/follow.service';
import { Follow } from '@core/models/follow';
import { FileService } from '@core/services/fileService';
import { HelpersService } from '@core/services/helpers.service';
import { CommonModule } from '@angular/common';
import { PrimeComponentsModule } from '@shared/prime-components/prime-components.module';
import { InputFileComponent } from '@shared/components/input-file/input-file.component';
import { FormsModule } from '@angular/forms';


@Component({
  selector: 'app-ticket-flow',
  standalone: true,
  imports: [ CommonModule, PrimeComponentsModule, InputFileComponent, FormsModule ],
  templateUrl: './ticket-flow.component.html'
})
export class TicketFlowComponent {

  @Input() idTicket: number = 0;
  @Output() eventSendMessageFollow = new EventEmitter();

  description: string = '';
  archivoUploaded: any;
  idArchivoUploaded: number | null = null;
  isLoading = signal(false);
  acordionMessage = signal(false);
  activeIndex: number = 1;

  followService = inject(FollowService);
  fileService = inject(FileService);
  helpersService = inject(HelpersService);

  cargarArchivo(dataFile: any) {
    this.archivoUploaded = dataFile;
    dataFile && !this.description? this.description = 'archivo sin descripción': '';
  }

  createTicketFlow () {
    this.archivoUploaded? this.uploadFile(): this.sendFollow();
  }

  sendFollow() {
    let body: Follow = new Follow;
    body.ticket = this.idTicket;
    body.detail = this.description;
    ( this.idArchivoUploaded )? body.attachment = this.idArchivoUploaded: '';
    this.followService.create(body).subscribe({
      next: () => {
        this.activeIndex = 1;
        this.eventSendMessageFollow.emit();
      },
      error: (err) => {
        console.log(err);
        this.helpersService.messageNotification("error", 'Error', err.message, 3000);
      }
    });
  }

  uploadFile() {
    try {
        const formData = new FormData();
        formData.append('file', this.archivoUploaded);
        formData.append('detail', 'archivo de Follow');
        this.fileService.upload(formData).subscribe({
            next: ( res ) => {
                this.idArchivoUploaded = res.id;
                this.sendFollow();
                this.cargarArchivo(null);
            },
            error: (err) => {
                console.log(err);
                this.helpersService.messageNotification("error", 'Error', err.message, 3000);
            }
        });
    } catch (error) {
    }
  }

  resetDescription() {
    this.description = '';
  }

  stateAcordion(e: any) {
    this.activeIndex = e;
    this.resetDescription();
  }
}
