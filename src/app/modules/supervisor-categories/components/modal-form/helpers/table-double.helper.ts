import { inject, signal } from "@angular/core";
import { DataCommon } from "@core/models/FieldsCommons";
import { Parameter } from "src/app/core/models/Parameter";
import { HelpersService } from "src/app/core/services/helpers.service";
import { SupervisorCategoriesService } from "@supervisorCategory/services/supervisor-categories.service";
import { SupervisorCategorySend, SupervisorDetailDelete } from "@core/models/SupervisorCategory";
import { Enterprise } from "@core/models/Enterprise";

export class TableDoubleHelper {

  supervisorCategoriesService = inject(SupervisorCategoriesService);
  helpersService = inject(HelpersService);
  selectedCategory = signal<Parameter>( new Parameter );
  sourceProducts = signal<DataCommon[]>([]);
  targetProducts = signal<DataCommon[]>([]);
  enterprises: Enterprise[] = [];
  enterpriseId!: number;
  supervisorId!: number;

  enterpriseVerify() {
    if ( this.enterpriseId ) return true;
    return false;
  }

  getCategories() {
    if (this.enterpriseId) {
      this.supervisorCategoriesService.listAsignation(this.enterpriseId, this.supervisorId).subscribe({
        next: (res) => {
          this.targetProducts.set(res.filter( dato => dato.description == 'asignado' ));
          this.sourceProducts.set(res.filter( dato => dato.description == 'disponible' ));
        },
        error: (err) => {
          console.log(err);
        }
      });
    } else {
      this.cleanSubCategories();
    }
  }

  cleanSubCategories() {
    this.targetProducts.set([]);
    this.sourceProducts.set([]);
  }

  add(items:any){
    const category: number = items[0].id;
    const subCategory: number = items[0].subId;
    let body: SupervisorCategorySend = {
      supervisor: this.supervisorId,
      enterprise: this.enterpriseId,
      category,
      subCategory
    };
    this.supervisorCategoriesService.create(body).subscribe({
      next: () => {
        this.helpersService.messageNotification("success", "Correcto", `Se asignó la categoría correctamente.`, 2000);
        this.getCategories();
      },
      error: (err) => {
        console.log(err);
        this.getCategories();
      }
    });
  }

  allAdd(items:any){
    let categories = items;
    let body:SupervisorCategorySend[] = [];
    categories.map( (category: DataCommon) => {
        body.push({
          supervisor: this.supervisorId,
          enterprise: this.enterpriseId,
          category: category.id as number,
          subCategory: category.subId as number
        })
    });
    this.supervisorCategoriesService.createList(body).subscribe({
      next: () => {
        this.helpersService.messageNotification("success", "Correcto", `Se asignó todas las Categorías correctamente.`, 3000);
        this.getCategories();
      },
      error: (err) => {
        console.log(err);
        this.getCategories();
      }
    });
  }

  remove(items:any){
    let categoryDetailId: number = items[0].id;
    this.supervisorCategoriesService.delete( categoryDetailId ).subscribe({
      next: () => {
        this.helpersService.messageNotification("warn", "Correcto", `Se quitó la Categoría correctamente.`, 2000);
        this.getCategories();
      },
      error: (err) => {
        console.log(err);
        this.getCategories();
      }
    });
  }

  allRemove(items:any){
    let categories = items;
    let body:SupervisorDetailDelete[] = [];
    categories.map( (category: DataCommon) => {
        body.push({
          supervisorDetail: category.id as number
        })
    });
    this.supervisorCategoriesService.deleteList(body).subscribe({
      next: () => {
        this.helpersService.messageNotification("warn", "Correcto", `Se quitó todas las Categorías correctamente.`, 3000);
        this.getCategories();
      },
      error: (err) => {
        console.log(err);
        this.getCategories();
      }
    });
  }
}
