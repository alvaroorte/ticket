import { Component, inject, OnInit, signal } from '@angular/core';
import { Enterprise } from 'src/app/core/models/Enterprise';
import { HelpersService } from 'src/app/core/services/helpers.service';
import { EnterpriseService } from './services/enterprises.service';
import { ToolbarComponent } from '@shared/components/toolbar/toolbar.component';
import { ModalDeleteComponent } from '@shared/components/modal-delete/modal-delete.component';
import { BranchComponent } from "../branch/branch.component";
import { EnterpriseCategoriesComponent } from '@enterpriseCategory/enterprise-categories.component';
import { SlaComponent } from '../sla/sla.component';
import { LABELS } from '@core/constants/labels';
import { CostCenterComponent } from '../cost-center/cost-center.component';
import { FieldsetModule } from 'primeng/fieldset';
import { FormComponent } from './components/form/form.component';
import { GenericTableComponent } from '@shared/components/generic-table/generic-table.component';
import { TableColumn } from '@core/interfaces/table.interface';
import { TableColumnDefinitions } from '@core/utils/table-column-definitions';
import { PrimeTableProps } from '@core/utils/prime-table-props';
import { COMMON } from '@core/constants/common';
import { DropdownCommonInterface } from '@core/interfaces/dropdow-common.interface';
import { EnterpriseViewsEnum } from '@core/enums/enterprise-views.enum';
import { SelectButtonModule } from 'primeng/selectbutton';
import { FormsModule } from '@angular/forms';

@Component({
    selector: 'app-enterprises',
    imports: [
      FormsModule,
      FormComponent,
      ModalDeleteComponent, 
      ToolbarComponent, 
      EnterpriseCategoriesComponent, 
      BranchComponent, 
      SlaComponent,
      FieldsetModule,
      SelectButtonModule,
      CostCenterComponent,
      GenericTableComponent
    ],
    templateUrl: './enterprises.component.html',
    providers: [HelpersService]
})
export class EnterprisesComponent implements OnInit {
  
  public enterpriseService = inject(EnterpriseService);
  
  public readonly labels = LABELS;
  public readonly enterpriseViewsEnum = EnterpriseViewsEnum;
  public enterprises = signal<Enterprise[]>([]);
  public enterpriseSelected = signal<Enterprise | null>(null);
  public titleTable = 'Lista de empresas';
  public tableColumnDefinitions: TableColumn<Enterprise>[] =
    TableColumnDefinitions.getEnterprisesColumnsDefinition();
  public tableProps: PrimeTableProps = new PrimeTableProps({ rows: COMMON.minimumRows });
  public selectedView = signal<EnterpriseViewsEnum>(EnterpriseViewsEnum.CATEGORIES);
  public readonly viewOptions = signal<DropdownCommonInterface[]>([
    { label: this.labels.categories, value: EnterpriseViewsEnum.CATEGORIES },
    { label: this.labels.branchs, value: EnterpriseViewsEnum.BRANCHS },
    { label: this.labels.sla, value: EnterpriseViewsEnum.SLAS },
    { label: this.labels.costCenter, value: EnterpriseViewsEnum.COST_CENTERS }
  ]);

  ngOnInit(): void {
    this.getEnterprises();
  }

  public setObject(enterprise: Enterprise) {
    this.enterpriseSelected.set(enterprise);
  }

  public getEnterprises(): void {
    this.enterpriseService.getAll().subscribe({
      next: (res) => this.enterprises.set(res)
    });
  }

  public onTableSelfEmision(table: GenericTableComponent<Enterprise>): void {
    this.enterpriseService.eventTableComponent.set(table);
  }
}

