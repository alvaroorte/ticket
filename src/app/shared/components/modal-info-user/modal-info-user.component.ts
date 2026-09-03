import { Component, DestroyRef, inject, OnInit } from '@angular/core';

import { PrimeModules } from '@shared/prime-components/prime-components.module';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { CredencialService } from '@core/services/credencial.service';
import { HelpersService } from '@core/services/helpers.service';
import { Severity } from '@core/enums/severity';
import { LABELS } from '@core/constants/labels';
import { MESSAGES } from '@core/constants/messages';
import { CredentialComplement } from '@core/models/FieldsCommons';
import { MessageRequiredFieldComponent } from '../message-required-field/message-required-field.component';
import { LIMITS } from '@core/constants/limits';
import { LoginService } from '@core/services/login.service';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

@Component({
    selector: 'app-modal-info-user',
    imports: [PrimeModules, ReactiveFormsModule, MessageRequiredFieldComponent],
    templateUrl: './modal-info-user.component.html'
})
export class ModalInfoUserComponent implements OnInit {
   
   private formBuilder = inject(FormBuilder);
   private credencialService = inject(CredencialService);
   private helpersService = inject(HelpersService);
   public  loginService = inject(LoginService);
   public  destroyRef = inject(DestroyRef);
   
   public readonly labels = LABELS;
   public readonly messages = MESSAGES;
   public openModal: boolean = false;
   public formCredential: FormGroup = this.formBuilder.group({
      phone: [],
      ubication: [, [Validators.required, Validators.minLength(LIMITS.minLengthFive)]],
   });

   ngOnInit() {
      this.credencialService.eventOpenModalInfoUser.pipe(takeUntilDestroyed(this.destroyRef)).subscribe(() => this.openModalInfoUser());
   }

   private openModalInfoUser() {
      this.credencialService.credentialComplement().subscribe({
         next: (credentialComplementResponse) => {
            this.formCredential.patchValue({ ...credentialComplementResponse });
            this.openModal = true;
         }
      });
   }

   public saveData() {
      const body: CredentialComplement = {
         phone: this.formCredential.value.phone.toString(),
         ubication: this.formCredential.value.ubication
      };
      this.credencialService.credentialUpdate(body).subscribe({
         next: () => {
            this.openModal = false;
            this.helpersService.messageNotification(Severity.success, 'Correcto', 'Datos guardados exitosamente.', 3000);
         }
      });
   }
}
