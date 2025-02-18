import { Component, inject, Input, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Subscription } from 'rxjs';
import { TicketsService } from '@ticket-historical/services/tickets-.service';
import { HelpersService } from '@core/services/helpers.service';
import { PrimeComponentsModule } from '@shared/prime-components/prime-components.module';
import { PipesModule } from '@core/pipes/pipes.module';
import { Timeline } from '@core/models/Timeline';
import { TimelineTicketComponent } from '../timeline-ticket/timeline-ticket.component';

@Component({
  selector: 'app-modal-timeline-ticket',
  standalone: true,
  imports: [CommonModule, PrimeComponentsModule, PipesModule, TimelineTicketComponent],
  templateUrl: './modal-timeline-ticket.component.html'
})
export class ModalTimelineTicketComponent {

  @Input() idTicket = signal<number>(0);
  @Input() title: string = 'Timeline';

  private ticketService = inject(TicketsService);
  private helpersService = inject(HelpersService);

  private subscription!: Subscription;
  public modalTimelineVisible: boolean = false;
  public timelineList = signal<Timeline[]>([]);

  ngOnInit(): void {
      this.subscription = this.ticketService.eventOpenTimeline.subscribe( () => {
          this.openModalTimeline();
      });
  }

  ngOnDestroy(): void {
      (this.subscription)? this.subscription.unsubscribe(): '';
  }

  private openModalTimeline() {
      this.openTimelineSidebar();
  }

  public openTimelineSidebar () {
    this.ticketService.listComments(this.idTicket()).subscribe({
        next: (res) => {
            this.timelineList.set(res.map( t => {
                return {
                    ...t,
                    idStatus: t.fileName?.includes('docx')? 'text-blue-500': t.fileName?.includes('xlsx')? 'text-green-500' : t.fileName?.includes('pdf')? 'text-red-500': 'text-yellow-500'
                    }
                }
            ));
            this.modalTimelineVisible = true;
        },
        error: (err) => {
            console.log(err);
            this.helpersService.messageNotification("error", 'Error', err.message, 3000);
        }
    });
  }
}
