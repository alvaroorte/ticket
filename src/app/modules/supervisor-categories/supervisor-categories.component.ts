import { Component, SimpleChanges, inject, signal, input, output } from '@angular/core';
import { SupervisorCategory } from '@core/models/SupervisorCategory';
import { ToolbarComponent } from '@shared/components/toolbar/toolbar.component';
import { SupervisorCategoryService } from './services/supervisor-categories.service';
import { GenericTableComponent } from '@shared/components/generic-table/generic-table.component';
import { ISupervisorCategory } from '@core/interfaces/supervisor-category.interface';
import { TableColumn } from '@core/interfaces/table.interface';
import { TableColumnDefinitions } from '@core/utils/table-column-definitions';
import { ModalFormComponent } from './components/modal-form/modal-form.component';

@Component({
    selector: 'app-supervisor-categories',
    imports: [ToolbarComponent, GenericTableComponent, ModalFormComponent],
    templateUrl: './supervisor-categories.component.html'
})
export class SupervisorCategoriesComponent {
  readonly supervisorId = input.required<number>();
  readonly changeSupervisorCategory = output<SupervisorCategory>();

  public supervisorCategoryService = inject(SupervisorCategoryService);
  
  public titleTable = 'Lista de categorías por supervisor';
  public supervisorCategorySelected = signal<ISupervisorCategory | null>(null);
  public tableColumnSupervisorCategoryDefinitions: TableColumn<ISupervisorCategory>[] = TableColumnDefinitions.getSupervisorCategoriesColumnsDefinition();
  public supervisorCategories = signal<ISupervisorCategory[]>([]);

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['supervisorId']) {
      this.setSupervisorCategory(null);
      this.getBySupervisor();
    }
  }

  public setSupervisorCategory(supervisorCategory: ISupervisorCategory): void {
    this.supervisorCategorySelected.set(supervisorCategory);
  }

  public getBySupervisor(): void {
    const supervisorId = this.supervisorId();
    if ( supervisorId ) {
      this.supervisorCategoryService.getBySupervisor(supervisorId).subscribe({
        next: (res) => {
          this.supervisorCategories.set(res);
        }
      })
    } else {
      this.supervisorCategories.set([]);
    }
  }

  public onTableSelfEmision(table: GenericTableComponent<ISupervisorCategory>): void {
    this.supervisorCategoryService.eventTableComponent.set(table);
  }

}
