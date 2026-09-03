import { EventEmitter, inject, Injectable, Output, signal } from '@angular/core';
import { environment } from '@core/environments/environment.development';
import { ITicketUnread } from '@core/models/Ticket';
import { Client, IMessage, StompSubscription } from '@stomp/stompjs'
import SockJS from 'sockjs-client';
import { LoginService } from './login.service';
import { INotification } from '@core/interfaces/notification.interface';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class MessageWsService {

  @Output() eventOnConnect: EventEmitter<void> = new EventEmitter();
  @Output() eventNewMessageInmodal: EventEmitter<void> = new EventEmitter();
  @Output() eventChangedTicketStatus: EventEmitter<void> = new EventEmitter();

  private loginService = inject(LoginService);
  private http = inject(HttpClient);
  
  private serverUrlMessages: string = `${environment.server_url}message`;
  private serverUrlWsTickets: string = `${environment.server_url}ws-tickets`;
  private stompClient: Client;
  private subscriptionUnreadByUserEmail: StompSubscription;
  private subscriptionTicketChanged: StompSubscription;
  private subscriptionNewMessageInModal: StompSubscription;
  public ticketsUnread = signal<ITicketUnread[]>([]);
  public notificationsWithoutRead = signal<INotification[]>([]);
  public stompClientConnect = signal<boolean>(false);

  constructor() {
    this.initConnectionSocket();
  }

  private initConnectionSocket() {
    this.stompClient = new Client({
      webSocketFactory: () => new SockJS(this.serverUrlWsTickets),
      reconnectDelay: 3000
    });

    this.stompClient.onConnect = () => {
      console.log('Conectado al WebSocket');
      this.stompClientConnect.set(true)
      this.eventOnConnect.emit();
    };

    this.stompClient.onStompError = (frame) => {
      console.error('Error STOMP:', frame.headers['message']);
      console.error('Detalles:', frame.body);
    }
  }

  public handlerMessagesUnreadByUserEmail() {
    this.subscriptionUnreadByUserEmail = this.stompClient.subscribe(`/topic/user/${this.loginService.userEmail()}/tickets`, (messages: IMessage) => {
      const ticketsUnread: ITicketUnread[] = JSON.parse(messages.body);
      this.ticketsUnread.set(ticketsUnread);
    })
  }
  
  public handlerticketchanged() {
    this.subscriptionTicketChanged = this.stompClient.subscribe(`/topic/user/${this.loginService.userEmail()}/ticketFlow`, () => {
      this.eventChangedTicketStatus.emit();
    })
  }
  
  public handlerNewMessageInModal(ticketId: number) {
    this.subscriptionNewMessageInModal = this.stompClient.subscribe(`/topic/ticket/${ticketId}`, () => {
      this.eventNewMessageInmodal.emit();
    })
  }

  public handlerNotifications() {
    this.stompClient.subscribe(`/topic/user/${this.loginService.userEmail()}/notifications/unread`, (res) => {
      const notifications: INotification[] = JSON.parse(res.body);
      this.notificationsWithoutRead.set(notifications);
      if (notifications.length > 0) this.playNotificationSound();
    });
  }

  public connect() {
    if (!this.stompClient.active) {
      this.stompClient.activate();
    }
  }

  public unsubscriptionTicketChanged() {
    this.subscriptionTicketChanged?.unsubscribe();
  }
  
  public unsubscribeUnreadByUserEmail() {
    this.subscriptionUnreadByUserEmail?.unsubscribe();
  }
  
  public unsubscribeNewMessageInModal() {
    this.subscriptionNewMessageInModal?.unsubscribe();
  }

  public disconnect() {
    if (this.stompClient && this.stompClient.active) {
      this.stompClient.deactivate();
      this.stompClientConnect.set(false)
      this.ticketsUnread.set([]);
    }
  }

  private playNotificationSound() {
    const audio = new Audio();
    audio.src = '/assets/sounds/whatsapp-apple.mp3';
    audio.load();
    audio.play().catch(err => console.error('Error al reproducir sonido:', err));
  }

  public getAndSetMessagesUnreadByTicket() {
    return this.http.get<ITicketUnread[]>(`${this.serverUrlMessages}/unread`).subscribe((res: ITicketUnread[]) => {
      this.ticketsUnread.set(res);
    });
  }
  
}
