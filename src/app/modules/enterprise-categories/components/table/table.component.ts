import {
   Component,
   EventEmitter,
   Input,
   Output,
   Signal,
   inject,
   signal,
} from '@angular/core';
import { Enterprise } from '@core/models/Enterprise';
import { EnterpriseCategory, EnterpriseCategorySend } from '@core/models/EnterpriseCategory';
import { HelpersService } from '@core/services/helpers.service';
import { EnterpriseCategoriesService } from '@enterpriseCategory/services/enterpriseCategories.service';
import { TableComponent as TableEnterpriseCategoryDetailComponent } from '@enterpriseCategoryDetail/components/table/table.component';
import { EnterpriseCategoryDetailService } from '@enterpriseCategoryDetail/services/enterpriseCategoryDetail.service';
import { Table } from 'primeng/table';

@Component({
   selector: 'app-table',
   templateUrl: './table.component.html'
})
export class TableComponent {
   @Input() enterprise!: Signal<Enterprise>;
   @Output() rowSelected = new EventEmitter<EnterpriseCategory>();

   private enterpriseCategoriesService = inject(EnterpriseCategoriesService);
   private enterpriseCategoryDetailService = inject(
      EnterpriseCategoryDetailService
   );
   private helpersService = inject(HelpersService);

   enterpriseCategories = signal<EnterpriseCategory[]>([]);
   selectedEnterpriseCategories = signal<EnterpriseCategory>(
      new EnterpriseCategory()
   );
   firstPage = 0;
   rows = 5;
   optionsPage = signal([5, 10, 20]);
   loading = signal(false);
   tableEnterpriseCategoryDetailComponent!: TableEnterpriseCategoryDetailComponent;

   ngOnInit() {
      this.enterpriseCategoriesService.eventTableComponent.emit(this);
      this.enterpriseCategoryDetailService.eventTableComponent.subscribe(
         (tableEnterpriseCategoryDetailComponent) => {
            this.tableEnterpriseCategoryDetailComponent =
               tableEnterpriseCategoryDetailComponent;
         }
      );
   }

   listByEnterprise(): void {
      if (this.enterprise() && this.enterprise().id) {
         this.loading.set(true);
         this.enterpriseCategoriesService
            .listByEnterprise(this.enterprise().id as number)
            .subscribe({
               next: (res) => {
                  this.enterpriseCategories.set(res);
                  this.loading.set(false);
               },
               error: (err) => {
                  console.log(err);
                  this.helpersService.messageNotification(
                     'error',
                     'Error',
                     err.message,
                     3000
                  );
               },
            });
      } else {
         this.setEnterpriseCategories([]);
      }
   }

   setEnterpriseCategories(data: EnterpriseCategory[]) {
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
      this.firstPage = 0;
   }

   onRowSelect(event: any) {
      this.selectedEnterpriseCategories.set(event.data);
      this.rowSelected.emit(this.selectedEnterpriseCategories());
      this.tableEnterpriseCategoryDetailComponent.listSubcategory();
   }

   onRowUnselect() {
      this.selectedEnterpriseCategories.set(new EnterpriseCategory());
      this.rowSelected.emit(this.selectedEnterpriseCategories());
      this.tableEnterpriseCategoryDetailComponent.listSubcategory();
   }

   async switchStatus(categoria: EnterpriseCategory) {
      this.loading.set(true);
      const id = Number(categoria.enterpriseCategoryId)
      const enterpriseCategory: EnterpriseCategorySend = {
         category: categoria.id,
         enterprise: categoria.enterprise,
         team: categoria.team,
         status: categoria.status,
         isPublic: categoria.isPublic
      };
      this.enterpriseCategoriesService.update(id, enterpriseCategory).subscribe({
         next: () => {
            this.loading.set(false);
            this.listByEnterprise();
         },
         error: (err) => {
            console.log(err);
            this.loading.set(false);
            this.helpersService.messageNotification('error', 'Error', err.message, 3000);
         }
      });
   }
}
