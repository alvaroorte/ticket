import { HttpClient } from '@angular/common/http';
import { Injectable, Output, EventEmitter, inject  } from '@angular/core';
import { DataCommon } from '@core/models/FieldsCommons';
import { Category, CategoryResponse, ServicesByUser } from 'src/app/core/models/Category';
import { environment } from '@core/environments/environment.development';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class CategoriesService {

  @Output() eventFormComponent: EventEmitter<any> = new EventEmitter();
  @Output() eventTableComponent: EventEmitter<any> = new EventEmitter();
  @Output() eventModalDeleteComponent: EventEmitter<any> = new EventEmitter();
  @Output() eventToolbarComponent: EventEmitter<any> = new EventEmitter();
  @Output() eventTableDobleComponent: EventEmitter<any> = new EventEmitter();
  @Output() eventModalAssingSubcategory: EventEmitter<any> = new EventEmitter();
  @Output() eventDeleteRow: EventEmitter<any> = new EventEmitter();
  
  private http = inject(HttpClient);
  
  private serverUrl: string = environment.server_url;

  public getAll() {
    return this.http.get<Category[]>(this.serverUrl+'catalog')
  }
  
  public getById(id: number) {
    return this.http.get<Category>(this.serverUrl + 'catalog/' + id)
  }
  
  public create(category: Category) {
    return this.http.post<Category>(this.serverUrl + 'catalog', category)
  }
  
  public update(id: number, category: Category) {
    return this.http.put<Category>(this.serverUrl + 'catalog/' + id, category)
  }

  public delete(id: number): Observable<Object> | Observable<string>  {
    return this.http.delete(this.serverUrl + 'catalog/' + id, { responseType:'text'})
  }
  
  public listServices() {
    return this.http.get<ServicesByUser>(this.serverUrl + 'catalog/listServices')
  }
  
  public listServicesByEnterprise(body: {domain: string}) {
    return this.http.post<ServicesByUser>(this.serverUrl + 'catalog/listServicesByEnterprise', body)
  }
  
  public search(folder: string | undefined) {
    let params: any = {};
    ( folder )? params['folder'] = folder : "";
    return this.http.get<CategoryResponse[]>(this.serverUrl+'catalog/catalogSearch', { params })
  }
  
  public createOne( body:any ) {
    return this.http.post(this.serverUrl + 'catalogConfiguration', body);
  }
  
  public createList( body:any ) {
    return this.http.post(this.serverUrl + 'catalogConfiguration/createList', body);
  }
  
  public detailByCategory(idCategory: number) {
    return this.http.get<DataCommon[]>(this.serverUrl + 'catalogConfiguration/proyection/' + idCategory)
  }
  
  public deleteOne(id: string) {
    return this.http.delete(this.serverUrl + 'catalogConfiguration/' + id)
  }
  
  public deleteList( body:any ) {
    return this.http.post(this.serverUrl + 'catalogConfiguration/deleteList', body);
  }
 
  public onlyInclude( id:number ) {
    return this.http.get<Category[]>(this.serverUrl + 'catalogConfiguration/onlyInclude/' + id);
  }
  
  public getSubCategory( body: { enterprise: number, category: number } ) {
    return this.http.post<Category[]>(this.serverUrl + 'catalog/getSubCategory', body);
  }
}
