import { Component, inject, Input } from '@angular/core';
import { CategoriesService } from '../../services/categories.service';
import { FormComponent } from '../form/form.component';
import { TableComponent } from '../table/table.component';
import { HelpersService } from 'src/app/core/services/helpers.service';
import { ModaldeleteComponent } from 'src/app/shared/components/modal-delete/modal-delete.component';
import { ModalAssingSubcategoryComponent } from '../modal-assing-subcategory/modal-assing-subcategory.component';
import { CategoryResponse } from '@core/models/Category';

@Component({
  selector: 'app-toolbar',
  templateUrl: './toolbar.component.html'
})
export class ToolbarComponent {

  @Input() showButtonAssingSubcategories: boolean = false;
  @Input() selectedCategory: CategoryResponse = new CategoryResponse();
  
  private formComponent: FormComponent;
  private modalDeleteComponent: ModaldeleteComponent;
  private tableComponent: TableComponent;
  private modalAssingSubcategoryComponent: ModalAssingSubcategoryComponent;
  
  private categoriesService = inject(CategoriesService);
  private helpersService = inject(HelpersService);

  ngOnInit() {
    this.categoriesService.eventToolbarComponent.emit(this);

    this.categoriesService.eventFormComponent.subscribe((formComponent) => {
      this.formComponent = formComponent;
    });

    this.categoriesService.eventModalDeleteComponent.subscribe((modalDeleteComponent) => {
      this.modalDeleteComponent = modalDeleteComponent;
    });

    this.categoriesService.eventTableComponent.subscribe((tableComponent) => {
      this.tableComponent = tableComponent;
    });
    this.categoriesService.eventModalAssingSubcategory.subscribe((modalAssingSubcategoryComponent) => {
      this.modalAssingSubcategoryComponent = modalAssingSubcategoryComponent;
    });
  }

  create() {
    this.formComponent.openCreate();
  }

  edit() {
    if ( this.selectedCategory && this.selectedCategory.id ) {
      this.formComponent.openEdit(this.selectedCategory.id!);
    } else {
      this.helpersService.messageNotification("warn", "Por favor", `Seleccione una Categoría`, 3000);
    }
  }

  deleteCategory() {
    if ( this.selectedCategory && this.selectedCategory.id ) {
      this.categoriesService.eventDeleteRow.emit(this.selectedCategory.id);
      this.modalDeleteComponent.openConfirm();
    } else {
      this.helpersService.messageNotification("warn", "Por favor", `Seleccione una Categoría`, 3000);
    }
  }

  reload() {
    this.tableComponent.reload();
  }

  public openModalAssingSubcategory() {
    if (this.selectedCategory && this.selectedCategory.id) {
      this.modalAssingSubcategoryComponent.openModal();
    } else {
      this.helpersService.messageNotification("warn", "Por favor", `Seleccione una Categoría`, 3000);
    }
  }
}
