import { Component, inject, input } from '@angular/core';
import { HelpersService } from '@core/services/helpers.service';
import { EnterpriseCategory, EnterpriseCategoryUpdate } from '@core/models/EnterpriseCategory';
import { TableComponent } from '../table/table.component';
import { EnterpriseCategoryService } from '@enterpriseCategory/services/enterpriseCategories.service';
import { Subscription } from 'rxjs';
import { RoleService } from 'src/app/modules/role/services/role.service';
import { Role } from '@core/models/Role';
import { FormBuilder, FormGroup, FormsModule, Validators } from '@angular/forms';
import { MESSAGES } from '@core/constants/messages';
import { LABELS } from '@core/constants/labels';
import { PrimeModules } from '@shared/prime-components/prime-components.module';

@Component({
    selector: 'app-modal-roles',
    templateUrl: './modal-roles.component.html',
    imports: [PrimeModules, FormsModule]
})
export class ModalRolesComponent {

  readonly enterpriseCategory = input.required<EnterpriseCategory>();

  private formBuilder = inject(FormBuilder);
  private helpersService = inject(HelpersService);
  private roleService = inject(RoleService);
  private enterpriseCategoryService = inject(EnterpriseCategoryService);

  public labels = LABELS;
  public messages = MESSAGES;
  public openModal: boolean = false;
  public tittleForm: string = "Agregar roles";
  public roles: Role[] = [];
  public selectedRoles: string[] = [];
  private tableEnterpriseCategoryComponent = this.enterpriseCategoryService.eventTableComponent;
  private subscription: Subscription;
  public formCategory: FormGroup = this.formBuilder.group({
    roles: [, Validators.required],
  });

  ngOnInit() {
    this.subscription = this.enterpriseCategoryService.eventModalRolesComponent.subscribe(() => {
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

  private openCreate(){
    const enterpriseCategory = this.enterpriseCategory();
    if ( enterpriseCategory && enterpriseCategory.id ) {
      this.getRoles();
      this.selectedRoles = enterpriseCategory.roles?? [];
      this.openModal = true;
    } else {
      this.helpersService.messageNotification("warn", "Por favor", `Seleccione una fila.`, 3000);
    }
  };

  private getRoles() {
    this.roleService.getAll().subscribe({
      next: (resp) => {
        this.roles = resp;
      }
    });
  }

  public saveChanges() {
    const body: EnterpriseCategoryUpdate = {
      roles: this.selectedRoles
    };

    this.enterpriseCategoryService.update(this.enterpriseCategory().id, body).subscribe({
      next: () => {
        this.helpersService.messageNotification("success", "Correcto", `Se guardaron los cambios.`, 3000);
        this.hideModal();
      }, complete: () => {
        this.tableEnterpriseCategoryComponent().reload();
      }
    });
  }

}
