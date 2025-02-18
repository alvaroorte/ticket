import { Component, inject, Input } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { HelpersService } from 'src/app/core/services/helpers.service';
import { TableComponent as TableCategoryComponent } from '../table/table.component';
import { CategoriesService } from '../../services/categories.service';
import { Category } from 'src/app/core/models/Category';
import { regex, messages } from '@core/constants/constants';
import { CommonModule } from '@angular/common';
import { PrimeComponentsModule } from '@shared/prime-components/prime-components.module';
import { noSpaceValidator } from '@core/validators/noSpaceValidator';


@Component({
   selector: 'app-form',
   standalone: true,
   templateUrl: './form.component.html',
   imports: [
      CommonModule,
      ReactiveFormsModule,
      FormsModule,
      PrimeComponentsModule,
   ]
})
export class FormComponent {
   @Input({ required: true }) folder: string;

   public readonly messages = messages;
   public openModal: boolean = false;
   public tittleForm: string = 'Crear nuevo registro';
   private categoryId: number = 0;
   private tableComponent: TableCategoryComponent;
   private formBuilder = inject(FormBuilder);
   private helpersService = inject(HelpersService);
   private categoriesService = inject(CategoriesService);

   public formCategory: FormGroup = this.formBuilder.group({
      id: [],
      folder: [, Validators.required],
      value: [, [ Validators.required, Validators.minLength(5), Validators.pattern(regex.fieldName), noSpaceValidator]],
      urlImage: [, [Validators.required]],
      status: [ ,Validators.required],
   });

   ngOnInit() {
      this.categoriesService.eventFormComponent.emit(this);
      this.categoriesService.eventTableComponent.subscribe((tableComponent) => this.tableComponent = tableComponent);
   }

   public hideModal() {
      this.openModal = false;
   }

   public openCreate() {
      this.reset();
      this.openModal = true;
      this.formCategory.patchValue({ folder: this.folder });
   }

   public openEdit(id: number) {
      this.reset();
      this.categoriesService.getById(id).subscribe({
         next: (categoryResponse) => {
            this.formCategory.patchValue(categoryResponse)
            this.categoryId = categoryResponse.id!;
            this.openModal = true;
         },
         error: (err) => {
            console.log(err);
            this.helpersService.messageNotification('error', 'Error', err.message, 3000);
         }
      });
   }

   public saveCategory() {
      const texto = this.formCategory.value.value.trim();
      if (texto.length <= 5) {
         this.helpersService.messageNotification('error', 'Error', 'Este campo requiere como mínimo 5 caracteres', 3000);
         return;
      }
      if (this.formCategory.valid) {
         this.formCategory.value.value = this.formCategory.value.value.trim();
         this.categoryId > 0 ? this.submitUpdate(this.categoryId) : this.submitCreate();
      }
   }

   private reset() {
      this.formCategory.reset();
      this.formCategory.patchValue({'status': true});
      this.categoryId = 0;
   }

   private submitCreate() {
      const data: Category = {
         ...this.formCategory.value,
      };
      data.folder = this.folder;
      this.categoriesService.create(data).subscribe({
         next: () => {
            this.tableComponent.reload();
            this.helpersService.messageNotification('success', 'Correcto', `La categoría ha sido creada.`, 3000);
            this.hideModal();
            this.reset();
         },
         error: (err) => {
            console.log(err);
            this.helpersService.messageNotification('error', 'Error', err.message, 3000);
         }
      });
   }

   private submitUpdate(idCategory: number) {
      const data: Category = {
         ...this.formCategory.value,
      };
      this.categoriesService.update(idCategory, data).subscribe({
         next: () => {
            this.tableComponent.reload();
            this.helpersService.messageNotification('success', 'Correcto', `La categoría ha sido actualizada.`, 3000);
            this.hideModal();
            this.reset();
         },
         error: (err) => {
            console.log(err);
            this.helpersService.messageNotification('error', 'Error', err.message, 3000);
         }
      });
   }
}
