import { Component, effect, inject } from '@angular/core';
import { MESSAGES } from '@core/constants/messages';
import { LoginService } from '@core/services/login.service';
import { LABELS } from '@core/constants/labels';
import { Router } from '@angular/router';
import { LoginRequest } from '@core/models/Login';
import { HelpersService } from '@core/services/helpers.service';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { PrimeModules } from '@shared/prime-components/prime-components.module';
import { TYPE_VIEW_LIST_TICKET } from '@core/constants/ticket-view-type';
import { ModalPaymentRequiredComponent } from '@shared/components/modal-payment-required/modal-payment-required.component';
import { HttpStatusCode } from '@angular/common/http';
import { FormattedHttpError } from '@core/interfaces/http-error-handling.interface';
import { Severity } from '@core/enums/severity';
import { switchMap } from 'rxjs';
import { ReCaptchaV3Service } from 'ng-recaptcha-2';

@Component({
    selector: 'app-login',
    imports: [PrimeModules, ReactiveFormsModule, ModalPaymentRequiredComponent],
    templateUrl: './login.component.html',
    styleUrls: ['./login.component.scss']
})
export class LoginComponent {

  private loginService = inject(LoginService);
  private router =  inject(Router);
  private helpersService = inject(HelpersService);
  private formBuilder = inject(FormBuilder);
  private recaptchaV3Service = inject(ReCaptchaV3Service);

  public readonly labels = LABELS;
  public readonly messages = MESSAGES;
  public formLogin: FormGroup = this.formBuilder.group({
    email: ['', [Validators.required, Validators.email]],
    password: ['', [Validators.required]],
  });

  constructor() {
    effect(() => { if (this.loginService.userId()) this.router.navigate([`/tickets/${TYPE_VIEW_LIST_TICKET.myTicket}`]) });
  }
  
  public submitLogin() {
    this.recaptchaV3Service.execute('login').pipe(
      switchMap((captchaToken: string) => {
        const utf8Bytes = new TextEncoder().encode(this.formLogin.value.password)
        const data: LoginRequest = {
          email: this.formLogin.value.email,
          password: btoa(String.fromCharCode(...utf8Bytes)),
          captchaToken
        };
        return this.loginService.login(data);
      })
    ).subscribe({
      next: (res) => {
        this.loginService.setSession(res);
        this.helpersService.messageNotification(Severity.success, LABELS.ok, `¡${res.username} Bienvenido!.`);
      },
      error: (err: FormattedHttpError) => {
        if (err?.code == HttpStatusCode.PaymentRequired) {
          this.loginService.eventOpenModalPaymentRequired.emit(err.errors[0]);
        } else if (!err?.code) {
          // El captcha nunca se generó (script bloqueado, sin red hacia Google, etc.) —
          // la petición nunca llegó al backend, así que no pasó por HttpErrorHandlerService.
          this.helpersService.messageNotification(Severity.error, 'Error', MESSAGES.captchaVerificationFailed);
        }
      }, complete: () => {
        this.loginService.setUser();
      }
    })
  };
  
}
