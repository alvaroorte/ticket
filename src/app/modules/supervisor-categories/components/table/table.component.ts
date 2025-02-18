import { Component, Input, Signal, inject, signal } from '@angular/core';
import { DataCommon } from '@core/models/FieldsCommons';
import { Supervisor } from '@core/models/Supervisor';
import { SupervisorCategory } from '@core/models/SupervisorCategory';
import { HelpersService } from '@core/services/helpers.service';
import { SupervisorCategoriesService } from '@supervisorCategory/services/supervisor-categories.service';
import { Table } from 'primeng/table';

@Component({
  selector: 'app-table',
  templateUrl: './table.component.html'
})
export class TableComponent {
  @Input() supervisor!: Signal<Supervisor>;

  private supervisorCategoriesService = inject(SupervisorCategoriesService);
  private helpersService = inject(HelpersService);

  supervisorCategories = signal<DataCommon[]>([]);
  selectedSupervisorCategories = signal<SupervisorCategory>(new SupervisorCategory);
  firstPage = 0;
  rows = 10;
  optionsPage = signal([5, 10, 20]);
  loading = signal(false);

  ngOnInit() {
    this.supervisorCategoriesService.eventTableComponent.emit(this);
  }

  getBySupervisor(): void {
    if ( this.supervisor() && this.supervisor().id ) {
      this.loading.set(true);
      this.supervisorCategoriesService.getBySupervisor(this.supervisor().id as number).subscribe({
        next: (res) => {
          this.supervisorCategories.set(res);
          this.loading.set(false);
        },
        error: (err) => {
          console.log(err);
          this.helpersService.messageNotification("error", 'Error', err.message, 3000);
        }
      })
    } else {
      this.supervisorCategories.set([]);
    }
  }

  onGlobalFilter(table: Table, event: Event) {
    table.filterGlobal((event.target as HTMLInputElement).value, 'contains');
  }

  clear(table: Table) {
      table.clear();
  }

  reload (): void {
    this.getBySupervisor();
    this.firstPage = 0;
  }

  onRowSelect(event: any) {
    this.selectedSupervisorCategories.set(event.data);
  }

  onRowUnselect() {
    this.selectedSupervisorCategories.set(new SupervisorCategory);
  }
}
