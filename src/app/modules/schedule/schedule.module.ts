import { NgModule } from '@angular/core';
import { PipesModule } from '@core/pipes/pipes.module';
import { PrimeModules } from '@shared/prime-components/prime-components.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';


@NgModule({
    exports: [
        PipesModule,
        PrimeModules,
        ReactiveFormsModule,
        FormsModule,
    ]
})
export class ScheduleModule { }
