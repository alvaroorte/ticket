import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CardsComponent } from './components/cards/cards.component';
import { PrimeComponentsModule } from '@shared/prime-components/prime-components.module';
import { FormsModule } from '@angular/forms';
import { FormTicketCommonComponent } from '@shared/components/form-ticket-common/form-ticket.component';
import { InputFileComponent } from '@shared/components/input-file/input-file.component';
import { PipesModule } from '@core/pipes/pipes.module';
import { InfoTicketSidebarComponent } from '../../shared/components/info-ticket-sidebar/info-ticket-sidebar.component';
import { ModalTicketGantComponent } from '@shared/components/modal-ticket-gant/modal-ticket-gant.component';
import { ModalTypeTicketComponent } from '@shared/components/modal-type-ticket/modal-type-ticket.component';
import { FormTicketModalComponent } from '@shared/components/form-ticket-modal/form-ticket-modal.component';
import { ModalFormDescriptionComponent } from '@shared/components/modal-form-description/modal-form-description.component';
import { ModalGraphGanttComponent } from '@shared/components/modal-graph-gantt/modal-graph-gantt.component';
import { ModalTimelineTicketComponent } from '@shared/components/modal-timeline-ticket/modal-timeline-ticket.component';


@NgModule({
  declarations: [
    CardsComponent,
  ],
  imports: [
    CommonModule,
    FormsModule,
    PrimeComponentsModule,
    FormTicketCommonComponent,
    ModalFormDescriptionComponent,
    InputFileComponent,
    FormTicketModalComponent,
    PipesModule,
    ModalTimelineTicketComponent,
    InfoTicketSidebarComponent,
    ModalTicketGantComponent,
    ModalGraphGanttComponent,
    ModalTypeTicketComponent
  ],
  exports: [
    CommonModule,
    CardsComponent,
    FormsModule,
    PrimeComponentsModule
  ]
})
export class TicketsCardModule { }
