import { Component, EventEmitter, inject, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Input } from '@angular/core';
import { HelpersService } from '@core/services/helpers.service';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { PrimeComponentsModule } from '../../prime-components/prime-components.module';
import { messages } from '@core/constants/constants';

@Component({
  selector: 'app-modal-delete',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule, PrimeComponentsModule ],
  templateUrl: './modal-delete.component.html'
})
export class ModaldeleteComponent {
  @Input() serviceGeneric: any;
  @Input() object: number | any;
  @Output() onDeleteSuccess = new EventEmitter();
  private tableComponent: any;
  public openModal: boolean = false;

  private helpersService = inject(HelpersService);

  ngOnInit() {
    if ( this.serviceGeneric ) {
      this.serviceGeneric.eventModalDeleteComponent.emit(this);

      this.serviceGeneric.eventTableComponent.subscribe((tableComponent: any) => {
        this.tableComponent = tableComponent;
      });
    }
  }

  public openConfirm() {
      this.openModalDelete(true);
  }

  confirmDelete() {
    this.openModalDelete(false);
    this.serviceGeneric.delete( parseInt(this.object) ).subscribe({
      next: ( res:string ) => {
        this.tableComponent.reload();
        this.onDeleteSuccess.emit();
        this.helpersService.messageNotification("success", "Correcto", messages.deleteRow);
      },
      error: (err: any) => {
        console.log(err);
        this.helpersService.messageNotification("warn", "Error", err.message);
      }
    })
  }

  openModalDelete(state: any) {
    this.openModal = state;
  }
}
