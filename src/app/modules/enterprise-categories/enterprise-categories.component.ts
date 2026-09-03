import { Component, inject, signal, input } from '@angular/core';
import { Enterprise } from '@core/models/Enterprise';
import { ToolbarComponent } from '@shared/components/toolbar/toolbar.component';
import { EnterpriseCategory } from '@core/models/EnterpriseCategory';
import { EnterpriseCategoryService } from './services/enterpriseCategories.service';
import { LABELS } from '@core/constants/labels';
import { PrimeModules } from '@shared/prime-components/prime-components.module';
import { TableComponent } from './components/table/table.component';
import { ModalFormComponent } from './components/modal-form/modal-form.component';
import { ModalRolesComponent } from './components/modal-roles/modal-roles.component';
import { ModalApproverModeratorComponent } from './components/modal-approver-moderator/modal-approver-moderator.component';
import { ModalTagsComponent } from './components/modal-tags/modal-tags.component';

@Component({
    selector: 'app-enterprise-categories',
    imports: [
      ToolbarComponent, 
      TableComponent,
      ModalFormComponent,
      ModalRolesComponent,
      PrimeModules,
      ModalApproverModeratorComponent,
      ModalTagsComponent
    ],
    templateUrl: './enterprise-categories.component.html'
})
export class EnterpriseCategoriesComponent {
  readonly enterpriseId = input.required<number>();

  public enterpriseCategoryService = inject(EnterpriseCategoryService);

  public readonly labels = LABELS;
  public selectedEnterpriseCategory = signal<EnterpriseCategory>(new EnterpriseCategory);

  public setEnterpriseCategoryDetail( selectedEnterpriseCategory: EnterpriseCategory ) {
    this.selectedEnterpriseCategory.set(selectedEnterpriseCategory);
  }

  public openModalApproverModerator() {
    this.enterpriseCategoryService.eventModalApproverModeratorComponent.emit();
  }
  
  public openModalRoles() {
    this.enterpriseCategoryService.eventModalRolesComponent.emit();
  }
  
  public openModalTags() {
    this.enterpriseCategoryService.eventOpenModalTagsComponent.emit();
  }
}
