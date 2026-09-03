import { inject, Injectable, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '@core/environments/environment.development';
import { INotification } from '@core/interfaces/notification.interface';

@Injectable({ providedIn: 'root' })
export class NotificationService {

  private http = inject(HttpClient);
  private serverUrlNotifications = `${environment.server_url}notifications`;

  getAll() {
    return this.http.get<INotification[]>(this.serverUrlNotifications);
  }

  public getAllUnread() {
    return this.http.get<INotification[]>(`${this.serverUrlNotifications}/unread`);
  }

  public markAsRead(id: number) {
    return this.http.patch<void>(`${this.serverUrlNotifications}/${id}/read`, {});
  }

  public markAllAsRead() {
    return this.http.patch<void>(`${this.serverUrlNotifications}/read-all`, {});
  }
}
