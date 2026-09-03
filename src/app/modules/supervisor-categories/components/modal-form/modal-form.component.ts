import { Component, inject, signal, input } from '@angular/core';
import { EnterpriseService } from '@enterprise/services/enterprises.service';
import { SupervisorCategoryService } from '@supervisorCategory/services/supervisor-categories.service';
import { HelpersService } from '@core/services/helpers.service';
import { Enterprise } from '@core/models/Enterprise';
import { DataCommon } from '@core/models/FieldsCommons';
import { ISupervisorCategorySave } from '@core/interfaces/supervisor-category.interface';
import { LABELS } from '@core/constants/labels';
import { FormsModule } from '@angular/forms';
import { TableDoubleComponent } from '../../../../shared/components/table-double/table-double.component';
import { PrimeModules } from '@shared/prime-components/prime-components.module';

@Component({
    selector: 'app-modal-form',
    templateUrl: './modal-form.component.html',
    imports: [TableDoubleComponent, PrimeModules, FormsModule]
})
export class ModalFormComponent {

  readonly supervisorId = input<number>();

  private enterpriseService = inject(EnterpriseService);
  private supervisorCategoryService = inject(SupervisorCategoryService);
  private helpersService = inject(HelpersService);

  public readonly labels = LABELS;
  public openModal = false;
  public titleForm = "Asignar Categorías";
  private tableComponent = this.supervisorCategoryService.eventTableComponent;

  public sourceProducts = signal<DataCommon[]>([]);
  public targetProducts = signal<DataCommon[]>([]);
  public enterprises = signal<Enterprise[]>([]);
  public enterpriseId!: number;

  ngOnInit() {
    this.supervisorCategoryService.eventFormComponent.set(this);
    this.getEnterprises();
  };

  public openCreate() {
    if ( this.supervisorId() ) {
      this.enterpriseId = null;
      this.getCategories();
      this.openModal = true;
    } else {
      this.helpersService.messageNotification("warn", "Por favor", `Seleccione un supervisor.`, 3000);
    }
  };

  public getCategories() {
    if (this.enterpriseId) {
      this.supervisorCategoryService.getAssignedUnassigned(this.supervisorId(), this.enterpriseId).subscribe({
        next: (res) => {
          this.targetProducts.set(res.assigned.map(row => {
            return {
              id: row.categoryId,
              name: row.categoryName + ' - ' + row.subCategoryName,
              subId: row.subCategoryId
            }
          }));
          this.sourceProducts.set(res.unassigned.map(row => {
            return {
              id: row.categoryId,
              name: row.categoryName + ' - ' + row.subCategoryName,
              subId: row.subCategoryId
            }
          }));
        }
      });
    } else {
      this.cleanSubCategories();
    }
  }

  private cleanSubCategories() {
    this.targetProducts.set([]);
    this.sourceProducts.set([]);
  }

  public updateSupervisorCategories() {
    const body: ISupervisorCategorySave = {
      supervisorId: this.supervisorId(),
      enterpriseId: this.enterpriseId,
      categorySubCategory: this.targetProducts().map( item => {
        return {
          categoryId: item.id,
          subCategoryId: item.subId
        }
      })
    };
    this.supervisorCategoryService.save(body).subscribe({
      next: () => {
        this.helpersService.messageNotification("success", "Correcto", `Se asignó la categoría correctamente.`, 2000);
        this.getCategories();
      },
      error: () => {
        this.getCategories();
      }
    });
  }

  private getEnterprises() {
    this.enterpriseService.select().subscribe({
      next: (res) => {
        this.enterprises.set(res);
      }
    });
  }

  public hideModal() {
    this.openModal = false;
  };

  public actionsHideModal() {
    this.tableComponent().reload();
  }

}
