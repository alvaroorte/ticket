import { NgModule } from '@angular/core';
import { PrimeModules } from '@shared/prime-components/prime-components.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { PipesModule } from '@core/pipes/pipes.module';


@NgModule({
    exports: [
        PipesModule,
        PrimeModules,
        ReactiveFormsModule,
        FormsModule
    ]
})
export class CountryModule { }
