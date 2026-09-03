import { Component, inject, input } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { HelpersService } from 'src/app/core/services/helpers.service';
import { CategoryService } from '../../services/categories.service';
import { Category } from 'src/app/core/models/Category';

import { PrimeModules } from '@shared/prime-components/prime-components.module';
import { noSpaceValidator } from '@core/validators/noSpaceValidator';
import { FileService } from '@core/services/file-service.service';
import { CategoryFolderEnum } from '@core/enums/category-folder';
import { MESSAGES } from '@core/constants/messages';
import { fileTypeAllowed, maxImageSizeAllowed } from '@core/constants/file';
import { regex } from '@core/constants/regexs';
import { InputFileComponent } from "../../../../shared/components/input-file/input-file.component";
import { LABELS } from '@core/constants/labels';
import { MessageRequiredFieldComponent } from "../../../../shared/components/message-required-field/message-required-field.component";
import { ModeInputFile } from '@core/enums/file.enum';
import { TypeSubmitEnum } from '@core/enums/type-submit';
import { Severity } from '@core/enums/severity';
import { MimeTypeEnum } from '@core/enums/mime-type';


@Component({
    selector: 'app-form',
    templateUrl: './form.component.html',
    imports: [
      ReactiveFormsModule,
      FormsModule,
      PrimeModules,
      InputFileComponent,
      MessageRequiredFieldComponent
   ]
})
export class FormComponent {
   readonly folder = input.required<CategoryFolderEnum>();

   private formBuilder = inject(FormBuilder);
   private helpersService = inject(HelpersService);
   private categoryService = inject(CategoryService);
   private fileService = inject(FileService);

   public readonly messages = MESSAGES;
   public readonly labels = LABELS;
   public readonly allowedImageFormat = fileTypeAllowed.allowedImageFormat;
   public readonly maxImageSizeAllowed = maxImageSizeAllowed;
   public readonly modeInputFile = ModeInputFile;
   public readonly categoryFolderEnum = CategoryFolderEnum;
   public openModal = false;
   public titleForm = '';
   private categoryId = 0;
   public file: File = null;
   private tableComponent = this.categoryService.eventTableComponent;
   public formCategory: FormGroup = this.formBuilder.group({
      id: [],
      folder: [, Validators.required],
      value: [, [ Validators.required, Validators.minLength(5), Validators.pattern(regex.fieldName), noSpaceValidator]],
      image: [],
      description: [],
      active: [, Validators.required],
   });

   ngOnInit() {
      this.categoryService.eventFormComponent.set(this);
   }
   
   private changeFormByFolder(): void {
      this.formCategory.get('image')?.clearValidators();
      if (this.folder() == CategoryFolderEnum.Category) 
         this.formCategory.get('image')?.addValidators(Validators.required);
   }

   public hideModal() {
      this.openModal = false;
   }
  
   private async convertFileToBase64(file: File) {
      const base64Image:string = await this.fileService.convertFileToBase64(file, true);
      this.formCategory.get('image').patchValue(base64Image);
   }

   public openCreate() {
      this.changeFormByFolder();
      this.reset();
      this.titleForm = this.folder() == CategoryFolderEnum.Category? "Crear categoría": "Crear subcategoría";
      this.openModal = true;
      this.formCategory.patchValue({ folder: this.folder() });
   }
   
   public openEdit(id: number) {
      this.changeFormByFolder();
      this.reset();
      this.categoryService.getById(id).subscribe({
         next: (categoryResponse) => {
            this.updateDataForm(categoryResponse);
            this.categoryId = categoryResponse.id!;
            this.titleForm = this.folder() == CategoryFolderEnum.Category? "Editar categoría": "Editar subcategoría";
            this.openModal = true;
         }
      });
   }

   private updateDataForm(category: Category) {
      const fileName = "logo.png";
      this.file = this.fileService.convertBase64ToFile(category.image, fileName, MimeTypeEnum.IMAGE);
      this.formCategory.patchValue({
         ...category,
         active: category.active?? false,
      })
   }

   public loadFile(dataFile: File) {
      dataFile? 
         this.convertFileToBase64(dataFile)
         : this.formCategory.get('image').patchValue(null);
  }

   public saveCategory() {
      if (this.formCategory.valid) {
         this.categoryId > 0 ? 
            this.submit(TypeSubmitEnum.UPDATE, this.categoryId) 
            : this.submit(TypeSubmitEnum.CREATE);
      }
   }

   private reset() {
      this.formCategory.reset();
      this.formCategory.patchValue({'active': true});
      this.file = null;
      this.categoryId = 0;
   }

   private submit(type: TypeSubmitEnum, id?: number) {
      const data: Category = {
         ...this.formCategory.value,
      };
      data.folder = this.folder();
      const service = type == TypeSubmitEnum.CREATE?
      this.categoryService.create(data)
      : this.categoryService.update(id, data);
      service.subscribe({
         next: () => {
            const message: string = type == TypeSubmitEnum.CREATE?
               this.messages.recordCreated
               : this.messages.recordUpdated;
            this.helpersService.messageNotification(Severity.success, LABELS.ok, message);
            this.hideModal();
            this.reset();
         }, complete: () => {
           this.tableComponent().reload();
         }
       })
     };
}
