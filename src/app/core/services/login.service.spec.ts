import { TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { Router } from '@angular/router';
import { of } from 'rxjs';
import { LoginService } from './login.service';
import { LocalStorageService } from './local-storage.service';
import { LOCAL_STORAGE } from '@core/constants/local-storage';
import { LoginResponse } from '@core/models/Login';
import { EnterpriseService } from '@enterprise/services/enterprises.service';
import { UserService } from 'src/app/modules/user/services/user.service';
import { environment } from '@core/environments/environment.development';

class LocalStorageStub {
  private store = new Map<string, string>();
  public get(key: string): string { return this.store.has(key) ? this.store.get(key) : null; }
  public set(key: string, value: string): void { this.store.set(key, value); }
  public remove(key: string): void { this.store.delete(key); }
  public removeAll(): void { this.store.clear(); }
}

describe('LoginService - renovación de token', () => {

  const REFRESH_URL = `${environment.server_url}auth/refresh`;
  const LOGOUT_URL = `${environment.server_url}auth/logout`;
  const renewedSession: LoginResponse = {
    token: 'jwt-nuevo', refreshToken: 'refresh-2', username: 'juan', message: 'Token renovado'
  };

  let service: LoginService;
  let httpMock: HttpTestingController;
  let storage: LocalStorageStub;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        provideHttpClient(),
        provideHttpClientTesting(),
        { provide: LocalStorageService, useClass: LocalStorageStub },
        { provide: Router, useValue: { navigate: () => Promise.resolve(true) } },
        { provide: EnterpriseService, useValue: { getMe: () => of(null) } },
        { provide: UserService, useValue: { getRolesByUser: () => of([]) } }
      ]
    });

    service = TestBed.inject(LoginService);
    httpMock = TestBed.inject(HttpTestingController);
    storage = TestBed.inject(LocalStorageService) as unknown as LocalStorageStub;
  });

  afterEach(() => httpMock.verify());

  it('envía el refresh token almacenado y devuelve el par rotado del backend', () => {
    storage.set(LOCAL_STORAGE.TOKEN, 'jwt-viejo');
    storage.set(LOCAL_STORAGE.REFRESH_TOKEN, 'refresh-1');
    let result: LoginResponse = null;

    service.refreshToken().subscribe((response: LoginResponse) => result = response);

    const request = httpMock.expectOne(REFRESH_URL);
    expect(request.request.method).toBe('POST');
    expect(request.request.body).toEqual({ refreshToken: 'refresh-1' });
    request.flush(renewedSession);

    expect(result).toEqual(renewedSession);
  });

  it('setSession persiste el par de tokens', () => {
    service.setSession(renewedSession);

    expect(storage.get(LOCAL_STORAGE.TOKEN)).toBe('jwt-nuevo');
    expect(storage.get(LOCAL_STORAGE.REFRESH_TOKEN)).toBe('refresh-2');
  });

  it('la petición de renovación no lleva header Authorization porque omite los interceptores', () => {
    storage.set(LOCAL_STORAGE.REFRESH_TOKEN, 'refresh-1');

    service.refreshToken().subscribe();

    const request = httpMock.expectOne(REFRESH_URL);
    expect(request.request.headers.has('Authorization')).toBeFalse();
    request.flush(renewedSession);
  });

  it('falla sin llamar al backend si no hay refresh token almacenado', () => {
    let error: Error = null;

    service.refreshToken().subscribe({ error: (err) => error = err });

    expect(error).toBeTruthy();
    httpMock.expectNone(REFRESH_URL);
  });

  it('revoca el refresh token en el servidor al cerrar sesión y conserva el tema', () => {
    storage.set(LOCAL_STORAGE.TOKEN, 'jwt-viejo');
    storage.set(LOCAL_STORAGE.REFRESH_TOKEN, 'refresh-1');
    storage.set(LOCAL_STORAGE.THEME, 'dark');

    service.logout();

    const request = httpMock.expectOne(LOGOUT_URL);
    expect(request.request.body).toEqual({ refreshToken: 'refresh-1' });
    request.flush(null);

    expect(storage.get(LOCAL_STORAGE.TOKEN)).toBeNull();
    expect(storage.get(LOCAL_STORAGE.REFRESH_TOKEN)).toBeNull();
    expect(storage.get(LOCAL_STORAGE.THEME)).toBe('dark');
  });

  it('cierra la sesión localmente aunque falle la revocación en el servidor', () => {
    storage.set(LOCAL_STORAGE.TOKEN, 'jwt-viejo');
    storage.set(LOCAL_STORAGE.REFRESH_TOKEN, 'refresh-1');

    service.logout();
    httpMock.expectOne(LOGOUT_URL).flush({}, { status: 500, statusText: 'Server Error' });

    expect(storage.get(LOCAL_STORAGE.TOKEN)).toBeNull();
    expect(storage.get(LOCAL_STORAGE.REFRESH_TOKEN)).toBeNull();
  });

  it('no llama a auth/logout si no hay refresh token', () => {
    service.logout();

    httpMock.expectNone(LOGOUT_URL);
    expect(httpMock.match(() => true).length).toBe(0);
  });
});
