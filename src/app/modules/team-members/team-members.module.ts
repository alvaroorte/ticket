import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ModalFormComponent } from './components/modal-form/modal-form.component';
import { TableComponent } from './components/table/table.component';
import { PrimeComponentsModule } from '@shared/prime-components/prime-components.module';
import { SelectGenericUsersComponent } from '@shared/components/select-generic-users/select-generic-users.component';
import { FormsModule } from '@angular/forms';
import { ModalDisableUserAllTeamsComponent } from './components/modal-disable-user-all-teams/modal-disable-user-all-teams.component';



@NgModule({
  declarations: [
    ModalFormComponent,
    ModalDisableUserAllTeamsComponent,
    TableComponent
  ],
  imports: [
    CommonModule,
    PrimeComponentsModule,
    SelectGenericUsersComponent,
    FormsModule
  ],
  exports: [
    PrimeComponentsModule,
    ModalFormComponent,
    ModalDisableUserAllTeamsComponent,
    TableComponent,
    FormsModule
  ]
})
export class TeamMembersModule { }
