import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TicketsTableModule } from './tickets-table.module';

@Component({
  selector: 'app-tickest-table',
  standalone: true,
  imports: [CommonModule, TicketsTableModule],
  templateUrl: './tickets-table.component.html'
})
export class TicketsTableComponent {

}
