import { Component, inject, signal } from '@angular/core';
import { ParameterService } from './services/parameters.service';
import { LABELS } from '@core/constants/labels';
import { ToolbarComponent } from '@shared/components/toolbar/toolbar.component';
import { ModalDeleteComponent } from '@shared/components/modal-delete/modal-delete.component';
import { IFolder, Parameter } from '@core/models/Parameter';
import { TableColumn } from '@core/interfaces/table.interface';
import { TableColumnDefinitions } from '@core/utils/table-column-definitions';
import { GenericTableComponent } from '@shared/components/generic-table/generic-table.component';
import { FormComponent } from './components/form/form.component';
import { PrimeModules } from '@shared/prime-components/prime-components.module';
import { FormsModule } from '@angular/forms';

@Component({
    selector: 'app-parameters',
    templateUrl: './parameters.component.html',
    imports: [ ToolbarComponent, ModalDeleteComponent, GenericTableComponent, FormComponent, PrimeModules, FormsModule ],
})
export class ParametersComponent {

  public parameterService = inject(ParameterService);
  
  public readonly labels = LABELS;
  public showButtons = signal<boolean>(true);

  public titleTable = "Lista de parámetros";
  public folderNameSelected: string;
  public folders: IFolder[] = [];
  public parameterSelected = signal<Parameter>(null);
  public parameters = signal<Parameter[]>([]);
  private tableComponent!: GenericTableComponent<Parameter>;
  public tableColumnParameterDefinitions: TableColumn<Parameter>[] = TableColumnDefinitions.getParameterColumnsDefinition();

  ngOnInit(): void {
    this.getFolders();
  }

  private getFolders() {
    this.parameterService.getListFolder().subscribe({
      next: (res) => {
        res.length > 0 ? this.folderNameSelected = res[0].name : '';
        this.folders = res;
      }, complete: () => {
        this.getParameters();
      }
    });
  }

  public onChangedFolder() {
    this.tableComponent.onRowUnselect();
    this.getParameters();
    this.setShowButtons();
  }

  public setParameter( parameter: Parameter ) {
    this.parameterSelected.set(parameter);
  }

  public getParameters(): void {
    this.parameterService.getAll(this.folderNameSelected).subscribe({
      next: (res) => {
          this.parameters.set(res);
      }
    })
  }

  public onTableSelfEmision(table: GenericTableComponent<Parameter>) {
    this.tableComponent = table;
    this.parameterService.eventTableComponent.set(table);
  }
  
  private setShowButtons() {
    const showButtons: boolean = this.folders.find(f => f.name == this.folderNameSelected).editable;
    this.showButtons.set(showButtons);
  }
}
