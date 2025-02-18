import { Component, EventEmitter, Input, Output, Signal, inject, signal } from '@angular/core';
import { SimpleResponse } from '@core/models/FieldsCommons';
import { Ticket, TicketFunctionArrays, TicketFunctionSend, TicketResponse, TicketSolutionProjection } from '@core/models/Ticket';
import { HelpersService } from '@core/services/helpers.service';
import { TicketsService } from '@ticket-historical/services/tickets-.service';

@Component({
  selector: 'app-cards',
  templateUrl: './cards.component.html',
  styleUrls: ['./cards.component.scss']
})
export class CardsComponent {

    @Input({required: true}) tickets!: Signal<TicketResponse[]>;
    @Output() reloadTicketsCard = new EventEmitter();

    private ticketsService = inject(TicketsService);
    private helpersService = inject(HelpersService)

    sidebarInfoVisible = signal<boolean>(false);
    selectorTicketFunction = signal(new TicketFunctionArrays);
    nameFunction = signal('');
    namePreFunction = signal('');
    titleModalDescription = signal('');
    solutionTemp!: TicketSolutionProjection;
    idTicket = signal<number>(0);
    titleTicket = signal<string>('');
    sidebarformTicketVisible: boolean = false;
    
    openInfoSidebar ( ticketId: number ) {
        this.idTicket.set(ticketId);
        this.ticketsService.eventOpenInfoTicket.emit();
    }
    
    openTimelineSidebar ( idTicket: number, title: string ) {
        this.idTicket.set(idTicket);
        this.titleTicket.set(title);
        this.ticketsService.eventOpenTimeline.emit();
    }
    
    openModalGantt ( idTicket: number, title: string ) {
        this.idTicket.set(idTicket);
        this.titleTicket.set(title);
        this.ticketsService.eventOpenReportGantt.emit();
    }

    ticketFuncion( idTicket: number, typeTicket: string, nameFunction: string, namePreFunction: string ) {
        this.idTicket.set(idTicket);
        if ( typeTicket == 'No definido' && nameFunction != 'Acepta aprobador' && nameFunction != 'Acepta moderador') {
            this.ticketsService.eventOpenModalTypeTicket.emit();
            this.nameFunction.set(nameFunction);
            this.namePreFunction.set(namePreFunction);
        } else {
            let ticketFunctionSend: TicketFunctionSend = new TicketFunctionSend;
            ticketFunctionSend.function = ( namePreFunction )? namePreFunction: nameFunction;
            this.ticketsService.ticketFunction( this.idTicket(), ticketFunctionSend ).subscribe({
                next: (res: SimpleResponse) => { 
                    ( res.title )? this.modalDescription( nameFunction, this.idTicket(), res): this.helpersService.messageNotification("success", "Correcto", res.message!, 3000);
                    this.emitReloadTicketsCard();
                },
                error: (err) => { 
                    console.log(err);
                    this.helpersService.messageNotification("error", 'Error', err.message, 3000);
                }
            })
        }
    }

    emitReloadTicketsCard() {
        this.reloadTicketsCard.emit();
    }

    modalDescription ( nameFunction:string, idTicket:number, data: SimpleResponse ) {
        this.selectorTicketFunction.set(this.helpersService.getArraysByTicketFunction(data.selector));  
        this.nameFunction.set(nameFunction);
        this.titleModalDescription.set(data.title);
        this.solutionTemp = data.solutionTemp;
        this.idTicket.set(idTicket);
        this.ticketsService.eventOpenModalDescription.emit();
    }

    stringToObject(text: string | null) {
        return JSON.parse(text as string);
    }

    saveTypeTicket(ticket: Ticket) {
        this.ticketFuncion(ticket.id!, ticket.typeTicket!, this.nameFunction(), this.namePreFunction());
    }
}
