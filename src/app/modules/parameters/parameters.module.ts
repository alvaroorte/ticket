import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PrimeComponentsModule } from 'src/app/shared/prime-components/prime-components.module';

import { ParametersRoutingModule } from './parameters-routing.module';
import { ParametersComponent } from './parameters.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { FormComponent } from './components/form/form.component';
import { TableComponent } from './components/table/table.component';
// import { ToolbarComponent } from './components/toolbar/toolbar.component';
import { ModaldeleteComponent } from 'src/app/shared/components/modal-delete/modal-delete.component';
import { ToolbarComponent } from 'src/app/shared/components/toolbar/toolbar.component';


@NgModule({
  declarations: [
    ParametersComponent,
    FormComponent,
    TableComponent,
    // ToolbarComponent
  ],
  imports: [
    CommonModule,
    PrimeComponentsModule,
    ParametersRoutingModule,
    ReactiveFormsModule,
    FormsModule,
    ModaldeleteComponent,
    ToolbarComponent
  ]
})

export class ParametersModule { }







