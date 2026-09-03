import { AfterViewInit, Component, DestroyRef, OnInit, inject, signal, viewChild } from '@angular/core';
import { RouterModule } from '@angular/router';
import { PrimeModules } from 'src/app/shared/prime-components/prime-components.module';
import { LocalStorageService } from '@core/services/local-storage.service';
import { LoginService } from '@core/services/login.service';
import { MenuItem } from 'primeng/api';
import { MenuHeader } from '@core/models/Header';
import { CredencialService } from '@core/services/credencial.service';
import { ModalInfoUserComponent } from '@shared/components/modal-info-user/modal-info-user.component';
import { Menu } from 'primeng/menu';
import { ROLES_CODE_SYSTEM } from '@core/enums/roles';
import { configurationLinks, urlsWithPermissions } from '@core/constants/header-links';
import { LOCAL_STORAGE } from '@core/constants/local-storage';
import { LABELS } from '@core/constants/labels';
import { LoaderService } from '@core/services/loader.service';
import { FormsModule } from '@angular/forms';
import { environment } from '@core/environments/environment.development';
import { DOCUMENT, NgClass } from '@angular/common';
import { MessageWsService } from '@core/services/message.service';
import { NotificationPanelComponent } from './notification-panel/notification-panel.component';
import { TOOLTIPS } from '@core/constants/tooltips';
import { Popover } from 'primeng/popover';
import { ModalMessageTicketComponent } from '@shared/components/modal-messages-ticket/modal-messages-ticket.component';
import { NotificationService } from '@core/services/notification.service';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { fromEvent } from 'rxjs';

@Component({
    selector: 'app-header',
    templateUrl: './header.component.html',
    styleUrls: ['./header.component.scss'],
    imports: [RouterModule, PrimeModules, ModalInfoUserComponent, ModalMessageTicketComponent, NotificationPanelComponent, FormsModule, NgClass]
})
export class HeaderComponent implements OnInit, AfterViewInit {

    readonly menuLogout = viewChild<Menu>('menu');
    readonly menuParameters = viewChild<Menu>('parameters');
    
    private localStorageService = inject(LocalStorageService);
    public loginService = inject(LoginService);
    private credencialService = inject(CredencialService);
    private loaderService = inject(LoaderService);
    public messageWsService = inject(MessageWsService);
    public notificationService = inject(NotificationService);
    public destroyRef = inject(DestroyRef);
    private document = inject(DOCUMENT);
    
    public readonly labels = LABELS;
    public readonly tooltips = TOOLTIPS;
    public readonly labelMode: string = LABELS.modeLight + " / " + LABELS.modeDark;
    public readonly roleAdmin = ROLES_CODE_SYSTEM.ADMIN;
    public readonly roleLeader = ROLES_CODE_SYSTEM.LEADER;
    public themeSelection: boolean = false;
    public backgroundColorHeader: string = 'bg-white-alpha-30';
    public imageLogo: string;
    public optionsHeader = signal<MenuHeader[]>([]);
    public configurationLinks = signal<MenuItem[]>([]);
    private hideLoaderTimeoutId?: ReturnType<typeof setTimeout>;
    public optionsUser: MenuItem[] = [
        {
            label: 'Mi información',
            icon: 'pi pi-fw pi-info-circle',
            command: () => {
                this.openModalInfoUser();
            }
        },
        {
            label: 'Cerrar sesión',
            icon: 'pi pi-fw pi-sign-out',
            command: () => {
                this.logout();
            }
        }
    ];

    constructor() {
        const theme = this.localStorageService.get(LOCAL_STORAGE.THEME);
        this.themeSelection = theme == 'dark'? true: false;
        this.changeTheme(false);
    }

    ngOnInit(): void {
        this.optionsHeader.set(urlsWithPermissions);
        this.loginService.setUser();
        this.loginService.eventDataUserChanged
            .pipe(takeUntilDestroyed(this.destroyRef))
            .subscribe(() => {
            this.setConfigurationLinks();
            this.managementSocketConnection();
        });
        this.messageWsService.eventOnConnect
            .pipe(takeUntilDestroyed(this.destroyRef))
            .subscribe(() => {
            this.messageWsService.handlerNotifications();
            this.getNotificationsUnread();
        })
    }

    ngAfterViewInit(): void {
        this.onWindowScroll();
        fromEvent(this.document, 'scroll')
            .pipe(takeUntilDestroyed(this.destroyRef))
            .subscribe(() => {
                this.onWindowScroll();
            });
    }

    private logout() {
        this.loginService.logout();
    }

    public changeTheme(showLoader: boolean) {
        const element: HTMLHtmlElement = this.document.querySelector('html');
        const theme = this.themeSelection? 'dark': 'light';
        this.themeSelection? element.classList.add('ticket-mode-dark'): element.classList.remove('ticket-mode-dark');
        const themeLink = this.document.getElementById('theme-main') as HTMLLinkElement;
        if (themeLink) {
            this.localStorageService.set(LOCAL_STORAGE.THEME, theme)
            themeLink.href = 'styles-' + theme + '.css';
        }
        this.imageLogo = this.themeSelection? environment.image_logo.dark: environment.image_logo.light;
        if (showLoader) {
            this.loaderService.show();
            clearTimeout(this.hideLoaderTimeoutId);
            this.hideLoaderTimeoutId = setTimeout(() => {
                this.loaderService.hide();
            }, 1000);
        }
        this.onWindowScroll();
    }

    private openModalInfoUser() {
        this.credencialService.eventOpenModalInfoUser.emit();
    }

    public onWindowScroll() {
        this.menuLogout()?.hide();
        this.menuParameters()?.hide();
        const scrollPosition = window.scrollY;
        this.backgroundColorHeader = scrollPosition > 350? 
            this.themeSelection? 
                'bg-black-alpha-50'
                : 'bg-white-alpha-70'
            : scrollPosition > 80? 
                this.themeSelection? 
                    'bg-black-alpha-40'
                    : 'bg-white-alpha-50'
                : this.themeSelection? 
                    'bg-black-alpha-20'
                    : 'bg-white-alpha-30';
    }

    private setConfigurationLinks() {
        const options: MenuItem[] = urlsWithPermissions.reduce((result, link) => {
            const rolesUserInAccessLink = this.loginService.haveSomeRole(link.access);
            if ( configurationLinks.includes(link.routerLink) && rolesUserInAccessLink) result.push(link)
            return result;
        }, []);
        this.configurationLinks.set(options);
    }

    private managementSocketConnection() {
        if (this.loginService.userId()) {
            this.messageWsService.connect();
        } else {
            this.messageWsService.disconnect();
        }
    }

    private getNotificationsUnread() {
        this.notificationService.getAllUnread().subscribe((res) => {
            this.messageWsService.notificationsWithoutRead.set(res);
        })
    }

    public hideNotificationsPopover(popoverNotifications: Popover) {
        popoverNotifications.hide();
    }

}

