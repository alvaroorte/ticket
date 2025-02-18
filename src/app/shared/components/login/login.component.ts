import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { HelpersService } from '@core/services/helpers.service';
import { LocalStorageService } from '@core/services/local-storage.service';
import { LoginService } from '@core/services/login.service';
import { LoginRequest, LoginResponse } from '@core/models/Login';
import { PrimeComponentsModule } from '@shared/prime-components/prime-components.module';
import { Router } from '@angular/router';
import { CredencialService } from '@core/services/credencial';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, PrimeComponentsModule, ReactiveFormsModule],
  templateUrl: './login.component.html'
})
export class LoginComponent implements OnInit {

    private formBuilder = inject(FormBuilder);
    private helpersService = inject(HelpersService);
    private localStorageService = inject(LocalStorageService);
    private loginService = inject(LoginService);
    private credencialService = inject(CredencialService);
    private router =  inject(Router);
    
    openModal: boolean = false;

    ngOnInit(): void {
        this.getRolUser();
        this.loginService.eventOpenFormLogin.subscribe( () =>  {
            this.openLogin();
        });
        
        this.loginService.eventLogout.subscribe( () =>  {
            this.logout();
        });
    }

    public formLogin: FormGroup = this.formBuilder.group({
        email: ['', [Validators.required, Validators.email]],
        password: ['', [Validators.required]],
    });

    hideModal() {
        this.openModal = false;
    };

    openLogin(){
        this.reset();
        this.openModal = true;
    };
    
    reset(): void {
        this.formLogin.reset();
    };

    submitLogin() {
        const data: LoginRequest = {
        ...this.formLogin.value,
        };
        this.loginService.login(data).subscribe({
            next: (res) => { 
                this.setDataLocalStorage(res);
                this.helpersService.messageNotification("success", "Correcto", `¡${res.username} Bienvenido!.`, 3000);
                this.hideModal();
                this.reset();
            },
            error: (err) => { 
                console.log(err);
                this.helpersService.messageNotification("error", err.eroor, err.message, 3000);
            }
        })
    };

    setDataLocalStorage(data: LoginResponse) {
        this.localStorageService.set('token', data.token);
        this.localStorageService.set('username', data.username);
        this.getRolUser(true);
    }

    private getRolUser(redirectHome: boolean = false) {
        this.credencialService.credentialRoluser().subscribe({
            next: (res) => {
                this.localStorageService.set('role', res.leader && res.leader > 0? 'leader': res.supervisor && res.supervisor > 0? 'supervisor': res.technical && res.technical > 0? 'technical': 'all');
                this.loginService.eventSetOptionHeader.emit();
                this.loginService.eventChangeUser.emit();
                redirectHome? this.router.navigate(['/home']): '';
            },
            error: (err) => { 
                console.log(err);
                this.helpersService.messageNotification("error", err.eroor, err.message, 3000);
            }
        })
    }

    logout() {
        this.localStorageService.removeAll();
        this.router.navigate(['/']);
        this.loginService.eventSetOptionHeader.emit();
        this.loginService.eventChangeUser.emit();
    }
}
