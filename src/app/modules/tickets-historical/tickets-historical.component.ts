import { Component } from '@angular/core';
import { TicketsHistoricalModule } from './tickets-historical.module';
import { HelpersService } from 'src/app/core/services/helpers.service';
import { PrimeComponentsModule } from 'src/app/shared/prime-components/prime-components.module';
import { DatePipe } from '@angular/common';

@Component({
  selector: 'app-tickets-historical',
  standalone: true,
  imports: [ TicketsHistoricalModule, PrimeComponentsModule ],
  templateUrl: './tickets-historical.component.html',
  styles: [
  ],
  providers: [ HelpersService, DatePipe ]
})
export class TicketsHistoricalComponent {

}
