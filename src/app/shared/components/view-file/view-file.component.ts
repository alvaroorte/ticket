import { Component, OnInit, inject, input, signal, viewChild } from '@angular/core';
import { TicketService } from '@ticket-historical/services/tickets.service';
import { environment } from '@core/environments/environment.development';
import { TOOLTIPS } from '@core/constants/tooltips';
import { FileService } from '@core/services/file-service.service';
import { MimeTypeEnum } from '@core/enums/mime-type';
import { TooltipModule } from 'primeng/tooltip';
import { ButtonModule, ButtonSeverity } from 'primeng/button';
import { Image, ImageModule } from 'primeng/image';

@Component({
    selector: 'app-view-file',
    imports: [
      TooltipModule,
      ButtonModule,
      ImageModule
    ],
    templateUrl: './view-file.component.html'
})
export class ViewFileComponent implements OnInit {

    readonly fileName = input.required<string>();
    readonly isUserGenerated = input<boolean>(true);
    readonly imagePreview = viewChild.required<Image>('imagePreview');

    private ticketService = inject(TicketService);
    private fileService = inject(FileService);

    public readonly tooltips = TOOLTIPS;
    public readonly serverUrl: string = environment.server_url;
    public showButtonPreview = signal<boolean>(false);
    public severityButton: ButtonSeverity;
    public iconFIle: string = '';
   
    ngOnInit(): void {
      this.getDatForFile();
    }
    
    private getDatForFile() {
      this.showButtonPreview.set(false);
      switch (this.fileName().split('.')[1].toLowerCase()) {
        case 'docx':
          this.severityButton = 'info';
          break;
        case 'xlsx':
          this.severityButton = 'primary';
          break;
        case 'xls':
          this.severityButton = 'primary';
          break;
        case 'pdf':
          this.iconFIle = 'pi pi-file-pdf';
          this.severityButton = 'danger';
          this.showButtonPreview.set(true);
          break;
        case 'pptx':
          this.severityButton = 'warn';
          break;
        case 'txt':
          this.severityButton = 'secondary';
          break;
        case 'zip':
          this.severityButton = 'secondary';
          break;
        case 'rar':
          this.severityButton = 'secondary';
          break;
        default:
          this.iconFIle = 'pi pi-image';
          this.severityButton = 'help';
          this.showButtonPreview.set(true);
          break;
      }
    }
    
    public showFile() {
      const fileName = this.fileName();
      const isPdf: boolean = fileName.toLocaleLowerCase().includes('pdf');
      const mimeType: string = isPdf? MimeTypeEnum.PDF: MimeTypeEnum.IMAGE; 
      this.fileService.getFile(fileName).subscribe({
        next: async (resp) => {
          const file: File = new File([resp], fileName, { type: mimeType });
          if (isPdf) {
            this.fileService.openFileInNewTab(file);
          } else {
            const imageSrc = await this.fileService.convertFileToBase64(file, false)
            this.imagePreview().src = imageSrc;
            this.imagePreview().previewImageSrc = imageSrc;
            this.imagePreview().onImageClick();
          }          
        }
      })
    }

    public downloadFile() {
      this.fileService.getFile(this.fileName()).subscribe({
        next: (blob) => {
          const url = window.URL.createObjectURL(blob);

          const a = document.createElement('a');
          a.href = url;
          a.download = this.fileName();

          a.click();

          window.URL.revokeObjectURL(url);
        },
      })
    }

}
