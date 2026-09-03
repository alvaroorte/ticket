import { HttpBackend, HttpClient } from '@angular/common/http';
import { EventEmitter, Injectable, Output, inject, signal  } from '@angular/core';
import { Observable, catchError, of, throwError } from 'rxjs';
import { LoginRequest, LoginResponse } from '@core/models/Login';
import { environment } from '@core/environments/environment.development';
import { LocalStorageService } from './local-storage.service';
import { LOCAL_STORAGE } from '@core/constants/local-storage';
import { Router } from '@angular/router';
import { LABELS } from '@core/constants/labels';
import { EnterpriseService } from '@enterprise/services/enterprises.service';
import { AuthenticatedUser } from '@core/interfaces/authenticated-user';
import { UserService } from 'src/app/modules/user/services/user.service';
import { Enterprise } from '@core/models/Enterprise';
import { ROLES_CODE_SYSTEM } from '@core/enums/roles';

@Injectable({
  providedIn: 'root'
})
export class LoginService {

  @Output() eventDataUserChanged: EventEmitter<void> = new EventEmitter();
  @Output() eventOpenModalPaymentRequired: EventEmitter<string> = new EventEmitter<string>();
  
  private http = inject(HttpClient);
  private httpWithoutInterceptors = new HttpClient(inject(HttpBackend));
  private router =  inject(Router);
  private localStorageService = inject(LocalStorageService);
  private enterpriseService = inject(EnterpriseService);
  private userService = inject(UserService);

  public user = signal<string>(LABELS.getInto);
  public userEmail = signal<string>("");
  public enterpriseUserLogued = signal<Enterprise>(null);
  public userId = signal<number>(null);
  public rolesUser = signal<ROLES_CODE_SYSTEM[]>([]);
  private serverUrl: string = environment.server_url;
  

  public login( user: LoginRequest ) {
    return this.http.post<LoginResponse>(this.serverUrl + 'login', user);
  }

  public refreshToken(): Observable<LoginResponse> {
    const refreshToken = this.localStorageService.get(LOCAL_STORAGE.REFRESH_TOKEN);
    if (refreshToken) {
      return this.httpWithoutInterceptors.post<LoginResponse>(this.serverUrl + 'auth/refresh', { refreshToken });
    }
    return throwError(() => new Error('No hay refresh token almacenado'));
  }

  public setSession(response: LoginResponse) {
    this.localStorageService.set(LOCAL_STORAGE.TOKEN, response.token);
    this.localStorageService.set(LOCAL_STORAGE.REFRESH_TOKEN, response.refreshToken);
  }

  public setUser() {
    const token = this.localStorageService.get(LOCAL_STORAGE.TOKEN);
    if (token) {
      try {
        const authenticatedUser: AuthenticatedUser = JSON.parse(atob(token.split('.')[1]));
        this.userId.set(authenticatedUser.userId);
        this.rolesUser.set(authenticatedUser.authorities?? []);
        this.user.update( () => authenticatedUser.sub );
        this.userEmail.update( () => authenticatedUser.userEmail );
        this.getRolesUserLogued();
      } catch (error) {
        this.logout();
      }
    } else {
      this.user.update( () => LABELS.getInto );
      this.userEmail.update( () => "" );
      this.userId.set(null);
      this.rolesUser.set([]);
      this.enterpriseUserLogued.set(null);
      this.eventDataUserChanged.emit();
    }
  }

  public logout() {
    this.revokeRefreshToken();
    const theme: string = this.localStorageService.get(LOCAL_STORAGE.THEME);
    this.localStorageService.removeAll();
    this.localStorageService.set(LOCAL_STORAGE.THEME, theme);
    this.setUser();
    this.router.navigate(['/']);
  }

  private revokeRefreshToken() {
    const refreshToken = this.localStorageService.get(LOCAL_STORAGE.REFRESH_TOKEN);
    if (refreshToken) {
      this.httpWithoutInterceptors.post<void>(this.serverUrl + 'auth/logout', { refreshToken })
        .pipe(catchError(() => of(null)))
        .subscribe();
    }
  }

  public getRolesUserLogued() {
    this.userService.getRolesByUser(this.userId()).subscribe({
      next: (resp) => {
        this.rolesUser.set(resp.map( role => role.code ));
      }, complete: () => {
        this.setEnterpriseIdUser();
      }
    })
  }
  
  private setEnterpriseIdUser() {
    this.enterpriseService.getMe().subscribe({
      next: (res) => {
        this.enterpriseUserLogued.set(res);
        this.eventDataUserChanged.emit(); 
      }
    })
  }

  public haveSomeRole(roles: ROLES_CODE_SYSTEM[]): boolean {
    for (let i = 0; i < roles.length; i++) {
      if (this.rolesUser().includes(roles[i])) {
        return true;
      }
    }
    return false;
  }

}
