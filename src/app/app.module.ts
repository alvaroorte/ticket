import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { HTTP_INTERCEPTORS, HttpClientModule } from "@angular/common/http";
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { PrimeComponentsModule } from './shared/prime-components/prime-components.module';
import { MessageService, SharedModule } from 'primeng/api';
import { EnterprisesModule } from './modules/enterprises/enterprises.module';
import { HeaderComponent } from './core/layout/header/header.component';
import { FooterComponent } from './core/layout/footer/footer.component';
import { LoginComponent } from '@shared/components/login/login.component';
import { HeaderInterceptor } from '@core/interceptors/header.interceptor';
import { LoaderComponent } from './shared/components/loader/loader.component';
import { LoaderInterceptor } from '@core/interceptors/loader.interceptor';
import { DatePipe } from '@angular/common';




@NgModule({
    declarations: [
        AppComponent
    ],
    imports: [
        BrowserModule,
        PrimeComponentsModule,
        BrowserAnimationsModule,
        HttpClientModule,
        SharedModule,
        HeaderComponent,
        FooterComponent,
        EnterprisesModule,
        LoginComponent,
        AppRoutingModule,
        LoaderComponent,
        DatePipe
    ],
    
    providers: [
        DatePipe,
        MessageService,
        {
            provide: HTTP_INTERCEPTORS,
            useClass: HeaderInterceptor,
            multi: true
        },
        {
            provide: HTTP_INTERCEPTORS,
            useClass: LoaderInterceptor,
            multi: true,
          }
    ],
    bootstrap: [AppComponent]
})
export class AppModule { }
