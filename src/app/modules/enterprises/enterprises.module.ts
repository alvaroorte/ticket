import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PrimeComponentsModule } from 'src/app/shared/prime-components/prime-components.module';
import { EnterprisesRoutingModule } from './enterprises-routing.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { FormComponent } from './components/form/form.component';
import { TableComponent } from './components/table/table.component';
import { EnterpriseCategoriesComponent } from '../enterprise-categories/enterprise-categories.component';
import { EnterpriseCategoryDetailComponent } from '../enterprise-category-detail/enterprise-category-detail.component';



@NgModule({
  declarations: [
    FormComponent,
    TableComponent
  ],
  imports: [
    CommonModule,
    PrimeComponentsModule,
    EnterprisesRoutingModule,
    ReactiveFormsModule,
    EnterpriseCategoriesComponent,
    EnterpriseCategoryDetailComponent,
    FormsModule
  ],
  exports: [
    PrimeComponentsModule,
    FormComponent,
    TableComponent,
    FormsModule
  ]
})
export class EnterprisesModule { }
