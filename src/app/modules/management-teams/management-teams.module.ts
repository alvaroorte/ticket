import { NgModule} from '@angular/core';
import { CommonModule } from '@angular/common';
import { CardComponent } from './components/card/card.component';
import { PrimeComponentsModule } from '@shared/prime-components/prime-components.module';
import { PipesModule } from '@core/pipes/pipes.module';
import { FormsModule } from '@angular/forms';



@NgModule({
  declarations: [
    CardComponent,
  ],
  imports: [
    CommonModule,
    PrimeComponentsModule,
    PipesModule
  ],
  exports: [
    CardComponent,
    PrimeComponentsModule,
    FormsModule
  ]
})
export class ManagementTeamsModule { }
