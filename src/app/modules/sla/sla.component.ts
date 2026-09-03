import { Component, inject, signal, input, effect } from '@angular/core';
import { ISla } from '@core/interfaces/sla.inteface.';
import { SlaService } from './services/sla.service';
import { ToolbarComponent } from '@shared/components/toolbar/toolbar.component';
import { ModalDeleteComponent } from '@shared/components/modal-delete/modal-delete.component';
import { TableColumn } from '@core/interfaces/table.interface';
import { TableColumnDefinitions } from '@core/utils/table-column-definitions';
import { PrimeTableProps } from '@core/utils/prime-table-props';
import { COMMON } from '@core/constants/common';
import { GenericTableComponent } from '@shared/components/generic-table/generic-table.component';
import { ModalFormComponent } from './components/modal-form/modal-form.component';

@Component({
    selector: 'app-sla',
    imports: [ToolbarComponent, ModalDeleteComponent, GenericTableComponent, ModalFormComponent],
    templateUrl: './sla.component.html',
    styles: []
})
export class SlaComponent {

  readonly enterpriseId = input.required<number>();
    
  public slaService = inject(SlaService);

  public titleTable = 'Lista de SLA';
  public slaSelected = signal<ISla | null>(null);
  public slas = signal<ISla[]>([]);
  public tableColumnSlaDefinitions: TableColumn<ISla>[] = TableColumnDefinitions.getSlaColumnsDefinition();
  public tableProps: PrimeTableProps = new PrimeTableProps({ rows: COMMON.minimumRows });

  constructor() {
    effect(() => {
      if (this.enterpriseId()) {
        this.setSla(null);
        this.getByEnterprise();
      }
    })
  }

  public setSla(sla: ISla): void {
    this.slaSelected.set(sla);
  }

  public getByEnterprise(): void {
    this.slaService.getByEnterprise(this.enterpriseId()).subscribe({
      next: (res) => {
        this.slas.set(res);
      }
    });
  }

  public onTableSelfEmision(table: GenericTableComponent<ISla>): void {
    this.slaService.eventTableComponent.set(table);
  }

}
