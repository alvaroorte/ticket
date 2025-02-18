import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PrimeComponentsModule } from '@shared/prime-components/prime-components.module';
import { ToolbarComponent } from './components/toolbar/toolbar.component';
import { TableComponent } from './components/table/table.component';
import { FormComponent } from './components/form/form.component';
import { ReactiveFormsModule } from '@angular/forms';



@NgModule({
  declarations: [
    ToolbarComponent,
    TableComponent,
    FormComponent],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    PrimeComponentsModule
  ],
  exports: [
    ToolbarComponent,
    TableComponent,
    FormComponent,
    PrimeComponentsModule
  ]
})
export class PermissionModule { }
