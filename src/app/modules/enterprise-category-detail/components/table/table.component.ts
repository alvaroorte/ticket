import { Component, EventEmitter, Input, Output, Signal, inject, signal } from '@angular/core';
import { Enterprise } from '@core/models/Enterprise';
import { EnterpriseCategory } from '@core/models/EnterpriseCategory';
import { EnterpriseCategoryDetailService } from '../../services/enterpriseCategoryDetail.service';
import { HelpersService } from '@core/services/helpers.service';
import { EnterpriseCategoryDetail, EnterpriseCategoryDetailSend, ListSubcategoryBody } from '@core/models/EnterpriseCategoryDetail';
import { Table } from 'primeng/table';

@Component({
  selector: 'app-table',
  templateUrl: './table.component.html'
})
export class TableComponent {
  @Input() enterprise!: Signal<Enterprise>;
  @Input() enterpriseCategory!: Signal<EnterpriseCategory>;
  @Output() rowSelected = new EventEmitter<EnterpriseCategoryDetail>();

  private enterpriseCategoryDetailService = inject(EnterpriseCategoryDetailService);
  private helpersService = inject(HelpersService);

  enterpriseCategoryDetails = signal<EnterpriseCategoryDetail[]>([]);
  selectedEnterpriseCategoryDetail = signal<EnterpriseCategoryDetail>(new EnterpriseCategoryDetail);
  firstPage = 0;
  rows = 5;
  optionsPage = signal([5, 10, 20]);
  loading = signal(false);

  ngOnInit() {
    this.enterpriseCategoryDetailService.eventTableComponent.emit(this);
    this.listSubcategory();
  }

  listSubcategory(): void {
    if ( this.enterprise() && this.enterprise().id && this.enterpriseCategory() && this.enterpriseCategory().categoryId ) {
      this.loading.set(true);
      const body: ListSubcategoryBody = {
        enterprise: this.enterprise().id!,
        category: this.enterpriseCategory().categoryId,
        subCategory: this.enterpriseCategory().subCategoryId
      }
      this.enterpriseCategoryDetailService.listSubcategory(body).subscribe({
        next: (res) => {
          this.enterpriseCategoryDetails.set(res);
          this.loading.set(false);
        },
        error: (err) => {
          console.log(err);
          this.helpersService.messageNotification("error", 'Error', err.message, 3000);
        }
      })
    } else {
      this.setEnterpriseCategoryDetail([]);
    }
  }

  setEnterpriseCategoryDetail( data:EnterpriseCategoryDetail[] ) {
    this.enterpriseCategoryDetails.set(data);
  }

  onGlobalFilter(table: Table, event: Event) {
    table.filterGlobal((event.target as HTMLInputElement).value, 'contains');
  }

  clear(table: Table) {
      table.clear();
  }

  reload (): void {
    this.listSubcategory();
    this.firstPage = 0;
  }

  onRowSelect(event: any) {
    this.selectedEnterpriseCategoryDetail.set(event.data);
    this.rowSelected.emit(this.selectedEnterpriseCategoryDetail());
  }

  onRowUnselect() {
    this.selectedEnterpriseCategoryDetail.set(new EnterpriseCategoryDetail);
    this.rowSelected.emit(this.selectedEnterpriseCategoryDetail());
  }

   switchStatus(categoria: EnterpriseCategoryDetail) {
      this.loading.set(true);
      const id = Number(categoria.id)
      const enterpriseCategoryDetail: EnterpriseCategoryDetailSend = {
         enterprise: this.enterpriseCategory().enterprise,
         category: Number(this.enterpriseCategory().id),
         subCategory: categoria.subCategoryId,
         moderator: categoria.moderatorid,
         approved: categoria.approvedid,
         isPublic: categoria.isPublic
      };
      const action = id === 0?
        this.enterpriseCategoryDetailService.create(enterpriseCategoryDetail)
        : this.enterpriseCategoryDetailService.update(id, enterpriseCategoryDetail);
      action.subscribe({
        next: () => {
          this.reload();
          this.loading.set(false)
        },
        error: (err) => {
           this.loading.set(false)
           console.log(err);
           this.helpersService.messageNotification("error", 'Error', err.message, 3000);
        }
     })
   }
}
