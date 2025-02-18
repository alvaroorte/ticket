import { HttpClient } from '@angular/common/http';
import { Injectable, Output, EventEmitter, inject  } from '@angular/core';
import { environment } from '@core/environments/environment.development';
import { Observable } from 'rxjs';
import { Permission } from '@core/models/Permission';

@Injectable({
  providedIn: 'root'
})
export class PermissionService {

  @Output() eventFormComponent: EventEmitter<any> = new EventEmitter();
  @Output() eventTableComponent: EventEmitter<any> = new EventEmitter();
  @Output() eventModalDeleteComponent: EventEmitter<any> = new EventEmitter();
  @Output() eventToolbarComponent: EventEmitter<any> = new EventEmitter();
  @Output() eventToolbarCategoryComponent: EventEmitter<any> = new EventEmitter();
  @Output() eventTableDobleComponent: EventEmitter<any> = new EventEmitter();
  @Output() eventDeleteRow: EventEmitter<any> = new EventEmitter();

  private http = inject(HttpClient);

  private serverUrlSecurity: string = environment.server_security_url;

  public getAll() {
    return this.http.get<Permission[]>(this.serverUrlSecurity+'permissions')
  }

  public getById(id: number) {
    return this.http.get<Permission>(this.serverUrlSecurity + 'permissions/' + id)
  }

  public create(permission: Permission) {
    return this.http.post<Permission>(this.serverUrlSecurity + 'permissions', permission)
  }

  public update(id: number, permission: Permission) {
    return this.http.put<Permission>(this.serverUrlSecurity + 'permissions/' + id, permission)
  }

  public delete(id: number): Observable<Object> | Observable<string>  {
    return this.http.delete(this.serverUrlSecurity + 'permissions/' + id, { responseType:'text'})
  }
}
