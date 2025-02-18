import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TicketsRoutingModule } from './tickets-routing.module';
import { PrimeComponentsModule } from '@shared/prime-components/prime-components.module';
import { FormsModule } from '@angular/forms';


@NgModule({
  declarations: [],
  imports: [
    CommonModule,
    TicketsRoutingModule,
    PrimeComponentsModule
  ],
  exports: [
    PrimeComponentsModule,
    FormsModule
  ]
})
export class TicketsModule { }
