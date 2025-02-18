import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FileUploadModule } from 'primeng/fileupload';

@Component({
  selector: 'app-input-file',
  standalone: true,
  imports: [CommonModule, FileUploadModule],
  templateUrl: './input-file.component.html'
})
export class InputFileComponent {

  @Output() archivoUploaded = new EventEmitter();
  @Input() label: string = 'Adjuntar evidencia';
  @Input() labelButton: string = 'Subir archivo';
  @Input() showLabel: boolean = true;

  file: any;

  cargarArchivo(event: any) {
    this.file = ( event.currentFiles )? event.currentFiles[0]: null;
    this.archivoUploaded.emit(this.file);
  }
}
