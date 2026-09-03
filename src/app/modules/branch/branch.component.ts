import { Component, effect, inject, signal, input } from '@angular/core';
import { BranchService } from './services/branch.service';
import { Branch } from '@core/interfaces/branch.interface';
import { BranchModule } from './branch.module';
import { ToolbarComponent } from '@shared/components/toolbar/toolbar.component';
import { ModalDeleteComponent } from '@shared/components/modal-delete/modal-delete.component';
import { PrimeTableProps } from '@core/utils/prime-table-props';
import { COMMON } from '@core/constants/common';
import { TableColumn } from '@core/interfaces/table.interface';
import { TableColumnDefinitions } from '@core/utils/table-column-definitions';
import { GenericTableComponent } from '@shared/components/generic-table/generic-table.component';
import { ModalFormComponent } from './components/modal-form/modal-form.component';

@Component({
    selector: 'app-branch',
    imports: [BranchModule, ToolbarComponent, ModalDeleteComponent, GenericTableComponent, ModalFormComponent],
    templateUrl: './branch.component.html'
})
export class BranchComponent {

  readonly enterpriseId = input.required<number>();

  public branchService = inject(BranchService);

  public titleTable = 'Lista de sucursales';
  public branchSelected = signal<Branch | null>(null);
  public branchs = signal<Branch[]>([]);
  public tableColumnBranchDefinitions: TableColumn<Branch>[] = TableColumnDefinitions.getBranchColumnsDefinition();
  public tableProps: PrimeTableProps = new PrimeTableProps({ rows: COMMON.minimumRows });

  constructor() {
    effect(() => {
      if (this.enterpriseId()) {
        this.setBranch(null);
        this.getByEnterprise();
      }
    });
  }

  public setBranch(branch: Branch): void {
    this.branchSelected.set(branch);
  }

  public getByEnterprise(): void {
    this.branchService.getByEnterprise(this.enterpriseId()).subscribe({
      next: (res) => {
        this.branchs.set(res);
      }
    });
  }

  public onTableSelfEmision(table: GenericTableComponent<Branch>): void {
    this.branchService.eventTableComponent.set(table);
  }

}
