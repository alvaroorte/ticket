import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Inject, Injectable } from '@angular/core';
import { catchError, throwError } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class HttpService<T> {

  constructor(
    protected http: HttpClient,
    @Inject('url') protected url: string
  ) {}

  findAll() {
    return this.http.get<T[]>(this.url).pipe(catchError(this.handleError));
  }

  findById(id: number) {
    return this.http.get<T>(`${this.url}/${id}`).pipe(catchError(this.handleError));
  }

  create(t: T) {
    return this.http.post(this.url, t).pipe(catchError(this.handleError));
  }

  update(id: number, t: T) {
    return this.http.put(`${this.url}/${id}`, t).pipe(catchError(this.handleError));
  }

  delete(id: number) {
    return this.http.delete(`${this.url}/${id}`).pipe(catchError(this.handleError));
  }

  private handleError(error: HttpErrorResponse) {
    let errorMessage = 'An error occurred.';
    if (error.error instanceof ErrorEvent) {
      errorMessage = error.error.message;
    } else {
      errorMessage = `Error Code: ${error.status}\nMessage: ${error.message}`;
    }
    console.error(errorMessage);
    return throwError(() => error);
  }
}
