import { ChangeDetectionStrategy, Component, inject, signal, Output, EventEmitter } from '@angular/core';
import { Table } from 'primeng/table';
import { Parameter } from 'src/app/core/models/Parameter';
import { ParametersService } from '../../services/parameters.service';
import { FormComponent } from '../form/form.component';
import { HelpersService } from 'src/app/core/services/helpers.service';
import { DataCommon } from '@core/models/FieldsCommons';

@Component({
   selector: 'app-table',
   templateUrl: './table.component.html',
   changeDetection: ChangeDetectionStrategy.OnPush
})
export class TableComponent {
   @Output() rowSelected = new EventEmitter<Parameter>();

   private parametersService = inject(ParametersService);
   private helpersService = inject(HelpersService);

   parameters = signal<Parameter[]>([]);
   selectedParameter = signal<Parameter>(new Parameter);
   firstPage = 0;
   optionsPage = signal([5, 10, 20]);
   loading = signal(false);
   folders: DataCommon[] = [];
   public folderNameSelected!: string;

   private formComponent: FormComponent;

   ngOnInit() {
      this.parametersService.eventTableComponent.emit(this);
      this.parametersService.eventFormComponent.subscribe((formComponent) => {
         this.formComponent = formComponent;
      });
      this.getFolders();
   }

   getAll(): void {
      if (this.folderNameSelected) {
         this.loading.set(true);
         this.parametersService.search(this.folderNameSelected).subscribe({
            next: (res) => {
               this.parameters.set(res);
               this.loading.set(false);
            },
            error: (err) => {
               console.log(err);
               this.helpersService.messageNotification("error", 'Error', err.message, 3000);
            }
         })
      } else {
         this.parameters.set([]);
         this.helpersService.messageNotification('warn', 'Por favor', 'Seleccione un folder.');
      }
   }

   onGlobalFilter(table: Table, event: Event) {
      table.filterGlobal((event.target as HTMLInputElement).value, 'contains');
   }

   clear(table: Table) {
      table.clear();
   }

   reload(): void {
      this.onRowUnselect();
      this.getAll();
      this.firstPage = 0;
   }

   onRowSelect(event: any) {
      this.selectedParameter.set(event.data);
      this.rowSelected.emit(this.selectedParameter());
   }

   onRowUnselect() {
      this.selectedParameter.set(new Parameter);
      this.rowSelected.emit(this.selectedParameter());
   }

   getFolders() {
      this.parametersService.getListFolder().subscribe({
         next: (res) => {
            res.length > 0 ? this.folderNameSelected = res[0].name as string : '';
            this.folders = res;
            this.getAll();
         },
         error: (err) => {
            console.log(err);
            this.helpersService.messageNotification("error", 'Error', err.message, 3000);
         }
      });
   }

}
