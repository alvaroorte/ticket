import { NotificationType } from "@core/enums/notification-type.enum";

export interface INotification {
  id: number;
  title: string;
  message: string;
  type: NotificationType;
  read: boolean;
  createdAt: string;
  ticketCode: string;
  ticketId: number;
}
