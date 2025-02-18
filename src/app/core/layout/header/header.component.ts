import { Component, Inject, OnInit, ViewChild, inject, signal } from '@angular/core';
import { RouterModule } from '@angular/router';
import { CommonModule, DOCUMENT } from '@angular/common';
import { PrimeComponentsModule } from 'src/app/shared/prime-components/prime-components.module';
import { LocalStorageService } from '@core/services/local-storage.service';
import { LoginService } from '@core/services/login.service';
import { MenuItem } from 'primeng/api';
import { FormsModule } from '@angular/forms';
import { MenuHeader } from '@core/models/Header';
import { urlsWithPermissions } from '@core/constants/constants';
import { CredencialService } from '@core/services/credencial';
import { ModalInfoUserComponent } from '@shared/components/modal-info-user/modal-info-user.component';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss'],
  imports: [CommonModule, RouterModule, PrimeComponentsModule, FormsModule, ModalInfoUserComponent],
  standalone: true,
})
export class HeaderComponent implements OnInit {

    @ViewChild('menu') menuLogout!: any;
    
    private localStorageService = inject(LocalStorageService);
    private loginService = inject(LoginService);
    private credencialService = inject(CredencialService);
    
    public backgroundColorHeader: string = 'rgba(205, 205, 205, 45%)'
    public username = signal('Ingresar');
    public optionsUser: MenuItem[] | undefined;
    public rolUser = signal<string>('all');
    public themeSelection: boolean = false;
    public labelMode = signal('Modo Oscuro');
    public optionsHeader = signal<MenuHeader[]>( urlsWithPermissions )

    ngOnInit(): void {
        document.addEventListener("scroll", (event)=>{
            this.onWindowScroll();
            this.menuLogout.visible == true ? this.menuLogout.hide() : '';
        });

        this.loginService.eventChangeUser.subscribe(() => {
            this.getUserLocalStorage();
        });
        
        this.loginService.eventSetOptionHeader.subscribe(() => {
            this.setRolUser();
        });
        
        this.optionsUser = [
            {
                label: 'Cerrar sesión',
                icon: 'pi pi-fw pi-sign-out',
                command: () => {
                    this.logout();
                }
            },
            {
                label: 'Mi información',
                icon: 'pi pi-fw pi-info-circle',
                command: () => {
                    this.openModalInfoUser();
                }
            }
        ];
    }
    
    setRolUser() {
        let role = this.localStorageService.get('role')
        this.rolUser.set(role?? 'all');
    }

    logout() {
        this.loginService.eventLogout.emit();
    }

    getUserLocalStorage() {
        const user = this.localStorageService.get('username');
        this.username.set(user?? 'Ingresar');
    }

    setOpenModalLogin() {
        this.loginService.eventOpenFormLogin.emit();
    }

    constructor( @Inject(DOCUMENT) private document: Document ) {
        let theme = window.localStorage.getItem("theme");
        if (theme) {
            this.themeSelection = ( theme == 'dark' )? true: false;
        }
        this.changeTheme(this.themeSelection);
    }

    public changeTheme( style: boolean ) {
        let theme = ( style )? 'dark': 'light';
        this.labelMode.set(( style )? 'Modo Claro': 'Modo Oscuro');
        window.localStorage.setItem('theme', theme)
        let themeLink = this.document.getElementById('theme-main') as HTMLLinkElement ;
        themeLink.href = 'styles-' + theme + '.css';
    }

    private openModalInfoUser() {
        this.credencialService.eventOpenModalInfoUser.emit();
    }

    public onWindowScroll() {
        const scrollPosition = window.scrollY;
        this.backgroundColorHeader = scrollPosition > 350?  'rgba(255, 255, 255, 80%)': scrollPosition > 80?  'rgba(255, 255, 255, 65%)': 'rgba(205, 205, 205, 45%)';
    }
}

