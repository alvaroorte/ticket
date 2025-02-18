import { inject, signal } from "@angular/core";
import { DataCommon } from "@core/models/FieldsCommons";
import { Parameter } from "src/app/core/models/Parameter";
import { HelpersService } from "src/app/core/services/helpers.service";
import { EnterpriseCategoriesService } from "@enterpriseCategory/services/enterpriseCategories.service";
import { Team } from "@core/models/Team";
import { EnterpriseCategorySend, EnterpriseCategoryTableDouble } from "@core/models/EnterpriseCategory";

export class TableDoubleHelper {

  enterpriseCategoriesService = inject(EnterpriseCategoriesService);
  helpersService = inject(HelpersService);

  selectedCategory = signal<Parameter>( new Parameter );
  sourceProducts = signal<DataCommon[] | any>([]);
  targetProducts = signal<DataCommon[] | any>([]);
  teams: Team[] = [];
  team!: number | undefined;
  enterprise!: number;

  teamVerify() {
    if ( this.team ) return true;
    return false;
  }

  getCategories( id: number ) {
    this.enterprise = id;
    this.enterpriseCategoriesService.listAsignation(id).subscribe({
      next: (res) => {
        res = res.map( row =>  {
          return {
            ...row,
            name: row.category + ' - ' + row.subCategory 
          }
        })
        this.targetProducts.set(res.filter( dato => dato.description == 'asignado' ));
        this.sourceProducts.set(res.filter( dato => dato.description == 'disponible' ));
      },
      error: (err) => {
        console.log(err);
      }
    });
  }

  cleanSubCategories() {
    this.targetProducts.set([]);
    this.sourceProducts.set([]);
  }

  add(items:any){
    if ( this.teamVerify() ) {
      let body: EnterpriseCategorySend = {
        enterprise: this.enterprise,
        team: this.team as number,
        category: items[0].categoryId,
        subCategory: items[0].subCategoryId
      };
      this.enterpriseCategoriesService.create(body).subscribe({
        next: () => {
          this.helpersService.messageNotification("success", "Correcto", `Se asignó la categoría correctamente.`, 2000);
          this.getCategories(this.enterprise);
        },
        error: (err) => {
          console.log(err);
          this.getCategories(this.enterprise);
        }
      });
    } else {
      this.getCategories(this.enterprise);
      this.helpersService.messageNotification("warn", "Por Favor", `Seleccione un Equipo.`, 3000);
    }

  }

  allAdd(items:any){
    if ( this.teamVerify() ) {
      let categories = items;
      let body:EnterpriseCategorySend[] = [];
      categories.map( (category: EnterpriseCategoryTableDouble) => {
          body.push({
            enterprise: this.enterprise,
            team: this.team as  number,
            category: category.categoryId,
            subCategory: category.subCategoryId
          })
      });
      this.enterpriseCategoriesService.createList(body).subscribe({
        next: () => {
          this.helpersService.messageNotification("success", "Correcto", `Se asignó todas las Categorías correctamente.`, 3000);
          this.getCategories(this.enterprise);
        },
        error: (err) => {
          console.log(err);
          this.getCategories(this.enterprise);
        }
      });
    } else {
      this.getCategories(this.enterprise);
      this.helpersService.messageNotification("warn", "Por Favor", `Seleccione un Equipo.`, 3000);
    }
  }

  remove(items:any){
    let category: DataCommon = items[0];
    this.enterpriseCategoriesService.delete(category.id as number ).subscribe({
      next: () => {
        this.helpersService.messageNotification("warn", "Correcto", `Se quitó la Categoría correctamente.`, 2000);
        this.getCategories(this.enterprise);
      },
      error: (err) => {
        console.log(err);
        this.getCategories(this.enterprise);
      }
    });
  }

  allRemove(items:any){
    let categories = items;
    let body:any[] = [];
    categories.map( (category: DataCommon) => {
        body.push({
          id: category.id
        })
    });
    this.enterpriseCategoriesService.deleteList(body).subscribe({
      next: () => {
        this.helpersService.messageNotification("warn", "Correcto", `Se quitó todas las Categorías correctamente.`, 3000);
        this.getCategories(this.enterprise);
      },
      error: (err) => {
        this.getCategories(this.enterprise);
        console.log(err);
      }
    });
  }
}
