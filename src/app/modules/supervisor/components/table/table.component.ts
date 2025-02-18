import { ChangeDetectionStrategy, Component, inject, signal, Output, EventEmitter } from '@angular/core';
import { Table } from 'primeng/table';
import { SupervisorService } from '../../services/supervisor.service';
import { FormComponent } from '../form/form.component';
import { HelpersService } from 'src/app/core/services/helpers.service';
import { TableComponent as TableSupervisorCategoriesComponent } from "@supervisorCategory/components/table/table.component";
import { Supervisor, SupervisorSend } from '@core/models/Supervisor';
import { DataCommon } from '@core/models/FieldsCommons';
import { SupervisorCategoriesService } from '@supervisorCategory/services/supervisor-categories.service';

@Component({
  selector: 'app-table',
  templateUrl: './table.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})

export class TableComponent {
  @Output() rowSelected = new EventEmitter<Supervisor>();

  private supervisorService = inject(SupervisorService);
  private supervisorCategoriesService = inject(SupervisorCategoriesService);
  private helpersService = inject(HelpersService);

  supervisor = signal<DataCommon[]>([]);
  selectedSupervisor = signal<Supervisor>(new Supervisor);
  firstPage = 0;
  rows = 10;
  optionsPage = signal([5, 10, 20]);
  loading = signal(false);
  sidebarVisible = signal(false);
  formComponent!: FormComponent;
  tableSupervisorCategoriesComponent!: TableSupervisorCategoriesComponent

  ngOnInit() {
    this.supervisorService.eventTableComponent.emit(this);
    this.supervisorCategoriesService.eventTableComponent.subscribe( (tableSupervisorCategoriesComponent) => {
      this.tableSupervisorCategoriesComponent = tableSupervisorCategoriesComponent;
    });

    this.getAll();
  }

  getAll(): void {
    this.loading.set(true);
    this.supervisorService.search().subscribe({
      next: (res) => {
        this.supervisor.set(res);
        this.loading.set(false);
      },
      error: (err) => {
        this.supervisor.set([]);
        console.log(err);
        this.helpersService.messageNotification("error", 'Error', err.message, 3000);
        this.loading.set(false);
      }
    });
  }

  onGlobalFilter(table: Table, event: Event) {
    table.filterGlobal((event.target as HTMLInputElement).value, 'contains');
  }

  clear(table: Table) {
      table.clear();
  }

  reload (): void {
    this.getAll();
    this.firstPage = 0;
    this.onRowUnselect();
  }

  onRowSelect(event: any) {
    this.selectedSupervisor.set(event.data);
    this.rowSelected.emit(this.selectedSupervisor());
    this.tableSupervisorCategoriesComponent.getBySupervisor();
  }

  onRowUnselect() {
    this.selectedSupervisor.set(new Supervisor);
    this.rowSelected.emit(this.selectedSupervisor());
    this.tableSupervisorCategoriesComponent.getBySupervisor();
  }

  async switchStatus(data: DataCommon) {
      this.loading.set(true);
      const credential = await this.getSupervisorCredential(Number(data.id)) as Supervisor;
      const supervisor: SupervisorSend = {
        id: data.id,
        credential: credential.credential.id,
        name: data.name,
        status: data.status
      }

      this.supervisorService.update(Number(data.id), supervisor).subscribe({
         next: () => {
            this.loading.set(false);
         },
         error: (err) => {
            this.loading.set(false);
            console.log(err);
            this.helpersService.messageNotification("error", 'Error', err.message, 3000);
         }
      })
  }

  getSupervisorCredential(id: number){
   return new Promise((resolve, reject) => {
      this.supervisorService.getById(id).subscribe({
         next: resp => {
            resolve(resp)
         },
         error: (err) => {
            this.loading.set(false);
            console.log(err);
            reject(err)
            this.helpersService.messageNotification("error", 'Error', err.message, 3000);
         }
      });
   })
  }
}
