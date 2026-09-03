import { Component, inject, OnInit, output, input, WritableSignal, OnDestroy, signal } from '@angular/core';


import { HelpersService } from '@core/services/helpers.service';
import { RouterModule } from '@angular/router';
import { PrimeModules } from '../../prime-components/prime-components.module';
import { MESSAGES } from '@core/constants/messages';
import { LABELS } from '@core/constants/labels';
import { IGenericTable } from '@core/interfaces/generic-table.interface';
import { IServiceCommon } from '@core/interfaces/service-common.interface';
import { Severity } from '@core/enums/severity';

@Component({
    selector: 'app-modal-delete',
    imports: [RouterModule, PrimeModules],
    templateUrl: './modal-delete.component.html'
})

export class ModalDeleteComponent implements OnInit, OnDestroy {
  readonly serviceGeneric = input.required<IServiceCommon>();
  readonly objectId = input.required<number>();
  readonly onDeleteSuccess = output();

  private helpersService = inject(HelpersService);
  
  public readonly labels = LABELS;
  public readonly messages = MESSAGES;
  private tableComponent: WritableSignal<IGenericTable>;
  public openModal = signal<boolean>(false);

  ngOnInit() {
    const serviceGeneric = this.serviceGeneric();
    if ( serviceGeneric ) {
      serviceGeneric.eventModalDeleteComponent.set(this);
      this.tableComponent = serviceGeneric.eventTableComponent;
    }
  }

  ngOnDestroy(): void {
    this.serviceGeneric().eventModalDeleteComponent.set(null);
  }

  public openConfirm() {
      this.openModalDelete(true);
  }

  public confirmDelete() {
    this.openModalDelete(false);
    this.serviceGeneric().delete(this.objectId()).subscribe({
      next: () => {
        this.tableComponent().reload();
        this.onDeleteSuccess.emit();
        this.helpersService.messageNotification(Severity.success, "Correcto", MESSAGES.recordDeleted);
      }
    })
  }

  public openModalDelete(state: boolean) {
    this.openModal.set(state);
  }
}
