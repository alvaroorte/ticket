import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FilterPipePipe } from './filter-pipe.pipe';
import { FormatDatePipe, FormatDateWithHourPipe } from './format-date.pipe';

@NgModule({
  declarations: [
    FilterPipePipe,
    FormatDatePipe,
    FormatDateWithHourPipe
  ],
  imports: [
    CommonModule
  ],
  exports: [
    FormatDatePipe,
    FormatDateWithHourPipe
  ]
})
export class PipesModule { }
