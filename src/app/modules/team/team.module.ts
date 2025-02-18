import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { TeamRoutingModule } from './team-routing.module';
import { PrimeComponentsModule } from '@shared/prime-components/prime-components.module';
import { TableComponent } from './components/table/table.component';
import { ModalFormComponent } from './components/modal-form/modal-form.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { SelectGenericUsersComponent } from '@shared/components/select-generic-users/select-generic-users.component';


@NgModule({
  declarations: [
    TableComponent,
    ModalFormComponent
  ],
  imports: [
    CommonModule,
    TeamRoutingModule,
    PrimeComponentsModule,
    ReactiveFormsModule,
    FormsModule,
    SelectGenericUsersComponent
  ],
  exports: [
    PrimeComponentsModule,
    TableComponent,
    ModalFormComponent,
    FormsModule
  ]
})
export class TeamModule { }
