import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CardsCategoriesComponent } from './components/cards-categories/cards-categories.component';
import { CardCategoryComponent } from './components/card-category/card-category.component';
import { PrimeComponentsModule } from '@shared/prime-components/prime-components.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { LoginComponent } from '@shared/components/login/login.component';


@NgModule({
  declarations: [
    CardsCategoriesComponent
  ],
  imports: [
    CommonModule,
    CardCategoryComponent, 
    PrimeComponentsModule,
    ReactiveFormsModule,
    FormsModule,
    LoginComponent
  ],
  exports: [
    CardsCategoriesComponent,
    PrimeComponentsModule
  ]
})
export class HomeModule { }
