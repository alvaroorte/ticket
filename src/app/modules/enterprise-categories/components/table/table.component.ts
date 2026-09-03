import { Component, inject, signal, input, output, effect } from '@angular/core';
import { LABELS } from '@core/constants/labels';
import { MESSAGES } from '@core/constants/messages';
import { TOOLTIPS } from '@core/constants/tooltips';
import { IGenericTable } from '@core/interfaces/generic-table.interface';
import { EnterpriseCategory } from '@core/models/EnterpriseCategory';
import { EnterpriseCategoryService } from '@enterpriseCategory/services/enterpriseCategories.service';
import { PrimeModules } from '@shared/prime-components/prime-components.module';
import { Table, TableRowSelectEvent } from 'primeng/table';

@Component({
    selector: 'app-table',
    templateUrl: './table.component.html',
    imports: [PrimeModules]
})
export class TableComponent implements IGenericTable {
   readonly enterpriseId = input.required<number>();
   readonly rowSelected = output<EnterpriseCategory>();

   public readonly messages = MESSAGES;
   public readonly labels = LABELS;
   public readonly tooltips = TOOLTIPS;
   public enterpriseCategories = signal<EnterpriseCategory[]>([]);
   public selectedEnterpriseCategory = signal<EnterpriseCategory>(null);
   public firstPage = 0;
   public rows = 5;
   public optionsPage = signal([5, 10, 20]);
   public loading = signal(false);
   public tooltipSearch: string = 'Este campo busca por: Categoría, Subcategoría, Equipo, Aprobador y Moderador';
   
   private enterpriseCategoryService = inject(EnterpriseCategoryService);

   ngOnInit() {
      this.enterpriseCategoryService.eventTableComponent.set(this);
   }

   constructor() {
      effect(() => {
         if (this.enterpriseId()) {
            this.onRowUnselect();
            this.listByEnterprise();
         }
      })
   }


   private listByEnterprise(): void {
      if (this.enterpriseId()) {
         this.loading.set(true);
         this.enterpriseCategoryService.getByEnterprise(this.enterpriseId()).subscribe({
            next: (res: EnterpriseCategory[]) => {
               this.enterpriseCategories.set(res.map(enterpriseCategory => {
                  return {
                     ...enterpriseCategory,
                     rolesString: enterpriseCategory.roles?.join(', ')
                  }
               }));
               this.loading.set(false);
            }
         });
      } else {
         this.setEnterpriseCategoryDetail([]);
      }
   }

   private setEnterpriseCategoryDetail(data: EnterpriseCategory[]) {
      this.enterpriseCategories.set(data);
   }

   onGlobalFilter(table: Table, event: Event) {
      table.filterGlobal((event.target as HTMLInputElement).value, 'contains');
   }

   clear(table: Table) {
      table.clear();
   }

   reload(): void {
      this.listByEnterprise();
      this.onRowUnselect();
      this.firstPage = 0;
   }

   onRowSelect(event: TableRowSelectEvent) {
      this.rowSelected.emit(event.data);
   }

   onRowUnselect() {
      this.selectedEnterpriseCategory.set(null)
      this.rowSelected.emit(null);
   }
}
