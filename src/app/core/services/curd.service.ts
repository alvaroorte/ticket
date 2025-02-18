import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Inject, Injectable } from '@angular/core';
import { Observable, Subject, catchError } from 'rxjs';
import { HttpErrorHandlerService } from './http-error-handler.service';

@Injectable({
  providedIn: 'root',
})
export class CrudService<T> {
  private filteredData: Subject<T> = new Subject<T>();
  private selectedData: Subject<T> = new Subject<T>();

  constructor(
    protected http: HttpClient,
    @Inject('url') protected url: string,
    protected httpErrorHandlerService: HttpErrorHandlerService
  ) { }

  public findAll(defaultErrorHandler: boolean = true) {
    return this.request<T[]>(this.http.get<T[]>(this.url), defaultErrorHandler);
  }

  public findById(id: number, defaultErrorHandler: boolean = true) {
    return this.request<T>(this.http.get<T>(`${this.url}/${id}`), defaultErrorHandler);
  }

  public create(t: T, defaultErrorHandler: boolean = true) {
    return this.request(this.http.post(this.url, t), defaultErrorHandler);
  }

  public update(id: number, t: T, defaultErrorHandler: boolean = true) {
    return this.request(this.http.put(`${this.url}/${id}`, t), defaultErrorHandler);
  }

  public delete(id: number, defaultErrorHandler: boolean = true) {
    return this.request(this.http.delete(`${this.url}/${id}`), defaultErrorHandler);
  }

  protected request<T>(observable: Observable<T>, defaultErrorHandler: boolean = true): Observable<T> {
    return defaultErrorHandler
      ? observable.pipe(catchError((error: HttpErrorResponse) => this.httpErrorHandlerService.handleAndThrow(error)))
      : observable;
  }

  public getFilteredData() {
    return this.filteredData.asObservable();
  }

  public setFilteredData(data: T) {
    this.filteredData.next(data);
  }

  public getSelectedData() {
    return this.selectedData.asObservable();
  }

  public setSelectedData(data: T) {
    this.selectedData.next(data);
  }
}
