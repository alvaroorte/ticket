import { CommonModule } from '@angular/common';
import { Component, ElementRef, EventEmitter, inject, Input, OnChanges, Output, signal, SimpleChanges, ViewChild } from '@angular/core';
import { environment } from '@core/environments/environment.development';
import { Timeline } from '@core/models/Timeline';
import { PrimeComponentsModule } from '@shared/prime-components/prime-components.module';
import { TicketFlowComponent } from '@shared/components/ticket-flow/ticket-flow.component';
import { PipesModule } from '@core/pipes/pipes.module';
import { FormatImagesService } from '@core/services/format-images';

@Component({
  selector: 'app-timeline-ticket',
  standalone: true,
  imports: [ CommonModule, PrimeComponentsModule, TicketFlowComponent, PipesModule ],
  templateUrl: './timeline-ticket.component.html',
  providers: [FormatImagesService]
})
export class TimelineTicketComponent implements OnChanges {

    @Input() idTicket = signal<number>(0);
    @Input() timelineList: Timeline[] = [];
    @Output() eventReloadTimeline = new EventEmitter();
    @ViewChild('cardsmessages') cardsmessages!: ElementRef;

    public serverUrl: string = environment.server_url;

    private formatImagesService = inject(FormatImagesService);

    ngOnChanges(changes: SimpleChanges): void {
        changes['timelineList']?
            setTimeout(() => {
                this.formatImages(this.cardsmessages)
            }, 300)
            : ''
    }

    public reloadTimeline () {
        this.eventReloadTimeline.emit();
    }

    public formatImages(cardsmessages: ElementRef) {
        const sectionCardsMessage = cardsmessages.nativeElement;
        const images: HTMLElement[] = sectionCardsMessage.querySelectorAll('img');
        this.formatImagesService.widthImgaesInsideCOntainer(images);
    }
}
