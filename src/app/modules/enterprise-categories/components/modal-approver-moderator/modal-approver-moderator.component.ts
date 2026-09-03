import { Component, inject, input } from '@angular/core';
import { HelpersService } from '@core/services/helpers.service';
import { EnterpriseCategory, EnterpriseCategoryDetailSend } from '@core/models/EnterpriseCategory';
import { EnterpriseCategoryService } from '@enterpriseCategory/services/enterpriseCategories.service';
import { Subscription } from 'rxjs';
import { Severity } from '@core/enums/severity';
import { LABELS } from '@core/constants/labels';
import { PrimeModules } from '@shared/prime-components/prime-components.module';
import { MultiSelectGenericUsersComponent } from '@shared/components/multi-select-generic-users/multi-select-generic-users.component';
import { ICredentialUser } from '@core/interfaces/user.interface';

@Component({
    selector: 'app-modal-approver-moderator',
    templateUrl: './modal-approver-moderator.component.html',
    imports: [PrimeModules, MultiSelectGenericUsersComponent]
})
export class ModalApproverModeratorComponent {

  readonly selectedEnterpriseCategory = input.required<EnterpriseCategory>();

  private helpersService = inject(HelpersService);
  private enterpriseCategoryService = inject(EnterpriseCategoryService);

  public readonly labels = LABELS;
  public openModal: boolean = false;
  public tittleForm: string = "Asignar Aprobador y Moderador";
  private tableEnterpriseCategoryComponent = this.enterpriseCategoryService.eventTableComponent;

  public moderators: ICredentialUser[];
  public approvers: ICredentialUser[];
  private moderatorIds: number[];
  private approverIds: number[];
  private subscription: Subscription;

  ngOnInit() {
    this.subscription = this.enterpriseCategoryService.eventModalApproverModeratorComponent.subscribe(() => {
      this.openCreate();
    });
  };

  ngOnDestroy(): void {
    if (this.subscription) {
      this.subscription.unsubscribe();
    }
  }

  public hideModal() {
    this.openModal = false;
  };

  private resetApproversAndModerators() {
    this.approverIds = [];
    this.moderatorIds = [];
  }

  private openCreate() {
    this.approvers = [];
    this.moderators = [];
    const selectedEnterpriseCategory = this.selectedEnterpriseCategory();
    if ( selectedEnterpriseCategory && selectedEnterpriseCategory.subCategoryId ) {
      this.resetApproversAndModerators();
      this.mapperbyModeratorAndApprover();
      this.openModal = true;
    } else {
      this.helpersService.messageNotification(Severity.warn, "Por favor", `Seleccione una fila.`, 3000);
    }
  };

  private mapperbyModeratorAndApprover() {
    const selectedEnterpriseCategory = this.selectedEnterpriseCategory();
    if ( selectedEnterpriseCategory.approvers ) {
      this.approvers = selectedEnterpriseCategory.approvers.map(a => ({email: a.email, credentialId: a.id}));
    }
   
    if ( selectedEnterpriseCategory.moderators ) {
      this.moderators = selectedEnterpriseCategory.moderators.map(m => ({email: m.email, credentialId: m.id}));
    }
  }

  public setAprobador( approverIds: number[]) {
    this.approverIds = approverIds;
  }

  public setModerador( moderatorIds: number[]) {
    this.moderatorIds = moderatorIds;
  }

  public saveChanges() {
    const data: EnterpriseCategoryDetailSend = {
      enterpriseId: this.selectedEnterpriseCategory().enterpriseId,
      categoryId: this.selectedEnterpriseCategory().categoryId,
      subCategoryId: this.selectedEnterpriseCategory().subCategoryId,
      approvers: this.approverIds,
      moderators: this.moderatorIds
    };

    this.enterpriseCategoryService.assignApproverModerator(data).subscribe({
      next: () => {
        this.helpersService.messageNotification(Severity.success, "Correcto", `Se guardaron los cambios.`, 3000);
        this.hideModal();
      }, complete: () => {
        this.tableEnterpriseCategoryComponent().reload();
      }
    });
  }

}
