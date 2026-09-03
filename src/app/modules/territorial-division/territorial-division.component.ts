import { Component, inject, signal, input, effect } from '@angular/core';
import { TerritorialDivisionModule } from './territorial-division.module';
import { ToolbarComponent } from '@shared/components/toolbar/toolbar.component';
import { ModalDeleteComponent } from '@shared/components/modal-delete/modal-delete.component';
import { TerritorialDivisionService } from './services/territorial-division.service';
import { TerritorialDivision } from '@core/models/territorial-division';
import { GenericTableComponent } from '@shared/components/generic-table/generic-table.component';
import { TableColumn } from '@core/interfaces/table.interface';
import { TableColumnDefinitions } from '@core/utils/table-column-definitions';
import { PrimeTableProps } from '@core/utils/prime-table-props';
import { COMMON } from '@core/constants/common';
import { ModalFormTerritorialDivisionComponent } from './components/modal-form/modal-form-territorial-division.component';

@Component({
    selector: 'app-territorial-division',
    imports: [TerritorialDivisionModule, ToolbarComponent, ModalDeleteComponent, GenericTableComponent, ModalFormTerritorialDivisionComponent],
    templateUrl: './territorial-division.component.html'
})
export class TerritorialDivisionComponent {

  readonly countryId = input.required<number>();

  public territorialDivisionService = inject(TerritorialDivisionService);

  public titleTable = 'Lista de divisiones territoriales';
  public territorialDivisionSelected = signal<TerritorialDivision | null>(null);
  public territorialDivisions = signal<TerritorialDivision[]>([]);
  public tableColumnTerritorialDivisionDefinitions: TableColumn<TerritorialDivision>[] = TableColumnDefinitions.getTerritorialDivisionsColumnsDefinition();
  public tableProps: PrimeTableProps = new PrimeTableProps({ rows: COMMON.minimumRows });

  constructor() {
    effect(() => {
      if (this.countryId()) {
        this.setTerritorialDivision(null);
        this.getByCountry();
      }
    })
  }

  public setTerritorialDivision(territorialDivision: TerritorialDivision): void {
    this.territorialDivisionSelected.set(territorialDivision);
  }

  public getByCountry(): void {
    this.territorialDivisionService.getByCountry(this.countryId()).subscribe({
      next: (res) => {
        this.territorialDivisions.set(res);
      }
    });
  }

  public onTableSelfEmision(table: GenericTableComponent<TerritorialDivision>): void {
    this.territorialDivisionService.eventTableComponent.set(table);
  }
}
