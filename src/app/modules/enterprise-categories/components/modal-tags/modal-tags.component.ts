import { Component, inject, input } from '@angular/core';
import { HelpersService } from '@core/services/helpers.service';
import { EnterpriseCategory, IUpdateTags } from '@core/models/EnterpriseCategory';
import { TableComponent } from '../table/table.component';
import { EnterpriseCategoryService } from '@enterpriseCategory/services/enterpriseCategories.service';
import { Subscription } from 'rxjs';
import { Severity } from '@core/enums/severity';
import { LABELS } from '@core/constants/labels';
import { PrimeModules } from '@shared/prime-components/prime-components.module';
import { MultiSelectGenericComponent } from '@shared/components/multi-select-generic/multi-select-generic.component';
import { ParameterService } from '@parameter/services/parameters.service';
import { IMultiSelectOptions } from '@core/interfaces/multi-select.interface';
import { FoldersParametersEnum } from '@core/enums/folder-parameters.enum';

@Component({
    selector: 'app-modal-tags',
    templateUrl: './modal-tags.component.html',
    imports: [PrimeModules, MultiSelectGenericComponent]
})
export class ModalTagsComponent {

  readonly selectedEnterpriseCategory = input.required<EnterpriseCategory>();

  private helpersService = inject(HelpersService);
  private enterpriseCategoryService = inject(EnterpriseCategoryService);
  private parameterService = inject(ParameterService);

  public readonly labels = LABELS;
  public openModal: boolean = false;
  public tittleForm: string = this.labels.addTags;
  private tableEnterpriseCategoryComponent = this.enterpriseCategoryService.eventTableComponent;
  public parameterTags: IMultiSelectOptions[];
  public selectedIds: number[];
  private subscription: Subscription;

  ngOnInit() {
    this.subscription = this.enterpriseCategoryService.eventOpenModalTagsComponent.subscribe(() => {
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
    const selectedEnterpriseCategory = this.selectedEnterpriseCategory();
    if ( selectedEnterpriseCategory && selectedEnterpriseCategory.id ) {
      this.getParameterTags();
      this.selectedIds = selectedEnterpriseCategory.tags? selectedEnterpriseCategory.tags.map(t => t.id): [];
    } else {
      this.helpersService.messageNotification(Severity.warn, "Por favor", `Seleccione una fila.`, 3000);
    }
  };
  
  private getParameterTags() {
    this.parameterService.select([FoldersParametersEnum.ETIQUETA]).subscribe({
      next: (res) => {
        this.parameterTags = res.map(param => {
          return {
            id: param.id,
            name: param.value
          }
        });
        this.openModal = true;
      }
    });
  }

  public setTagIds( tagIds: number[]) {
    this.selectedIds = tagIds;
  }


  public saveChanges() {
    const data: IUpdateTags = {
      parametersIds: this.selectedIds
    };
    this.enterpriseCategoryService.updateTags(this.selectedEnterpriseCategory().id, data).subscribe({
      next: () => {
        this.helpersService.messageNotification(Severity.success, "Correcto", `Se guardaron los cambios.`, 3000);
        this.hideModal();
      }, complete: () => {
        this.tableEnterpriseCategoryComponent().reload();
      }
    });
  }

}
