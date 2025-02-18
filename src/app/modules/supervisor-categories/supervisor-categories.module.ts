import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TableComponent } from './components/table/table.component';
import { ModalFormComponent } from './components/modal-form/modal-form.component';
import { PrimeComponentsModule } from '@shared/prime-components/prime-components.module';
import { TableDoubleComponent } from "@shared/components/table-double/table-double.component";
import { FormsModule } from '@angular/forms';


@NgModule({
  declarations: [
    TableComponent,
    ModalFormComponent
  ],
  imports: [
    CommonModule,
    PrimeComponentsModule,
    TableDoubleComponent,
    FormsModule
  ],
  exports: [
    TableComponent,
    ModalFormComponent
  ]
})
export class SupervisorCategoriesModule { }
