import { Component, inject, OnInit, input, viewChild, output, signal, ChangeDetectionStrategy, afterNextRender, DestroyRef } from '@angular/core';
import { FileSelectEvent, FileUpload, FileUploadModule } from 'primeng/fileupload';
import { TooltipModule } from 'primeng/tooltip';
import { FileService } from '@core/services/file-service.service';
import { LABELS } from '@core/constants/labels';
import { TOOLTIPS } from '@core/constants/tooltips';
import { ModeInputFile } from '@core/enums/file.enum';
import { MESSAGES } from '@core/constants/messages';
import { ButtonModule, ButtonProps } from 'primeng/button';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

@Component({
    selector: 'app-input-file',
    imports: [FileUploadModule, TooltipModule, ButtonModule],
    templateUrl: './input-file.component.html',
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class InputFileComponent implements OnInit {
  
  readonly fileUploadInput = viewChild<FileUpload>('fileUploadInput');

  private fileService = inject(FileService);
  private destroyRef = inject(DestroyRef);

  readonly typeFileAccept = input<string>('');
  readonly maxSizeAllowed = input<number>(25000000);
  readonly mode = input<ModeInputFile>(ModeInputFile.ADVANCED);
  readonly file = input<File>();
  readonly onFileUploaded = output<File>();

  public readonly tooltips = TOOLTIPS;
  public readonly messages = MESSAGES;
  public readonly labels = LABELS;
  public readonly modeInputFile = ModeInputFile;
  public labelButton = signal<string>(LABELS.uploadFile);
  public chooseButtonProps: ButtonProps = {
    severity: 'info',
    rounded: true,
    label: LABELS.uploadFile,
    size: 'small',
    styleClass: 'hover-info shadow-3 p-2 h-auto',
  }

  constructor() {
    afterNextRender(() => {
      const upload = this.fileUploadInput();
      if (this.file() && upload) {
        upload.files = [this.file()];
        upload.onSelect.emit({ currentFiles: [this.file()], files: [], originalEvent: null });
      }
    });
  }
  
  ngOnInit(): void {
    this.fileService.eventClearFile.pipe(takeUntilDestroyed(this.destroyRef)).subscribe(() => {
      this.clearFile();
    })
  }

  public loadFile(event?: FileSelectEvent) {
    const file: File = event? event.currentFiles[0]: null;
    this.onFileUploaded.emit(file);
    this.labelButton.set(file? file.name: LABELS.uploadFile);
  }
  
  public clearFile() {
    this.fileUploadInput().clear();
    this.loadFile();
  }
}
