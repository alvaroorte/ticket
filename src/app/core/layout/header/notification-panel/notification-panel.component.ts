import { Component, inject, output } from '@angular/core';
import { DatePipe, NgClass } from '@angular/common';
import { PrimeModules } from '@shared/prime-components/prime-components.module';
import { MessageWsService } from '@core/services/message.service';
import { NotificationService } from '@core/services/notification.service';
import { INotification } from '@core/interfaces/notification.interface';
import { NotificationType } from '@core/enums/notification-type.enum';
import { InfoOpenModalCommon } from '@core/interfaces/ticket.interface';
import { TicketService } from '@ticket-historical/services/tickets.service';
import { LABELS } from '@core/constants/labels';
import { Router } from '@angular/router';

@Component({
  selector: 'app-notification-panel',
  imports: [DatePipe, NgClass, PrimeModules],
  templateUrl: './notification-panel.component.html'
})
export class NotificationPanelComponent {

  readonly tryHidePopover = output<void>();

  public messageWsService    = inject(MessageWsService);
  private notificationService = inject(NotificationService);
  private ticketService = inject(TicketService);
  private router =  inject(Router);

  public readonly labels = LABELS;
  public readonly notificationType = NotificationType;

  public onClickNotification(notification: INotification) {
    switch (notification.type) {
      case NotificationType.TICKET_MESSAGE:
        this.tryHidePopover.emit();
        this.openModalMessages(notification.ticketId, notification.ticketCode);
        break;
      case NotificationType.SOLVED_TICKET:
        this.markAsRead(notification.id);
        this.router.navigate(['/tickets/my-ticket'], {queryParams : { 'showCodeTicket': notification.ticketId }});
        this.tryHidePopover.emit();
        break;
      case NotificationType.LDAP_INACTIVE_TECHNICIA:
        this.markAsRead(notification.id);
        break;
      case NotificationType.ASSIGNED_TICKET:
        this.markAsRead(notification.id);
        this.router.navigate(['/tickets/pending'], {queryParams : { 'showCodeTicket': notification.ticketId }});
        this.tryHidePopover.emit();
        break;
      case NotificationType.APPROVED_TICKET:
        this.markAsRead(notification.id);
        this.router.navigate(['/tickets/approver-moderator'], {queryParams : { 'showCodeTicket': notification.ticketId }});
        this.tryHidePopover.emit();
        break;
    }
  }

  public openModalMessages ( ticketId: number, ticketTitle: string ) {
    const data: InfoOpenModalCommon = {
      ticketId,
      ticketTitle
    };
    this.ticketService.eventOpenModalMessages.emit(data);
  }

  private markAsRead(notificationId: number) {
    this.notificationService.markAsRead(notificationId).subscribe(() => {
      this.messageWsService.notificationsWithoutRead.update(list => {
        return list.filter(n => n.id !== notificationId);
      });
    });
  }

  public markAllAsRead() {
    this.notificationService.markAllAsRead().subscribe(() => {
      this.messageWsService.notificationsWithoutRead.set([]);
    });
  }
}
