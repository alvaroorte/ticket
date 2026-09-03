import { Component, inject, OnInit, signal } from '@angular/core';
import { ToolbarComponent } from '@shared/components/toolbar/toolbar.component';
import { ModalDeleteComponent } from '@shared/components/modal-delete/modal-delete.component';
import { incidentTitleModule } from './incident-title.module';
import { IncidentTitleService } from './services/incident-title.service';
import { IncidentTitle } from '@core/interfaces/incident-title';
import { GenericTableComponent } from '@shared/components/generic-table/generic-table.component';
import { TableColumn } from '@core/interfaces/table.interface';
import { TableColumnDefinitions } from '@core/utils/table-column-definitions';
import { ModalFormComponent } from './components/modal-form/modal-form.component';

@Component({
    selector: 'app-incident-title',
    imports: [incidentTitleModule, ToolbarComponent, ModalDeleteComponent, GenericTableComponent, ModalFormComponent],
    templateUrl: './incident-title.component.html'
})
export class IncidentTitleComponent implements OnInit {

  public incidentTitleService = inject(IncidentTitleService);

  public titleTable = 'Lista de títulos de incidentes';
  public incidentTitleSelected = signal<IncidentTitle | null>(null);
  public incidentTitles = signal<IncidentTitle[]>([]);
  public tableColumnDefinitions: TableColumn<IncidentTitle>[] =
    TableColumnDefinitions.getIncidentTitlesColumnsDefinition();

  ngOnInit(): void {
    this.getIncidentTitles();
  }

  public setIncidentTitle(incidentTitleSelected: IncidentTitle) {
    this.incidentTitleSelected.set(incidentTitleSelected);
  }

  public getIncidentTitles(): void {
    this.incidentTitleService.getAll().subscribe({
      next: (res) => this.incidentTitles.set(res)
    });
  }

  public onTableSelfEmision(table: GenericTableComponent<IncidentTitle>): void {
    this.incidentTitleService.eventTableComponent.set(table);
  }
}
