import { ChangeDetectionStrategy, Component, inject, signal, Output, EventEmitter } from '@angular/core';
import { Table } from 'primeng/table';
import { Enterprise } from 'src/app/core/models/Enterprise';
import { EnterprisesService } from '../../services/enterprises.service';
import { FormComponent } from '../form/form.component';
import { HelpersService } from 'src/app/core/services/helpers.service';
import { TableComponent as TableEnterpriseCategoriesComponent } from "@enterpriseCategory/components/table/table.component";
import { TableComponent as TableEnterpriseCategoryDetailComponent } from "@enterpriseCategoryDetail/components/table/table.component";
import { EnterpriseCategoriesService } from '@enterpriseCategory/services/enterpriseCategories.service';
import { EnterpriseCategoryDetailService } from '@enterpriseCategoryDetail/services/enterpriseCategoryDetail.service';


@Component({
  selector: 'app-table',
  templateUrl: './table.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})

export class TableComponent {
  @Output() rowSelected = new EventEmitter<Enterprise>();

  private enterprisesService = inject(EnterprisesService);
  private enterpriseCategoriesService = inject(EnterpriseCategoriesService);
  private enterpriseCategoryDetailService = inject(EnterpriseCategoryDetailService);
  private helpersService = inject(HelpersService);

  enterprises = signal<Enterprise[]>([]);
  selectedEnterprise = signal<Enterprise>(new Enterprise);
  firstPage = 0;
  rows = 5;
  optionsPage = signal([5, 10, 20]);
  loading = signal(false);

  formComponent!: FormComponent;
  tableEnterpriseCategoriesComponent!: TableEnterpriseCategoriesComponent
  tableEnterpriseCategoryDetailComponent!: TableEnterpriseCategoryDetailComponent

  ngOnInit() {
    this.enterprisesService.eventTableComponent.emit(this);
    this.enterpriseCategoriesService.eventTableComponent.subscribe( (tableEnterpriseCategoriesComponent) => {
      this.tableEnterpriseCategoriesComponent = tableEnterpriseCategoriesComponent;
    })

    this.enterpriseCategoryDetailService.eventTableComponent.subscribe( (tableEnterpriseCategoryDetailComponent) => {
      this.tableEnterpriseCategoryDetailComponent = tableEnterpriseCategoryDetailComponent;
    })
    this.getAll();
  }

  getAll(): void {
    this.loading.set(true);
    this.enterprisesService.search(undefined).subscribe({
      next: (res) => {
        this.enterprises.set(res);
        this.loading.set(false);
      },
      error: (err) => {
        console.log(err);
        this.helpersService.messageNotification("error", 'Error', err.message, 3000);
      }
    })
  }

  onGlobalFilter(table: Table, event: Event) {
    table.filterGlobal((event.target as HTMLInputElement).value, 'contains');
  }

  clear(table: Table) {
      table.clear();
  }

  reload (): void {
    this.getAll();
    this.firstPage = 0;
    this.onRowUnselect();
  }

  onRowSelect(event: any) {
    this.selectedEnterprise.set(event.data);
    this.rowSelected.emit(this.selectedEnterprise());
    this.tableEnterpriseCategoriesComponent.listByEnterprise();
    this.tableEnterpriseCategoryDetailComponent.listSubcategory();
  }

  onRowUnselect() {
    this.selectedEnterprise.set(new Enterprise);
    this.rowSelected.emit(this.selectedEnterprise());
    this.tableEnterpriseCategoriesComponent.listByEnterprise();
    this.tableEnterpriseCategoryDetailComponent.listSubcategory();
  }

  switchStatus(enterprise: Enterprise) {
      this.loading.set(false);
      this.enterprisesService.update(Number(enterprise.id), enterprise).subscribe({
         next: resp => {
            this.loading.set(false);
         },
         error: (err) => {
            this.loading.set(false);
            console.log(err);
            this.helpersService.messageNotification("error", 'Error', err.message, 3000);
         }
      });
  }
}
