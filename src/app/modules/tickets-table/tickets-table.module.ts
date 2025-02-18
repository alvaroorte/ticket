import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TableComponent } from './components/table/table.component';
import { PrimeComponentsModule } from '@shared/prime-components/prime-components.module';
import { InfoTicketSidebarComponent } from '@shared/components/info-ticket-sidebar/info-ticket-sidebar.component';
import { ModalTicketGantComponent } from '@shared/components/modal-ticket-gant/modal-ticket-gant.component';
import { ModalTypeTicketComponent } from '@shared/components/modal-type-ticket/modal-type-ticket.component';
import { PipesModule } from '@core/pipes/pipes.module';
import { FormTicketModalComponent } from '@shared/components/form-ticket-modal/form-ticket-modal.component';
import { ModalFormDescriptionComponent } from '@shared/components/modal-form-description/modal-form-description.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ModalGraphGanttComponent } from '@shared/components/modal-graph-gantt/modal-graph-gantt.component';
import { ModalTimelineTicketComponent } from '@shared/components/modal-timeline-ticket/modal-timeline-ticket.component';



@NgModule({
  declarations: [
    TableComponent
  ],
  imports: [
    CommonModule,
    PrimeComponentsModule,
    FormsModule,
    ReactiveFormsModule,
    PipesModule,
    FormTicketModalComponent,
    ModalTimelineTicketComponent,
    ModalFormDescriptionComponent,
    InfoTicketSidebarComponent,
    ModalTicketGantComponent,
    ModalGraphGanttComponent,
    ModalTypeTicketComponent
  ],
  exports: [
    TableComponent,
    PrimeComponentsModule
  ]
})
export class TicketsTableModule { }
