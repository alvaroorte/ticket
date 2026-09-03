
import { Component, inject, signal, input } from '@angular/core';
import { CategoryService } from '@category/services/categories.service';
import { CategoryResponse, SubcategoryForAsignToCategory, SubcategorySendAddToCategory } from '@core/models/Category';
import { HelpersService } from '@core/services/helpers.service';
import { TableDoubleComponent } from '@shared/components/table-double/table-double.component';
import { PrimeModules } from '@shared/prime-components/prime-components.module';


@Component({
    selector: 'app-modal-assing-subcategory',
    templateUrl: './modal-assing-subcategory.component.html',
    imports: [PrimeModules, TableDoubleComponent]
})
export class ModalAssingSubcategoryComponent {

   readonly categorySelected = input.required<CategoryResponse>();

   public showModal = false;
   public titleForm = 'Asignar subcategoría';

   public categoryService = inject(CategoryService);
   private helpersService = inject(HelpersService);

   public sourceProducts = signal<SubcategoryForAsignToCategory[]>([]);
   public targetProducts = signal<SubcategoryForAsignToCategory[]>([]);

   ngOnInit() {
      this.categoryService.eventOpenModalAssingSubcategory.subscribe(() => this.openModal());
   }

   public openModal() {
      this.getSubCategories();
      this.showModal = true;
   }

   private getSubCategories() {
      this.cleanSubCategories();
      this.categoryService.detailByCategory(this.categorySelected().id).subscribe({
         next: (res) => {
            this.targetProducts.set(res.filter( dato => dato.code != null ));
            this.sourceProducts.set(res.filter( dato => dato.code == null ));
         }
      });
   }

   private cleanSubCategories() {
      this.targetProducts.set([]);
      this.sourceProducts.set([]);
   }

   public add(items: SubcategoryForAsignToCategory[]){
      const subcategory: SubcategoryForAsignToCategory = items[0];
      const body: SubcategorySendAddToCategory = {
         category: this.categorySelected().id,
         subCategory: subcategory.id
      };
      this.categoryService.createOne(body).subscribe({
         next: () => {
            this.helpersService.messageNotification("success", "Correcto", `Se asignó la Subcategoría correctamente.`, 2000);
         }, complete: () => {
            this.getSubCategories();
         }
      });
   }

   public allAdd(items: SubcategoryForAsignToCategory[]) {
      let body: SubcategorySendAddToCategory[] = [];
      items.map( (subCategory: SubcategoryForAsignToCategory) => {
         body.push({
            category: this.categorySelected().id,
            subCategory: subCategory.id
         })
      });
      this.categoryService.createList(body).subscribe({
         next: () => {
            this.helpersService.messageNotification("success", "Correcto", `Se asignó todas las Subcategorías correctamente.`, 3000);
         }, complete: () => {
            this.getSubCategories();
         }
      });
   }

   public remove(items: SubcategoryForAsignToCategory[]){
      let subcategory: SubcategoryForAsignToCategory = items[0];
      this.categoryService.deleteOne(subcategory.code).subscribe({
         next: () => {
            this.helpersService.messageNotification("warn", "Correcto", `Se quitó la Subcategoría correctamente.`, 2000);
         }, complete: () => {
            this.getSubCategories();
         }
      });
   }

   public allRemove(items: SubcategoryForAsignToCategory[]){
      let subcategories = items;
      let body:{id: string}[] = [];
      subcategories.map( (subCategory: SubcategoryForAsignToCategory) => {
         body.push({
            id: subCategory.code
         })
      });
      this.categoryService.deleteList(body).subscribe({
         next: () => {
            this.helpersService.messageNotification("warn", "Correcto", `Se quitó todas las Subcategorías correctamente.`, 3000);
         }, complete: () => {
            this.getSubCategories();
         }
      });
   }
  
}
