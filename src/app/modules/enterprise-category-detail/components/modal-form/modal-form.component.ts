import { Component, inject, signal } from '@angular/core';
import { EnterpriseCategoryDetailService } from '@enterpriseCategoryDetail/services/enterpriseCategoryDetail.service';
import { TableComponent } from '../table/table.component';
import { HelpersService } from '@core/services/helpers.service';
import { EnterpriseCategoryDetail, EnterpriseCategoryDetailSend } from '@core/models/EnterpriseCategoryDetail';
import { DataCommon } from '@core/models/FieldsCommons';

@Component({
  selector: 'app-modal-form',
  templateUrl: './modal-form.component.html'
})
export class ModalFormComponent {

  private helpersService = inject(HelpersService);
  private enterpriseCategoryDetailService = inject(EnterpriseCategoryDetailService);

  openModal: boolean = false;
  tittleForm: string = "";
  tableEnterpriseCategoryDetailComponent!: TableComponent;
  isLoading = false;
  idAprobador!: number | null;
  idModerador!: number | null;
  moderator = signal(new DataCommon);
  approver = signal(new DataCommon);

  ngOnInit() {
    this.enterpriseCategoryDetailService.eventFormComponent.emit(this);
    this.enterpriseCategoryDetailService.eventTableComponent.subscribe((tableComponent) => {
      this.tableEnterpriseCategoryDetailComponent = tableComponent;
    });
  };

  hideModal() {
    this.openModal = false;
    this.isLoading = false;
  };

  openCreate(){
    if ( this.tableEnterpriseCategoryDetailComponent.selectedEnterpriseCategoryDetail() && this.tableEnterpriseCategoryDetailComponent.selectedEnterpriseCategoryDetail().subCategoryId ) {
      this.tittleForm = "Asignar Aprobador y Moderador";
      this.mapperbyModeratorAndApprover();
      this.openModal = true;
    } else {
      this.helpersService.messageNotification("warn", "Por favor", `Seleccione una Subcategoría.`, 3000);
    }
  };

  mapperbyModeratorAndApprover() {
    this.setAprobador(null);
    this.setModerador(null);

    if ( this.tableEnterpriseCategoryDetailComponent.selectedEnterpriseCategoryDetail().approvedid ) {
      this.approver().id = this.tableEnterpriseCategoryDetailComponent.selectedEnterpriseCategoryDetail().approvedid;
      this.approver().name = this.tableEnterpriseCategoryDetailComponent.selectedEnterpriseCategoryDetail().approvedname!.split('@')[0];
    } else this.approver.set(new DataCommon);


    if ( this.tableEnterpriseCategoryDetailComponent.selectedEnterpriseCategoryDetail().moderatorid ) {
      this.moderator().id = this.tableEnterpriseCategoryDetailComponent.selectedEnterpriseCategoryDetail().moderatorid;
      this.moderator().name = this.tableEnterpriseCategoryDetailComponent.selectedEnterpriseCategoryDetail().moderatorname!.split('@')[0];
    } else this.moderator.set(new DataCommon);
  }

  setAprobador( idAprobador: number | null ) {
    this.idAprobador = idAprobador
  }

  setModerador( idModerador: number | null ) {
    this.idModerador = idModerador;
  }

  saveChanges() {
    let data: EnterpriseCategoryDetailSend = {
      enterprise: this.tableEnterpriseCategoryDetailComponent.enterprise().id,
      category: this.tableEnterpriseCategoryDetailComponent.enterpriseCategory().categoryId,
      subCategory: this.tableEnterpriseCategoryDetailComponent.selectedEnterpriseCategoryDetail().subCategoryId as number,
      approved: this.idAprobador,
      moderator: this.idModerador
    };

    ( this.tableEnterpriseCategoryDetailComponent.selectedEnterpriseCategoryDetail().id )?
      this.updateEnterpriseCategoryDetail(data): this.createEnterpriseCategoryDetail(data);
  }

  createEnterpriseCategoryDetail(data: EnterpriseCategoryDetailSend) {
    this.enterpriseCategoryDetailService.create(data).subscribe({
      next: () => {
        this.tableEnterpriseCategoryDetailComponent.reload();
        this.helpersService.messageNotification("success", "Correcto", `Se guardaron los cambios.`, 3000);
        this.tableEnterpriseCategoryDetailComponent.selectedEnterpriseCategoryDetail.set(new EnterpriseCategoryDetail);
        this.hideModal();
      },
      error: (err) => {
        this.isLoading = false;
        console.log(err);
        this.helpersService.messageNotification("error", 'Error', err.message, 3000);
      }
    });
  }

  updateEnterpriseCategoryDetail(data: EnterpriseCategoryDetailSend) {
    this.enterpriseCategoryDetailService.update(this.tableEnterpriseCategoryDetailComponent.selectedEnterpriseCategoryDetail().id as number, data).subscribe({
      next: () => {
        this.tableEnterpriseCategoryDetailComponent.reload();
        this.helpersService.messageNotification("success", "Correcto", `Se guardaron los cambios.`, 3000);
        this.tableEnterpriseCategoryDetailComponent.selectedEnterpriseCategoryDetail.set(new EnterpriseCategoryDetail);
        this.hideModal();
      },
      error: (err) => {
        this.isLoading = false;
        console.log(err);
        this.helpersService.messageNotification("error", 'Error', err.message, 3000);
      }
    });
  }
}
