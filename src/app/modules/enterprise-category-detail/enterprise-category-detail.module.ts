import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TableComponent } from './components/table/table.component';
import { PrimeComponentsModule } from '@shared/prime-components/prime-components.module';
import { ModalFormComponent } from './components/modal-form/modal-form.component';
import { SelectGenericUsersComponent } from '@shared/components/select-generic-users/select-generic-users.component';
import { FormsModule } from '@angular/forms';



@NgModule({
  declarations: [
    TableComponent,
    ModalFormComponent
  ],
  imports: [
    CommonModule,
    FormsModule,
    PrimeComponentsModule,
    SelectGenericUsersComponent
  ],
  exports: [
    TableComponent,
    ModalFormComponent
  ]
})
export class EnterpriseCategoryDetailModule { }
