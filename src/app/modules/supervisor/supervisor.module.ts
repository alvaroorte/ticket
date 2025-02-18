import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PrimeComponentsModule } from 'src/app/shared/prime-components/prime-components.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { FormComponent } from './components/form/form.component';
import { TableComponent } from './components/table/table.component';
import { EnterpriseCategoriesComponent } from '../enterprise-categories/enterprise-categories.component';
import { SelectGenericUsersComponent } from '@shared/components/select-generic-users/select-generic-users.component';



@NgModule({
  declarations: [
    FormComponent,
    TableComponent
  ],
  imports: [
    CommonModule,
    PrimeComponentsModule,
    ReactiveFormsModule,
    EnterpriseCategoriesComponent,
    SelectGenericUsersComponent,
    FormsModule
  ],
  exports: [
    PrimeComponentsModule,
    FormComponent,
    TableComponent,
    FormsModule
  ]
})
export class SupervisorModule { }
