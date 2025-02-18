import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TableComponent } from './components/table/table.component';
import { FormComponent } from './components/form/form.component';
import { ToolbarComponent } from './components/toolbar/toolbar.component';
import { PrimeComponentsModule } from 'src/app/shared/prime-components/prime-components.module';
import { ReactiveFormsModule } from '@angular/forms';
import { ModaldeleteComponent } from 'src/app/shared/components/modal-delete/modal-delete.component';
import { TicketsHistoricalRoutingModule } from './tickets-historical-routing.module';
import { InfoTicketSidebarComponent } from '@shared/components/info-ticket-sidebar/info-ticket-sidebar.component';
import { PanelFiltersComponent } from './components/panel-filters/panel-filters.component';
import { PipesModule } from '@core/pipes/pipes.module';
import { FormTicketModalComponent } from '@shared/components/form-ticket-modal/form-ticket-modal.component';
import { ModalGraphGanttComponent } from '@shared/components/modal-graph-gantt/modal-graph-gantt.component';
import { ModalTimelineTicketComponent } from '@shared/components/modal-timeline-ticket/modal-timeline-ticket.component';


@NgModule({
  declarations: [
    TableComponent,
    FormComponent,
    ToolbarComponent,
    PanelFiltersComponent
  ],
  imports: [
    CommonModule,
    PrimeComponentsModule,
    TicketsHistoricalRoutingModule,
    ReactiveFormsModule,
    ModaldeleteComponent,
    ModalTimelineTicketComponent,
    InfoTicketSidebarComponent,
    PipesModule,
    ModalGraphGanttComponent,
    FormTicketModalComponent
  ],
  exports: [
    TableComponent,
    FormComponent,
    ToolbarComponent,
    PanelFiltersComponent
  ]
})
export class TicketsHistoricalModule { }
