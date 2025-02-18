import { CommonModule } from '@angular/common';
import { Component, inject, Input, signal } from '@angular/core';
import { CategoriesService } from '@category/services/categories.service';
import { CategoryResponse } from '@core/models/Category';
import { DataCommon } from '@core/models/FieldsCommons';
import { HelpersService } from '@core/services/helpers.service';
import { TableDoubleComponent } from '@shared/components/table-double/table-double.component';
import { PrimeComponentsModule } from '@shared/prime-components/prime-components.module';


@Component({
   selector: 'app-modal-assing-subcategory',
   standalone: true,
   templateUrl: './modal-assing-subcategory.component.html',
   imports: [CommonModule, PrimeComponentsModule, TableDoubleComponent]
})
export class ModalAssingSubcategoryComponent {

   @Input({required: true}) selectedCategory: CategoryResponse;

   public showModal: boolean = false;
   public titleForm: string = 'Asignar subcategoria';

   public categoriesService = inject(CategoriesService);
   private helpersService = inject(HelpersService);

   public sourceProducts = signal<DataCommon[]>([]);
   public targetProducts = signal<DataCommon[]>([]);

   ngOnInit() {
      this.categoriesService.eventModalAssingSubcategory.emit(this);
   }

   public openModal() {
      this.getSubCategories();
      this.showModal = true;
   }

   private getSubCategories() {
      this.cleanSubCategories();
      this.categoriesService.detailByCategory(this.selectedCategory.id).subscribe({
         next: (res) => {
         this.targetProducts.set(res.filter( dato => dato.code != null ));
         this.sourceProducts.set(res.filter( dato => dato.code == null ));
         },
         error: (err) => {
         console.log(err);
         }
      });
   }

   private cleanSubCategories() {
      this.targetProducts.set([]);
      this.sourceProducts.set([]);
   }

   public add(items:any){
      let subcategory = items[0];
      let body = {
         category: this.selectedCategory.id,
         subCategory: subcategory.id
      };
      this.categoriesService.createOne(body).subscribe({
         next: () => {
         this.helpersService.messageNotification("success", "Correcto", `Se asignó la Subcategoría correctamente.`, 2000);
         this.getSubCategories();
         },
         error: (err) => {
         console.log(err);
         this.getSubCategories();
         }
      });
   }

   public allAdd(items:any){
      let subcategories = items;
      let body:any[] = [];
      subcategories.map( (subCategory: DataCommon) => {
         body.push({
            category: this.selectedCategory.id,
            subCategory: subCategory.id
         })
      });
      this.categoriesService.createList(body).subscribe({
         next: () => {
         this.helpersService.messageNotification("success", "Correcto", `Se asignó todas las Subcategorías correctamente.`, 3000);
         this.getSubCategories();
         },
         error: (err) => {
         console.log(err);
         this.getSubCategories();
         }
      });
   }

   public remove(items:any){
      let subcategory: DataCommon = items[0];
      this.categoriesService.deleteOne(subcategory.code as string ).subscribe({
         next: () => {
         this.helpersService.messageNotification("warn", "Correcto", `Se quitó la Subcategoría correctamente.`, 2000);
         this.getSubCategories();
         },
         error: (err) => {
         console.log(err);
         this.getSubCategories();
         }
      });
   }

   public allRemove(items:any){
      let subcategories = items;
      let body:any[] = [];
      subcategories.map( (subCategory: DataCommon) => {
         body.push({
            id: subCategory.code
         })
      });
      this.categoriesService.deleteList(body).subscribe({
         next: () => {
         this.helpersService.messageNotification("warn", "Correcto", `Se quitó todas las Subcategorías correctamente.`, 3000);
         this.getSubCategories();
         },
         error: (err) => {
         console.log(err);
         this.getSubCategories();
         }
      });
   }
  
}
