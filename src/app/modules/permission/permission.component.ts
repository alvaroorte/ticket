import { Component, EventEmitter, Output, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PermissionModule } from './permission.module';
import { PermissionService } from './services/permission.service';
import { ModaldeleteComponent } from '@shared/components/modal-delete/modal-delete.component';

@Component({
  selector: 'app-permission',
  standalone: true,
  imports: [CommonModule, PermissionModule, ModaldeleteComponent],
  templateUrl: './permission.component.html'
})
export class PermissionComponent {
  @Output() eventChangePermission = new EventEmitter();

  idDelete = signal<number>(0);
  permissionService = inject(PermissionService);

  ngOnInit(): void {
    this.permissionService.eventDeleteRow.subscribe( id => this.idDelete.set(id) );
  }

  changePermission() {
    this.eventChangePermission.emit();
  }
}
