import { Component, input, output } from '@angular/core';
import { LABELS } from '@core/constants/labels';
import { TOOLTIPS } from '@core/constants/tooltips';
import { STATES_TICKET_ENUM, TypeTicketEnum } from '@core/enums/ticket';
import { TicketByTeam } from '@core/interfaces/ticket.interface';
import { NgClass } from '@angular/common';
import { Tooltip } from 'primeng/tooltip';
import { FormatDateWithHourPipe } from '../../../../core/pipes/format-date.pipe';

@Component({
    selector: 'app-card',
    templateUrl: './card.component.html',
    imports: [NgClass, Tooltip, FormatDateWithHourPipe]
})
export class CardComponent {

  readonly ticket = input.required<TicketByTeam>();
  readonly eventOpenModalTimeline = output();
  readonly eventOpenModalMessages = output();
  readonly eventOpenModalInfo = output();
  readonly eventOpenModalPriority = output();

  public readonly tooltips = TOOLTIPS;
  public readonly labels = LABELS;
  public readonly typeTicketEnum = TypeTicketEnum;
  public readonly statusForShowPriority: STATES_TICKET_ENUM[] = [STATES_TICKET_ENUM.TECH_ASSIGNED, STATES_TICKET_ENUM.TECH_REASSIGNMENT, STATES_TICKET_ENUM.TECH_PENDING, STATES_TICKET_ENUM.APPROVER_WAITING, STATES_TICKET_ENUM.MODERATOR_WAITING];

  public openModalTimeline() {
    this.eventOpenModalTimeline.emit();
  }
  
  public openModalMessages() {
    this.eventOpenModalMessages.emit();
  }

  public openModalInfo() {
    this.eventOpenModalInfo.emit();
  }
  
  public openModalPriority() {
    this.eventOpenModalPriority.emit();
  }

}
