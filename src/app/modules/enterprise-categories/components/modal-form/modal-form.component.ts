import { Component, inject, input, signal } from '@angular/core';
import { EnterpriseCategorySend, EnterpriseCategoryTableDouble } from '@core/models/EnterpriseCategory';
import { HelpersService } from '@core/services/helpers.service';
import { EnterpriseCategoryService } from '@enterpriseCategory/services/enterpriseCategories.service';
import { TeamSelect } from '@core/models/Team';
import { teamCategorySubCategory } from '@core/interfaces/enterprise.interface';
import { TypeTableDoubleEnum } from '@core/enums/table-double.enum';
import { TeamService } from '@team/services/teams.service';
import { LABELS } from '@core/constants/labels';
import { PrimeModules } from '@shared/prime-components/prime-components.module';
import { TableDoubleComponent } from '@shared/components/table-double/table-double.component';
import { FormsModule } from '@angular/forms';

@Component({
    selector: 'app-modal-form',
    templateUrl: './modal-form.component.html',
    imports: [PrimeModules, TableDoubleComponent, FormsModule]
})
export class ModalFormComponent {

  readonly selectedEnterpriseId = input.required<number>();

  public enterpriseCategoryService = inject(EnterpriseCategoryService);
  public teamService = inject(TeamService);
  private helpersService = inject(HelpersService);

  public readonly labels = LABELS;
  public sourceProducts = signal<EnterpriseCategoryTableDouble[]>([]);
  public targetProducts = signal<EnterpriseCategoryTableDouble[]>([]);
  public teams: TeamSelect[] = [];
  public teamSelectedId: number;
  public typeTableDoubleEnum = TypeTableDoubleEnum;
  public openModal: boolean = false;
  public tittleForm: string = "";
  private tableComponent = this.enterpriseCategoryService.eventTableComponent;

  ngOnInit() {
    this.enterpriseCategoryService.eventFormComponent.set(this);
  };

  private getTeams() {
    this.teamService.select().subscribe({
      next: (res) => {
        this.teams = res;
      }
    })
  }

  public actionsHideModal() {
    this.tableComponent().reload();
  }

  public openCreate(){
    if ( this.selectedEnterpriseId() ) {
      this.getTeams();
      this.teamSelectedId = null;
      this.getlistAsignation()
      this.tittleForm = "Asignar Categorías";
      this.openModal = true;
    } else {
      this.helpersService.messageNotification("warn", "Por favor", `Seleccione una Empresa.`, 3000);
    }
  };

  private teamVerify(): boolean {
      if ( this.teamSelectedId ) return true;
      return false;
    }
  
  private getlistAsignation() {
    this.enterpriseCategoryService.listAsignation(this.selectedEnterpriseId()).subscribe({
      next: (res: EnterpriseCategoryTableDouble[]) => {
        res = res.map( row =>  {
          return {
            ...row,
            name: `${row.category} - ${row.subCategory} ${row.teamId? '('+ row.teamName +')': ''}`
          }
        })
        this.targetProducts.set(res.filter( dato => dato.description == 'asignado' ));
        this.sourceProducts.set(res.filter( dato => dato.description == 'disponible' ));
      }
    });
  }

  private cleanSubCategories() {
    this.targetProducts.set([]);
    this.sourceProducts.set([]);
  }

  private mapperForSendEnterpriseCategory(): teamCategorySubCategory[] {
    const list: EnterpriseCategoryTableDouble[] = this.targetProducts();
    return list.map( row => {
      const teamId: number = row.teamId == 0? this.teamSelectedId: row.teamId;
      return {
        teamId,
        categoryId: row.categoryId,
        subCategoryId: row.subCategoryId
      }
    })
  }

  public save(type: TypeTableDoubleEnum) {
    if ( (type == this.typeTableDoubleEnum.ADD && this.teamVerify()) || type == this.typeTableDoubleEnum.REMOVE ) {
      const body: EnterpriseCategorySend = {
        enterpriseId: this.selectedEnterpriseId(),
        teamCategorySubCategory: this.mapperForSendEnterpriseCategory()
      };
      this.enterpriseCategoryService.save(body).subscribe({
        next: () => {
          this.helpersService.messageNotification("success", "Correcto", `Se asignó la subcategoría(s) correctamente.`, 2000);
        }, complete: () => {
          this.getlistAsignation();
        }
      });
    } else {
      this.getlistAsignation();
      this.helpersService.messageNotification("warn", "Por Favor", `Seleccione un Equipo.`, 3000);
    }
  }

}
