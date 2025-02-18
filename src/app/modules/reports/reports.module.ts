import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PanelFiltersComponent } from './components/panel-filters/panel-filters.component';
import { PrimeComponentsModule } from '@shared/prime-components/prime-components.module';
import { ReactiveFormsModule } from '@angular/forms';
import { GraphicsComponent } from './components/graphics/graphics.component';
import { HighchartsChartModule } from 'highcharts-angular';
import { FormatDatePipe } from '@core/pipes/format-date.pipe';



@NgModule({
  declarations: [
    PanelFiltersComponent,
    GraphicsComponent
  ],
  imports: [
    CommonModule,
    PrimeComponentsModule,
    ReactiveFormsModule,
    HighchartsChartModule
  ],
  exports: [
    PanelFiltersComponent,
    GraphicsComponent,
    PrimeComponentsModule
  ]
})
export class ReportsModule { }
