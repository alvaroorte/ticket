import { Component, signal } from '@angular/core';
import { PrimeModules } from '../../prime-components/prime-components.module';
import { APP_STORE_TICKET_MOBILE_URL, PLAY_STORE_TICKET_MOBILE_URL } from '@core/constants/external-links';

@Component({
    selector: 'app-mobile-app-required',
    imports: [PrimeModules],
    templateUrl: './mobile-app-required.component.html',
    styleUrl: './mobile-app-required.component.scss'
})
export class MobileAppRequiredComponent {
    public readonly playStoreUrl = PLAY_STORE_TICKET_MOBILE_URL;
    public readonly appStoreUrl = APP_STORE_TICKET_MOBILE_URL;
    public readonly openModal = signal<boolean>(true);
}
