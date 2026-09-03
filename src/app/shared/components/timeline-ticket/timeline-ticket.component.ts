import { Component, ElementRef, OnChanges, SimpleChanges, input, viewChild, output } from '@angular/core';
import { environment } from '@core/environments/environment.development';
import { Timeline } from '@core/models/Timeline';
import { PrimeModules } from '@shared/prime-components/prime-components.module';
import { PipesModule } from '@core/pipes/pipes.module';

@Component({
    selector: 'app-timeline-ticket',
    imports: [PrimeModules, PipesModule],
    templateUrl: './timeline-ticket.component.html'
})
export class TimelineTicketComponent implements OnChanges {

    readonly ticketId = input.required<number>();
    readonly timelineList = input<Timeline[]>([]);
    readonly eventReloadTimeline = output();
    readonly modalEnd = viewChild<ElementRef>('modalEnd');
    readonly divComment = viewChild<ElementRef>('divComment');

    public readonly serverUrl: string = environment.server_url;

    ngOnChanges(changes: SimpleChanges): void {
        if (changes['timelineList']) {
            this.scrollToBottom();
        } 
    }

    public reloadTimeline () {
        this.eventReloadTimeline.emit();
    }

    private scrollToBottom() {
        setTimeout(() => {
          this.modalEnd().nativeElement.scrollIntoView({ behavior: 'smooth' });
        }, 100);
    }
}
