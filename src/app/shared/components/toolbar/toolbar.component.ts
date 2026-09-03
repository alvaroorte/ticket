import { Component, inject, input } from '@angular/core';
import { HelpersService } from '@core/services/helpers.service';

import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { PrimeModules } from '@shared/prime-components/prime-components.module';
import { IServiceCommon } from '@core/interfaces/service-common.interface';
import { ModalDeleteComponent } from '../modal-delete/modal-delete.component';

@Component({
    selector: 'app-toolbar-common',
    imports: [RouterModule, FormsModule, PrimeModules],
    templateUrl: './toolbar.component.html'
})
export class ToolbarComponent {

  readonly serviceGeneric = input<IServiceCommon>(null);
  readonly object = input<any>(null);
  readonly showCreate = input<boolean>(true);
  readonly showEdit = input<boolean>(true);
  readonly showDelete = input<boolean>(true);
  readonly tooltipCreate = input<string>('Crear');
  readonly tooltipEdit = input<string>('Editar');
  readonly tooltipDelete = input<string>('Eliminar');
  readonly iconCreate = input<string>('pi-plus');
  readonly iconEdit = input<string>('pi-pencil');
  readonly iconDelete = input<string>('pi-trash');

  private helpersService = inject(HelpersService);

  create() {
    this.serviceGeneric()?.eventFormComponent().openCreate();
  }

  edit() {
    const object = this.object();
    if ( object?.id ) {
      this.serviceGeneric()?.eventFormComponent().openEdit(object.id);
    } else {
      this.helpersService.messageNotification("warn", "Por favor", `Seleccione una Fila`, 3000);
    }
  }

  deleteRow() {
    const object = this.object();
    if ( object?.id ) {
      const ModalDeleteComponent: ModalDeleteComponent = this.serviceGeneric()?.eventModalDeleteComponent();
      ModalDeleteComponent.openConfirm();
    } else {
      this.helpersService.messageNotification("warn", "Por favor", `Seleccione una Fila`, 3000);
    }
  }

}
