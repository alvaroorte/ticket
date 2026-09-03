import { Component, inject, signal, input, effect } from '@angular/core';
import { CostCenterService } from './services/cost-center.service';
import { ToolbarComponent } from '@shared/components/toolbar/toolbar.component';
import { ModalDeleteComponent } from '@shared/components/modal-delete/modal-delete.component';
import { ICostCenter } from '@core/interfaces/cost-center.inteface.';
import { TOOLTIPS } from '@core/constants/tooltips';
import { FileService } from '@core/services/file-service.service';
import { MimeTypeEnum } from '@core/enums/mime-type';
import { ModalFileComponent } from './components/modal-file/modal-file.component';
import { TableColumn } from '@core/interfaces/table.interface';
import { TableColumnDefinitions } from '@core/utils/table-column-definitions';
import { PrimeTableProps } from '@core/utils/prime-table-props';
import { COMMON } from '@core/constants/common';
import { GenericTableComponent } from '@shared/components/generic-table/generic-table.component';
import { ModalFormComponent } from './components/modal-form/modal-form.component';
import { PrimeModules } from '@shared/prime-components/prime-components.module';
import { LABELS } from '@core/constants/labels';

@Component({
    selector: 'app-cost-center',
    imports: [PrimeModules, ToolbarComponent, ModalDeleteComponent, ModalFileComponent, GenericTableComponent, ModalFormComponent],
    templateUrl: './cost-center.component.html'
})
export class CostCenterComponent {

  readonly enterpriseId = input.required<number>();

  public tooltips = TOOLTIPS;
    
  public costCenterService = inject(CostCenterService);
  public fileService = inject(FileService);  
  
  public titleTable = LABELS.listOfCostCenter;
  public costCenterSelected = signal<ICostCenter | null>(null);
  public costCenters = signal<ICostCenter[]>([]);
  public tableColumnCostCenterDefinitions: TableColumn<ICostCenter>[] = TableColumnDefinitions.getCostCenterColumnsDefinition();
  public tableProps: PrimeTableProps = new PrimeTableProps({ rows: COMMON.minimumRows });

  constructor() {
    effect(() => {
      if (this.enterpriseId()) {
        this.setCostCenter(null);
        this.getByEnterprise();
      }
    })
  }

  public setCostCenter(costCenter: ICostCenter): void {
    this.costCenterSelected.set(costCenter);
  }

  public getByEnterprise(): void {
    this.costCenterService.getByEnterprise(this.enterpriseId()).subscribe({
      next: (res) => {
        this.costCenters.set(res);
      }
    });
  }

  public onTableSelfEmision(table: GenericTableComponent<ICostCenter>): void {
    this.costCenterService.eventTableComponent.set(table);
  }

  public exportExcel() {
    this.costCenterService.exportExcel().subscribe({
      next: (res) => {
        const file = this.fileService.convertBase64ToFile(res.file, 'Plantilla', MimeTypeEnum.EXCEL);
        this.fileService.downloadFile(file, 'Plantilla');
      }
    })
  }
  
  public uploadExcel() {
    this.costCenterService.eventOpenModalFile.emit();
  }

}
