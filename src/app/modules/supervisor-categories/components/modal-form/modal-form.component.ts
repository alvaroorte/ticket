import { Component, inject } from '@angular/core';
import { TableComponent } from '../table/table.component';
import { TableComponent as TableSupervisorComponent } from '@supervisor/components/table/table.component';
import { TableDoubleHelper } from './helpers/table-double.helper';
import { EnterprisesService } from '@enterprise/services/enterprises.service';

@Component({
  selector: 'app-modal-form',
  templateUrl: './modal-form.component.html'
})
export class ModalFormComponent extends TableDoubleHelper {

  private enterpriseService = inject(EnterprisesService);

  openModal: boolean = false;
  tittleForm: string = "";
  tableComponent!: TableComponent;
  tableSupervisorComponent!: TableSupervisorComponent;
  isLoading = false;

  ngOnInit() {
    this.supervisorCategoriesService.eventFormComponent.emit(this);
    this.supervisorCategoriesService.eventTableComponent.subscribe((tableComponent) => {
      this.tableComponent = tableComponent;
    });

    this.getEnterprises();
  };

  getEnterprises() {
    this.enterpriseService.getAll().subscribe({
      next: (res) => {
        this.enterprises = res
      },
      error: (err) => {
        console.log(err);
        this.helpersService.messageNotification("error", 'Error', err.message, 3000);
      }
    });
  }

  hideModal() {
    this.openModal = false;
    this.isLoading = false;
  };

  actionsHideModal() {
    this.tableComponent.reload();
  }

  openCreate(){
    if ( this.tableComponent.supervisor() && this.tableComponent.supervisor().id ) {
      this.supervisorId = this.tableComponent.supervisor().id as number;
      this.tittleForm = "Asignar Categorías";
      this.openModal = true;
    } else {
      this.helpersService.messageNotification("warn", "Por favor", `Seleccione un supervisor.`, 3000);
    }
  };
}
