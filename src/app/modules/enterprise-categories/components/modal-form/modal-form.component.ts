import { Component, inject } from '@angular/core';
import { EnterpriseCategory } from '@core/models/EnterpriseCategory';
import { TableComponent } from '../table/table.component';
import { TableComponent as TableEnterpriseComponent } from '@enterprise/components/table/table.component';
import { TableDoubleHelper } from './helpers/table-double.helper';
import { EnterprisesService } from '@enterprise/services/enterprises.service';

@Component({
  selector: 'app-modal-form',
  templateUrl: './modal-form.component.html'
})
export class ModalFormComponent extends TableDoubleHelper {

  private enterpriseService = inject(EnterprisesService);

  enterpriseCategory!: EnterpriseCategory;
  openModal: boolean = false;
  tittleForm: string = "";
  tableComponent!: TableComponent;
  tableEnterpriseComponent!: TableEnterpriseComponent;
  isLoading = false;

  ngOnInit() {
    this.enterpriseCategoriesService.eventFormComponent.emit(this);
    this.enterpriseCategoriesService.eventTableComponent.subscribe((tableComponent) => {
      this.tableComponent = tableComponent;
    });

    this.enterpriseService.eventTableComponent.subscribe((tableEnterpriseComponent) => {
      this.tableEnterpriseComponent = tableEnterpriseComponent;
    });
    this.getTeams();
  };

  getTeams() {
    this.enterpriseCategoriesService.getTeams().subscribe({
      next: (res) => {
        this.teams = res;
      },
      error: (err) => {
        console.log(err);
        this.helpersService.messageNotification("error", 'Error', err.message, 3000);
      }
    })
  }

  hideModal() {
    this.openModal = false;
    this.isLoading = false;
  };

  actionsHideModal() {
    this.tableComponent.reload();
  }

  openCreate(){
    if ( this.tableComponent.enterprise() && this.tableComponent.enterprise().id ) {
      this.team = undefined;
      this.getCategories( this.tableComponent.enterprise().id as number )
      this.tittleForm = "Asignar Categorías";
      this.openModal = true;
    } else {
      this.helpersService.messageNotification("warn", "Por favor", `Seleccione una Empresa.`, 3000);
    }
  };
}
