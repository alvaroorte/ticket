import { Component, inject, signal } from '@angular/core';
import { CategoryResponse } from '@core/models/Category';
import { CategoriesModule } from './categories.module';
import { ModalDeleteComponent } from '@shared/components/modal-delete/modal-delete.component';
import { CategoryService } from './services/categories.service';

import { FormComponent } from './components/form/form.component';
import { CategoryFolderEnum } from '@core/enums/category-folder';
import { ModalAssingSubcategoryComponent } from './components/modal-assing-subcategory/modal-assing-subcategory.component';
import { HelpersService } from '@core/services/helpers.service';
import { ToolbarComponent } from '@shared/components/toolbar/toolbar.component';
import { LABELS } from '@core/constants/labels';
import { TableColumn } from '@core/interfaces/table.interface';
import { TableColumnDefinitions } from '@core/utils/table-column-definitions';
import { GenericTableComponent } from '@shared/components/generic-table/generic-table.component';
import { Severity } from '@core/enums/severity';
import { MESSAGES } from '@core/constants/messages';
import { DropdownCommonInterface } from '@core/interfaces/dropdow-common.interface';
import { SelectButtonOptionClickEvent } from 'primeng/selectbutton';

@Component({
    selector: 'app-categories',
    imports: [CategoriesModule, ModalDeleteComponent, FormComponent, ModalAssingSubcategoryComponent, ToolbarComponent, GenericTableComponent],
    templateUrl: './categories.component.html'
})
export class CategoriesComponent {

  public categoryService = inject(CategoryService);
  private helpersService = inject(HelpersService);

  public readonly labels = LABELS;
  public categoryFolderEnum = CategoryFolderEnum;
  public folder = signal<CategoryFolderEnum>(this.categoryFolderEnum.Category);
  public titleTable: string = LABELS.listOfCategories;
  public categorySelected = signal<CategoryResponse | null>(null);
  public categories = signal<CategoryResponse[]>([]);
  public tableComponent: GenericTableComponent<CategoryResponse>;
  public tableColumnCategoryDefinitions: TableColumn<CategoryResponse>[] = TableColumnDefinitions.getCategoriesColumnsDefinition();
  public readonly folderOptions = signal<DropdownCommonInterface[]>([
    { label: this.labels.categories, value: this.categoryFolderEnum.Category },
    { label: this.labels.subcategories, value: this.categoryFolderEnum.SubCategory }
  ]);
  
  ngOnInit(): void {
    this.getCategories();
  }
  
  public setCategory( category: CategoryResponse  ) {
    this.categorySelected.set(category);
  }
  
  public getCategories(): void {
    this.categoryService.search(this.folder()).subscribe({
      next: (res) => {
        this.categories.set(res);
      }
    })
  }
  
  public onTableSelfEmision(table: GenericTableComponent<CategoryResponse>) {
    this.tableComponent = table;
    this.categoryService.eventTableComponent.set(table);
  }

  public openModalAssingSubcategory() {
    if (this.categorySelected()?.id) {
      this.categoryService.eventOpenModalAssingSubcategory.emit();
    } else {
      this.helpersService.messageNotification(Severity.warn, LABELS.please, MESSAGES.selectARow);
    }
  }

  public onChangedFolder(event: SelectButtonOptionClickEvent) {
    const option: DropdownCommonInterface = event.option;
    if (option.value === this.categoryFolderEnum.Category) {
      this.titleTable = this.labels.listOfCategories;
      this.tableColumnCategoryDefinitions = TableColumnDefinitions.getCategoriesColumnsDefinition();
    } else {
      this.titleTable = this.labels.listOfSubcategories;
      this.tableColumnCategoryDefinitions = TableColumnDefinitions.getSubcategoriesColumnsDefinition();
    }
    this.tableComponent.reload();
  }
}
