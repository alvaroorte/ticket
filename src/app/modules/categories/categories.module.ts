import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PrimeModules } from '@shared/prime-components/prime-components.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ModalDeleteComponent } from '@shared/components/modal-delete/modal-delete.component';
import { InputFileComponent } from '@shared/components/input-file/input-file.component';

@NgModule({
  imports: [
    CommonModule,
    PrimeModules,
    ReactiveFormsModule,
    ModalDeleteComponent,
    FormsModule,
    InputFileComponent
  ],
  exports: [
    PrimeModules,
    FormsModule
  ]
})

export class CategoriesModule { }






