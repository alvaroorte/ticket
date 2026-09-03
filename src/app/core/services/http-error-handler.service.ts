import { HttpErrorResponse, HttpStatusCode } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { throwError } from 'rxjs';
import { MessageService } from 'primeng/api';
import { APIErrorBase, CustomValidationError, DtoValidationError, EntityValidatorMultipleError, FormattedHttpError } from '../interfaces/http-error-handling.interface';
import { LoginService } from './login.service';
import { MESSAGES } from '@core/constants/messages';

/**
 * Service to handle http errors.
 */
@Injectable({
  providedIn: 'root',
})
export class HttpErrorHandlerService {

  private messageService = inject(MessageService);
  private loginService = inject(LoginService);
  /**
   * Catches an HttpErrorResponse, formats it, displays it, and throws an error.
   * @param {HttpErrorResponse} httpErrorResponse Http error response.
   * @param displayToast True by default, calls primeng `MessageService` for displaying the error or errors.
   * @returns 
   */
  public handleAndThrow(httpErrorResponse: HttpErrorResponse) {
    const formattedError = this.httpErrorFormatter(httpErrorResponse);
    this.displayErrors(formattedError.errors);
    return throwError(() => formattedError);
  }

  public httpErrorFormatter(httpErrorResponse: HttpErrorResponse): FormattedHttpError {
    const apiErrorBase: APIErrorBase = typeof httpErrorResponse.error == 'string'? JSON.parse(httpErrorResponse.error): httpErrorResponse.error;
    const errors: string[] = [];
    switch (httpErrorResponse.status) {
      case HttpStatusCode.InternalServerError:
        return {
          code: httpErrorResponse.status,
          status: httpErrorResponse.statusText,
          errors: apiErrorBase.error && apiErrorBase.error.length < 120? [apiErrorBase.error]: ['Error Interno del Servidor'],
          path: apiErrorBase.path ?? '/'
        };
      case HttpStatusCode.Forbidden:
        this.loginService.logout();
        return {
          code: httpErrorResponse.status,
          status: httpErrorResponse.statusText,
          errors: [MESSAGES.yourSessionExpiredLoginAgain],
          path: apiErrorBase.path ?? '/'
        };
      case HttpStatusCode.Unauthorized:
        this.loginService.logout();
        return {
          code: httpErrorResponse.status,
          status: httpErrorResponse.statusText,
          errors: [MESSAGES.yourSessionExpiredLoginAgain],
          path: apiErrorBase.path ?? '/'
        };
      case HttpStatusCode.PaymentRequired:
        this.loginService.logout();
        return {
          code: httpErrorResponse.status,
          status: httpErrorResponse.statusText,
          errors: [apiErrorBase.message],
          path: apiErrorBase.path ?? '/'
        };
      case HttpStatusCode.NotFound:
        return {
          code: httpErrorResponse.status,
          status: httpErrorResponse.statusText,
          errors: apiErrorBase.error? [apiErrorBase.error]: ['Ruta no encontrada.'],
          path: apiErrorBase.path ?? '/'
        };
      default:
        break;
    }

    if (apiErrorBase.message) {
      errors.push(apiErrorBase.message);
    }

    if (apiErrorBase.errors) {
      errors.push(...apiErrorBase.errors.map((error: DtoValidationError) => error.message));
    }

    if (apiErrorBase.errorList) {
      if (this.isCustomValidationErrorArray(apiErrorBase.errorList)) {
        errors.push(this.convertArrayToPlainTextList(apiErrorBase.errorList));
      } else {
        errors.push(...(apiErrorBase.errorList as EntityValidatorMultipleError[]).map((error: EntityValidatorMultipleError) => error.message));
      }
    }
    return {
      code: apiErrorBase.code,
      status: apiErrorBase.status,
      path: apiErrorBase.path,
      errors
    };
  }

  private convertArrayToPlainTextList(details: CustomValidationError[]): string {
    return details.map((error: CustomValidationError) => `• ${error.message}`).join('\n');
  }

  private isCustomValidationErrorArray(obj: any): obj is CustomValidationError[] {
    return Array.isArray(obj) && obj.every(item => {
      return typeof item.field === 'string' && typeof item.message === 'string' && typeof item.code === 'string';
    });
  }

  private displayErrors(errors: string[]) {
    errors.forEach((message: string) =>
      this.messageService.add({ severity: 'error', detail: message, life: 3000 })
    );
  }
}
