import { Component, inject, OnInit } from '@angular/core';

import { PrimeModules } from '@shared/prime-components/prime-components.module';
import { FormsModule } from '@angular/forms';
import { LABELS } from '@core/constants/labels';
import { LoginService } from '@core/services/login.service';

@Component({
    selector: 'app-modal-payment-required',
    imports: [FormsModule, PrimeModules],
    templateUrl: './modal-payment-required.component.html',
    styleUrls: ['modal-payment-required.component.scss']
})
export class ModalPaymentRequiredComponent implements OnInit {

    private loginService = inject(LoginService);

    public readonly labels = LABELS;
    public openModal: boolean = false;
    public message: string = '';

    ngOnInit(): void {
        this.loginService.eventOpenModalPaymentRequired.subscribe((message: string) => {
            this.message = message;
            this.openModal = true;
        })
    }

}
