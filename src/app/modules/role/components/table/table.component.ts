import { Component, EventEmitter, Output, inject, signal } from '@angular/core';
import { Table } from 'primeng/table';
import { RoleService } from '../../services/role.service';
import { TableDoubleComponent } from '@shared/components/table-double/table-double.component';
import { Role } from '@core/models/Role';
import { HelpersService } from '@core/services/helpers.service';


@Component({
  selector: 'app-table',
  templateUrl: './table.component.html'
})

export class TableComponent {
  @Output() changeRole = new EventEmitter<any>();

  private roleService = inject(RoleService);
  private helpersService = inject(HelpersService);

  roles = signal<Role[]>([]) ;
  selectedRole = signal<Role>(new Role);
  firstPage = 0;
  optionsPage = signal([5, 10, 20]);
  loading = signal(false);
  tableDoubleComponent!: TableDoubleComponent;

  ngOnInit() {
    this.roleService.eventTableComponent.emit(this);
    this.getAll();
    this.roleService.eventTableDobleComponent.subscribe((tableDoubleComponent) => {
      this.tableDoubleComponent = tableDoubleComponent;
    });
  }

  public getAll(): void {
    this.roleService.getAll().subscribe({
      next: (res) => {
        this.roles.set(res);
      },
      error: (err) => {
        console.log(err);
        this.helpersService.messageNotification("error", 'Error', err.message, 3000);
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
    this.selectedRole.set(event.data);
    this.changeRole.emit(this.selectedRole());
  }

  onRowUnselect() {
    this.selectedRole.set( new Role );
    this.changeRole.emit(this.selectedRole());
  }
}
