import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { TicketsHistoricalComponent } from './tickets-historical.component';

const routes: Routes = [
  {
    path: '',
    component: TicketsHistoricalComponent
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class TicketsHistoricalRoutingModule { }
