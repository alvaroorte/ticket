import { Component, inject, input } from '@angular/core';
import { HelpersService } from '@core/services/helpers.service';
import { MESSAGES } from '@core/constants/messages';
import { LABELS } from '@core/constants/labels';
import { CostCenterService } from '../../services/cost-center.service';
import { ICostCenter, IUploadExcelCostCenter } from '@core/interfaces/cost-center.inteface.';
import { Severity } from '@core/enums/severity';
import { FileService } from '@core/services/file-service.service';
import { PrimeModules } from '@shared/prime-components/prime-components.module';
import { InputFileComponent } from '@shared/components/input-file/input-file.component';
import { ModeInputFile } from '@core/enums/file.enum';
import { GenericTableComponent } from '@shared/components/generic-table/generic-table.component';

@Component({
    selector: 'app-modal-file',
    templateUrl: './modal-file.component.html',
    imports: [
      PrimeModules,
      InputFileComponent
    ]
})
export class ModalFileComponent {

  readonly enterpriseId = input.required<number>();

  private helpersService = inject(HelpersService);
  private costCenterService = inject(CostCenterService);
  private fileService = inject(FileService);

  public readonly messages = MESSAGES;
  public readonly labels = LABELS;
  public readonly modeBasic = ModeInputFile.BASIC;
  public readonly tittleForm = 'Cargar plantilla con datos';
  public showModal: boolean = false;
  public file: File;
  private tableComponent = this.costCenterService.eventTableComponent;

  ngOnInit() {
    this.costCenterService.eventOpenModalFile.subscribe(() => {
      this.openModal();
    });
  };

  public hideModal() {
    this.showModal = false;
  };
  
  private openModal(){
    this.showModal = true;
  };

  public setFile(file: File) {
    this.file = file;
  }

  public async submit() {
  const base64 = await this.fileService.convertFileToBase64(this.file, true);
    const data: IUploadExcelCostCenter = {
      base64File: base64,
      enterpriseId: this.enterpriseId()
    };
    this.costCenterService.uploadExcel(data).subscribe({
      next: () => {
        this.helpersService.messageNotification(Severity.success, "Correcto", MESSAGES.excelUploadSuccess);
        this.hideModal();
      }, complete: () => {
        this.tableComponent().reload();
      }
    })
  };
}
