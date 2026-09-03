import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable, Output, EventEmitter, inject, signal  } from '@angular/core';
import { Category, CategoryResponse, CategoryShort, SubcategoryForAsignToCategory, SubcategorySendAddToCategory, SubcategoryShort } from 'src/app/core/models/Category';
import { environment } from '@core/environments/environment.development';
import { Observable } from 'rxjs';
import { IServiceCommon } from '@core/interfaces/service-common.interface';
import { ModalDeleteComponent } from '@shared/components/modal-delete/modal-delete.component';
import { CategoryFolderEnum } from '@core/enums/category-folder';
import { GenericTableComponent } from '@shared/components/generic-table/generic-table.component';
import { IGenericModalForm } from '@core/interfaces/generic-modal-form.interface';

@Injectable({
  providedIn: 'root'
})
export class CategoryService implements IServiceCommon {

  public eventFormComponent = signal<IGenericModalForm>(null);
  public eventTableComponent = signal<GenericTableComponent<CategoryResponse>>(null);
  public eventModalDeleteComponent = signal<ModalDeleteComponent>(null);
  @Output() eventOpenModalAssingSubcategory: EventEmitter<void> = new EventEmitter();
  
  private http = inject(HttpClient);
  
  private serverUrl: string = environment.server_url;
  
  public getById(id: number) {
    return this.http.get<Category>(this.serverUrl + 'category/' + id)
  }
  
  public create(category: Category) {
    return this.http.post<Category>(this.serverUrl + 'category', category)
  }
  
  public update(id: number, category: Category) {
    return this.http.put<Category>(this.serverUrl + 'category/' + id, category)
  }

  public delete(id: number): Observable<string>  {
    return this.http.delete(this.serverUrl + 'category/' + id, { responseType:'text'})
  }
  
  
  public getListCategoriesByEnterprise(enterpriseId: number, folder?: CategoryFolderEnum) {
    const params: HttpParams = new HttpParams()
      .set('enterpriseId', enterpriseId?? '')
      .set('ticketType', folder?? '')
    return this.http.get<CategoryShort[]>(this.serverUrl + 'category/listCategoriesByEnterprise', { params })
  }
  
  public getSubCategoriesByCategory(enterpriseId: number, categoryId: number) {
    const params: HttpParams = new HttpParams()
      .set('enterpriseId', enterpriseId)
      .set('categoryId', categoryId)
    return this.http.get<SubcategoryShort[]>(this.serverUrl + 'category/subCategoriesByCategory', { params })
  }
  
  public search(folder: string) {
    const params: HttpParams = new HttpParams()
      .set('type', folder);
    return this.http.get<CategoryResponse[]>(this.serverUrl+'category/search', { params })
  }
  
  public createOne( body: SubcategorySendAddToCategory ) {
    return this.http.post(this.serverUrl + 'catalogConfiguration', body);
  }
  
  public createList( body: SubcategorySendAddToCategory[] ) {
    return this.http.post(this.serverUrl + 'catalogConfiguration/createList', body);
  }
  
  public detailByCategory(idCategory: number) {
    return this.http.get<SubcategoryForAsignToCategory[]>(this.serverUrl + 'catalogConfiguration/proyection/' + idCategory)
  }
  
  public deleteOne(id: string) {
    return this.http.delete(this.serverUrl + 'catalogConfiguration/' + id)
  }
  
  public deleteList( body: {id: string}[] ) {
    return this.http.post(this.serverUrl + 'catalogConfiguration/deleteList', body);
  }
 
  public onlyInclude( id: number ) {
    return this.http.get<Category[]>(this.serverUrl + 'catalogConfiguration/onlyInclude/' + id);
  }
  
  public getSubCategory(enterpriseId: number, categoryId: number ) {
    const body = { 
      enterprise: enterpriseId, 
      category: categoryId 
    };
    return this.http.post<CategoryShort[]>(this.serverUrl + 'category/getSubCategory', body);
  }
  
  public getCategoryIncidentByEnterprise( enterpriseId: number ) {
    return this.http.get<CategoryShort[]>(this.serverUrl + 'category/incidents/' + enterpriseId);
  }
  
  public getSubCategoriesByCategories(enterpriseId: number, categoryIds: number[] ) {
    const params: HttpParams = new HttpParams()
      .set('enterpriseId', enterpriseId)
      .set('categoryIds', categoryIds.toString())
    return this.http.get<CategoryShort[]>(this.serverUrl + 'category/subCategoriesByCategories', {params});
  }
}
