import { NgClass } from '@angular/common';
import { Component, inject, input, output } from '@angular/core';
import { INextFunction } from '@core/interfaces/ticket.interface';
import { TicketResponse } from '@core/models/Ticket';
import { PipesModule } from '@core/pipes/pipes.module';
import { TicketService } from '@ticket-historical/services/tickets.service';
import { TooltipModule } from 'primeng/tooltip';
import { buttonsTicketsComponent } from '../buttons-tickets/buttons-tickets.component';
import { nameFunction } from '@core/interfaces/buttons-ticket.interface';
import { ButtonModule } from 'primeng/button';
import { RippleModule } from 'primeng/ripple';
import { TOOLTIPS } from '@core/constants/tooltips';
import { LABELS } from '@core/constants/labels';
import { MESSAGES } from '@core/constants/messages';
import { STATES_TICKET_ENUM, TypeTicketEnum } from '@core/enums/ticket';
import { MenuItem } from 'primeng/api';
import { MenuModule } from 'primeng/menu';
import { HelpersService } from '@core/services/helpers.service';
import { Severity } from '@core/enums/severity';

@Component({
    selector: 'app-cards',
    imports: [TooltipModule, PipesModule, buttonsTicketsComponent, ButtonModule, RippleModule, MenuModule, NgClass],
    templateUrl: './cards.component.html'
})
export class CardsComponent {

    readonly tickets = input.required<TicketResponse[]>();
    readonly isViewPending = input<boolean>(false);
    readonly showMessageEmpty = input<boolean>(true);
    readonly onPlayNextFunctionTicket = output<INextFunction>();
    readonly eventReloadTicketsCard = output<void>();

    private ticketService = inject(TicketService);
    private helpersService = inject(HelpersService);

    public readonly tooltips = TOOLTIPS;
    public readonly labels = LABELS;
    public readonly messages = MESSAGES;
    public readonly STATES_TICKET_ENUM = STATES_TICKET_ENUM;
    public readonly TypeTicketEnum = TypeTicketEnum;
    public readonly statesForShowTag: STATES_TICKET_ENUM[] = [STATES_TICKET_ENUM.TECH_ASSIGNED, STATES_TICKET_ENUM.STARTED, STATES_TICKET_ENUM.PAUSED];
    public optionsUser: MenuItem[] = [];

    public openModalInfo ( ticketId: number ) {
        this.ticketService.eventOpenInfoTicket.emit(ticketId);
    }

    public playNextFunctionTicket(ticketId: number, nameFunction: nameFunction, ticketCode: string) {
        const data: INextFunction = {
            ticketId,
            function: nameFunction,
            ticketCode
        };
        this.onPlayNextFunctionTicket.emit(data);
    }

    public getTagsOfTicket(ticketId: number) {
        this.ticketService.getAvailableTagsByTicketId(ticketId).subscribe({
            next: (res) => {
                this.optionsUser = res.map( tag => {
                    return {
                        label: tag.value,
                        command: () => {
                            this.setTagToTicket(ticketId, tag.id);
                        }
                    }
                })
                if (res.length === 0) {
                    this.optionsUser = [{
                        label: MESSAGES.noTagsAreAvailabelsForThisCategory
                    }];
                }
            },
        });
    }

    private setTagToTicket(ticketId: number, parameterId: number) {
        this.ticketService.setTagToTicket(ticketId, parameterId).subscribe({
            next: () => {
                this.eventReloadTicketsCard.emit();
                this.helpersService.messageNotification(Severity.success, LABELS.ok, MESSAGES.labelSuccessfullyUpdated);
            }
        })
    }

}
