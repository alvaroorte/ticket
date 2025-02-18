import { Component, EventEmitter, Output, inject, signal } from '@angular/core';
import { Table } from 'primeng/table';
import { PermissionService } from '../../services/permission.service';
import { Permission } from '@core/models/Permission';
import { HelpersService } from '@core/services/helpers.service';

@Component({
  selector: 'app-table',
  templateUrl: './table.component.html'
})

export class TableComponent {
  @Output() changePermission = new EventEmitter<any>();

  private permissionService = inject(PermissionService);
  private helpersService = inject(HelpersService);

  permissions = signal<Permission[]>([]) ;
  selectedPermission = signal<Permission>(new Permission);
  firstPage = 0;
  optionsPage = signal([5, 10, 20]);
  loading = signal(false);

  ngOnInit() {
    this.permissionService.eventTableComponent.emit(this);
    this.getAll();
  }

  public getAll(): void {
    this.permissionService.getAll().subscribe({
      next: (res) => {
        this.permissions.set(res);
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
    this.selectedPermission.set(event.data);
    this.changePermission.emit(this.selectedPermission());
  }

  onRowUnselect() {
    this.selectedPermission.set( new Permission );
    this.changePermission.emit(this.selectedPermission());
  }
}
