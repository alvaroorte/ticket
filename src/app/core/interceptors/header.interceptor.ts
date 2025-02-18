import { Injectable, inject } from '@angular/core';
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor,
  HttpErrorResponse
} from '@angular/common/http';
import { Observable, catchError, of, throwError } from 'rxjs';
import { HelpersService } from '@core/services/helpers.service';
import { LoginService } from '@core/services/login.service';
import { messages } from '@core/constants/constants';
import { JwtPayload, jwtDecode } from 'jwt-decode';

@Injectable()
export class HeaderInterceptor implements HttpInterceptor {

  private helperService = inject(HelpersService);
  private loginService = inject(LoginService);
  intercept(request: HttpRequest<unknown>, next: HttpHandler): Observable<HttpEvent<any>> {
    let cloneRequest = request;
    if( localStorage.getItem('token') ) {
      cloneRequest = request.clone({
        setHeaders: {
          Authorization: `Bearer ${localStorage.getItem('token')}`
        }
      })
    }
    this.checkDate();
    return next.handle(cloneRequest).pipe(
      catchError((error: HttpErrorResponse): Observable<any> => {
        let errorMessage: string[] = [];
        let err:any = (typeof error.error == "string")? JSON.parse(error.error): error.error;
         
        if (error.status === 403 || error.status === 401) {
          this.helperService.messageNotification( 'warn', 'Error', 'Error de permisos, usted no tiene permitido realizar esta acción');
          return of(null)
        }
        if (error.status === 500) {
          errorMessage.push(err.message);
        }
        if (error.status === 409) {
          errorMessage.push(err.message);
        }
        if (error.status === 404) {
            errorMessage.push(err.message);
        }
        if (error.status === 400) {
          if (err && err.message) {
            errorMessage.push(err.message);
          } else if (err && err.errors) {
            err.errors.forEach((errorMessages: any) => {
              errorMessage.push(errorMessages.message);
            });
          } else if (err && err.errorList) {
            err.errorList.forEach((errorMessages: any) => {
              errorMessage.push(errorMessages.message);
            });
          }
        }
        return throwError(() => new Error(errorMessage.join(', ')));
      })
    );
  }

  public checkDate() {
    this.checkExpDate().then((isExpired) => {
      if (isExpired) {
        this.helperService.messageNotification('warn', 'Advertencia', messages.expiredSession );
        this.loginService.eventLogout.emit();
      }
    });
  }

  public async checkExpDate(): Promise<boolean> {
    const response = localStorage.getItem('token');
    if ( response ) {
      const infoDecoded: JwtPayload = jwtDecode(response);
      return infoDecoded && infoDecoded.exp ? infoDecoded.exp < parseInt(Date.now().toString().substring(0, 10)) : false;
    }
    return false;
  }
}
