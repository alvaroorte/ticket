import { Component, inject, signal } from '@angular/core';
import { SupervisorService } from './services/supervisor.service';
import { ToolbarComponent } from '@shared/components/toolbar/toolbar.component';
import { ModalDeleteComponent } from '@shared/components/modal-delete/modal-delete.component';
import { Supervisor } from '@core/models/Supervisor';
import { SupervisorCategoriesComponent } from '@supervisorCategory/supervisor-categories.component';
import { LABELS } from '@core/constants/labels';
import { GenericTableComponent } from '@shared/components/generic-table/generic-table.component';
import { TableColumn } from '@core/interfaces/table.interface';
import { TableColumnDefinitions } from '@core/utils/table-column-definitions';
import { FormComponent } from './components/form/form.component';
import { FieldsetModule } from 'primeng/fieldset';

@Component({
    selector: 'app-supervisor',
    imports: [ModalDeleteComponent, ToolbarComponent, SupervisorCategoriesComponent, GenericTableComponent, FormComponent, FieldsetModule],
    templateUrl: './supervisor.component.html'
})
export class SupervisorComponent {

  public supervisorService = inject(SupervisorService);

  public readonly labels = LABELS;
  public titleTable = "Lista de supervisores";
  public tableColumnSupervisorDefinitions: TableColumn<Supervisor>[] = TableColumnDefinitions.getSupervisorsColumnsDefinition();
  public supervisors = signal<Supervisor[]>([]);
  public supervisorSelected = signal<Supervisor | null>(null);

  ngOnInit(): void {
    this.getSupervisors();
  }

  public setSupervisor( supervisor: Supervisor  ) {
    this.supervisorSelected.set(supervisor);
  }

  public getSupervisors(): void {
    this.supervisorService.getAll().subscribe({
      next: (res) => {
        this.supervisors.set(res);
      }
    })
  }

  public onTableSelfEmision(table: GenericTableComponent<Supervisor>) {
    this.supervisorService.eventTableComponent.set(table);
  }
}

