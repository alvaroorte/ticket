import { Component, inject, OnDestroy, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PrimeComponentsModule } from '@shared/prime-components/prime-components.module';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { CredencialService } from '@core/services/credencial';
import { HelpersService } from '@core/services/helpers.service';
import { Subject, takeUntil } from 'rxjs';
import { Severity } from '@core/enums/severity';

@Component({
   selector: 'app-modal-info-user',
   standalone: true,
   imports: [CommonModule, PrimeComponentsModule, ReactiveFormsModule],
   templateUrl: './modal-info-user.component.html'
})
export class ModalInfoUserComponent implements OnInit, OnDestroy {
   public openModal: boolean = false;

   private destroySubject = new Subject<void>();
   private formBuilder = inject(FormBuilder);
   private credencialService = inject(CredencialService);
   private helpersService = inject(HelpersService);

   public formCredential: FormGroup = this.formBuilder.group({
      phone: [, Validators.required],
      ubication: [, [Validators.required]],
   });

   ngOnInit() {
      this.credencialService.eventOpenModalInfoUser
         .pipe(takeUntil(this.destroySubject))
         .subscribe(() => this.openModalInfoUser());
   }

   ngOnDestroy() {
      this.destroySubject.next();
      this.destroySubject.complete();
   }

   private openModalInfoUser() {
      this.credencialService
         .credentialComplement()
         .pipe(takeUntil(this.destroySubject))
         .subscribe({
            next: (credentialComplementResponse) => {
               this.formCredential.patchValue({ ...credentialComplementResponse });
            },
            error: (err) => {
               console.log(err);
               this.helpersService.messageNotification(Severity.error, 'Error', err.message, 3000);
            }
         });
      this.openModal = true;
   }

   public saveData() {
      this.credencialService
         .credentialUpdate(this.formCredential.value)
         .pipe(takeUntil(this.destroySubject))
         .subscribe({
            next: () => {
               this.openModal = false;
               this.helpersService.messageNotification(Severity.success, 'Correcto', 'Datos guardados exitosamente.', 3000);
            },
            error: (err) => {
               console.log(err);
               this.helpersService.messageNotification(Severity.error, 'Error', err.message, 3000);
            }
         });
   }
}
