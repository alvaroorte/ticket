import { Component, inject, OnInit, signal } from '@angular/core';
import { ToolbarComponent } from '@shared/components/toolbar/toolbar.component';
import { ModalDeleteComponent } from '@shared/components/modal-delete/modal-delete.component';
import { ObserverGroupModule } from './observer-group.module';
import { ObserverGroupService } from './services/observer-group.service';
import { ObserverGroup } from '@core/interfaces/observer-group.inteface.';
import { GenericTableComponent } from '@shared/components/generic-table/generic-table.component';
import { TableColumn } from '@core/interfaces/table.interface';
import { TableColumnDefinitions } from '@core/utils/table-column-definitions';
import { ModalFormComponent } from './components/modal-form/modal-form.component';

@Component({
    selector: 'app-observer-group',
    imports: [ObserverGroupModule, ToolbarComponent, ModalDeleteComponent, GenericTableComponent, ModalFormComponent],
    templateUrl: './observer-group.component.html'
})
export class ObserverGroupComponent implements OnInit {

  public observerGroupService = inject(ObserverGroupService);

  public titleTable = 'Lista de grupo de observadores';
  public observerGroupSelected = signal<ObserverGroup | null>(null);
  public observerGroups = signal<ObserverGroup[]>([]);
  public tableColumnDefinitions: TableColumn<ObserverGroup>[] =
    TableColumnDefinitions.getObserverGroupsColumnsDefinition();

  ngOnInit(): void {
    this.getObserverGroups();
  }

  public setRowSelected(observerGroup: ObserverGroup) {
    this.observerGroupSelected.set(observerGroup);
  }

  public getObserverGroups(): void {
    this.observerGroupService.getAll().subscribe({
      next: (res) => this.observerGroups.set(res.map(observerGroup => {
        return {
          ...observerGroup,
          observersString: observerGroup.observers.map(c => c.email).join(', ')
        }
      }))
    });
  }

  public onTableSelfEmision(table: GenericTableComponent<any>): void {
    this.observerGroupService.eventTableComponent.set(table);
  }
}
