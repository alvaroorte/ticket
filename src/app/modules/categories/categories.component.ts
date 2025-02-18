import { Component, inject, signal } from '@angular/core';
import { CategoryResponse } from '@core/models/Category';
import { CategoriesModule } from './categories.module';
import { ModaldeleteComponent } from '@shared/components/modal-delete/modal-delete.component';
import { CategoriesService } from './services/categories.service';
import { CommonModule } from '@angular/common';
import { FormComponent } from './components/form/form.component';
import { MenuItem } from 'primeng/api';
import { CategoryFolder } from '@core/enums/category-folder';
import { ModalAssingSubcategoryComponent } from './components/modal-assing-subcategory/modal-assing-subcategory.component';
import { HelpersService } from '@core/services/helpers.service';

@Component({
  selector: 'app-categories',
  standalone: true,
  imports: [ CommonModule, CategoriesModule, ModaldeleteComponent, FormComponent, ModalAssingSubcategoryComponent ],
  templateUrl: './categories.component.html'
})
export class CategoriesComponent {

  public idDelete = signal<number>(0);
  public categories = signal<CategoryResponse[]>([]);
  public selectedCategory: CategoryResponse;
  public categoryFolder = CategoryFolder;
  public folder: CategoryFolder = this.categoryFolder.category;
  public titleTable: string = "Listado de categorias";
  
  public categoriesService = inject(CategoriesService);
  private helpersService = inject(HelpersService);

  public items: MenuItem[] = [
    { label: 'Categorias', 
      icon: 'pi pi-home', 
      command: () => {
        this.folder = this.categoryFolder.category;
        this.titleTable = "Listado de categorias";
        this.getAll();
      }
      
    },
    { label: 'Subcategorias',
      icon: 'pi pi-chart-line',
      command: () => {
        this.folder = this.categoryFolder.subCategory;
        this.titleTable = "Listado de subcategorias";
        this.getAll();
      } 
      }
  ];
  public activeItem: MenuItem = this.items[0];

  ngOnInit(): void {
    this.getAll();
    this.categoriesService.eventDeleteRow.subscribe( id => this.idDelete.set(id) );
  }

  public getAll(): void {
    this.categoriesService.search(this.folder).subscribe({
      next: (res) => {
        this.categories.set(res);
      },
      error: (err) => {
        console.log(err);
        this.helpersService.messageNotification("error", 'Error', err.message, 3000);
      }
    })
  }

  public setSelectedCategory(category: CategoryResponse) {
    this.selectedCategory = category;
  }
}
