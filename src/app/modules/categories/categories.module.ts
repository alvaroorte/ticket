import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PrimeComponentsModule } from '@shared/prime-components/prime-components.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { TableComponent } from './components/table/table.component';
import { ToolbarComponent } from './components/toolbar/toolbar.component';
import { ModaldeleteComponent } from '@shared/components/modal-delete/modal-delete.component';

@NgModule({
  declarations: [
    TableComponent,
    ToolbarComponent,

  ],
  imports: [
    CommonModule,
    PrimeComponentsModule,
    ReactiveFormsModule,
    ModaldeleteComponent,
    FormsModule
  ],
  exports: [
    PrimeComponentsModule,
    TableComponent,
    ToolbarComponent,
    FormsModule
  ]
})

export class CategoriesModule { }






