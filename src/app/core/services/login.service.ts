import { HttpClient } from '@angular/common/http';
import { Injectable, Output, EventEmitter, inject  } from '@angular/core';
import { LoginRequest, LoginResponse } from '@core/models/Login';
import { environment } from '@core/environments/environment.development';

@Injectable({
  providedIn: 'root'
})
export class LoginService {

  @Output() eventChangeUser: EventEmitter<any> = new EventEmitter();
  @Output() eventOpenFormLogin: EventEmitter<any> = new EventEmitter();
  @Output() eventLogout: EventEmitter<any> = new EventEmitter();
  @Output() eventSetOptionHeader: EventEmitter<any> = new EventEmitter();

  private http = inject(HttpClient);

  private serverUrl: string = environment.server_security_url;

  public login( user: LoginRequest ) {
    return this.http.post<LoginResponse>(this.serverUrl + 'login', user);
  }
}
