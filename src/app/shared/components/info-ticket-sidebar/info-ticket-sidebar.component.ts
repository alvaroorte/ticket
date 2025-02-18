import { Component, ElementRef, Input, OnInit, Renderer2, ViewChild, inject, signal } from '@angular/core';
import { DataOpenFormTicket, Observator, ObservatorResponse, TicketById, TicketByIdResponse, TicketSolutionProjection } from '@core/models/Ticket';
import { HelpersService } from '@core/services/helpers.service';
import { TicketsService } from '@ticket-historical/services/tickets-.service';
import { environment } from '@core/environments/environment.development';
import { PipesModule } from '@core/pipes/pipes.module';
import { CommonModule, DatePipe } from '@angular/common';
import { Subscription } from 'rxjs';
import { PrimeComponentsModule } from '@shared/prime-components/prime-components.module';
import { LocalStorageService } from '@core/services/local-storage.service';
import { SelectGenericUsersComponent } from '../select-generic-users/select-generic-users.component';
import { DataCommon } from '@core/models/FieldsCommons';
import { GraphGanttService } from '@core/services/graph-gantt.service';
import { FollowService } from '../ticket-flow/service/follow.service';
import { FormatImagesService } from '@core/services/format-images';
import { TimelineTicketComponent } from '../timeline-ticket/timeline-ticket.component';
import { Timeline } from '@core/models/Timeline';

@Component({
  selector: 'app-info-ticket-sidebar',
  standalone: true,
  imports: [ CommonModule, PrimeComponentsModule, PipesModule, DatePipe, SelectGenericUsersComponent, TimelineTicketComponent ],
  templateUrl: './info-ticket-sidebar.component.html',
  styleUrls: ['./info-ticket-sidebar.component.scss'],
  providers: [ FormatImagesService ]
})
export class InfoTicketSidebarComponent implements OnInit {

    @Input() idTicket = signal<number>(0);
    @ViewChild('descriptionTicket') descriptionTicket!: ElementRef;

    private renderer2 = inject(Renderer2);
    private formatImagesService = inject(FormatImagesService);
    private ticketService = inject(TicketsService);
    private localStorageService = inject(LocalStorageService);
    private helpersService = inject(HelpersService);
    private graphGanttService = inject(GraphGanttService);
    private followService = inject(FollowService);

    private subscription!: Subscription;
    public isRoleApplicant = signal<boolean>(true);
    serverUrl: string = environment.server_url;
    public textColor: string = 'text-blue-400';
    public modalVisible: boolean = false;
    public activeIndex: number = 0;
    public widthModal: string = "w-11";
    ticket = signal<TicketById>(new TicketById);
    currentObserver: Observator = new Observator;
    setObserver = signal<ObservatorResponse[]>([]);
    posibleSolution: TicketSolutionProjection = new TicketSolutionProjection;
    public userId: number;
    public timelineList = signal<Timeline[]>([]);

    ngOnInit(): void {
      this.subscription = this.ticketService.eventOpenInfoTicket.subscribe( () => {
        this.getInfoTIcket();
      })
      this.isRoleApplicant.set(this.localStorageService.get('role') != 'all'? false: true);
    }

    ngOnDestroy(): void {
      (this.subscription)? this.subscription.unsubscribe(): '';
    }

    fillDescriptionTicket(divDescriptionTicket: ElementRef) {
        const descriptionTicket = divDescriptionTicket.nativeElement;
        this.renderer2.setProperty(descriptionTicket, 'innerHTML', this.ticket().description);
        const images: HTMLElement[] = descriptionTicket.querySelectorAll('img');
        this.formatImagesService.widthImgaesInsideCOntainer(images);
    }

    stringToObject(text: string | null) {
        return JSON.parse(text as string);
    }

    public handleOpenFormTicketModal( isDerivation: boolean ) {
      const data: DataOpenFormTicket = {
        idRecursive: this.ticket().id,
        isDerivation,
        dataTicket: this.ticket()
      }
      this.ticketService.eventOpenFormTicket.emit(data);
      this.modalVisible = false;
    }

    private getInfoTIcket ( ) {
      if (this.idTicket() > 0) {
        this.ticketService.ticketById(this.idTicket()).subscribe({
            next: (res: TicketByIdResponse ) => {
                this.posibleSolution = res.ticketSolutionProjection as TicketSolutionProjection;
                this.setObserver.set(res.observerList);
                this.ticket.set(res.ticketByIdProjection as TicketById) ;
                this.textColor = res.ticketByIdProjection?.priority?.includes('BAJA')? 'text-blue-400': res.ticketByIdProjection?.priority?.includes('ALTA')? 'text-red-500': 'text-teal-500';
                this.modalVisible = true;
                this.getTimeline();
            },
            error: (err) => {
                console.log(err);
                this.helpersService.messageNotification("error", 'Error', err.message, 3000);
            }
        })
      }
    }

    public selectObservers(event: DataCommon) {
      if (event) {
        this.currentObserver = {
          credential: event.id,
          nameActor: event.name,
          ticket: this.ticket().id
        }
        this.userId = event.id;
      }
    }

    public addObserver() {
      if ( this.currentObserver.credential ) {
        this.ticketService.createObserver(this.currentObserver).subscribe({
           next: (resp:any) => {
              this.setObserver().push({key: resp.id, value: resp.nameActor});
              this.helpersService.messageNotification("success", 'Agregado', 'Observador agregado', 3000);
              this.userId = null;
              this.currentObserver = new Observator;
           },
           error: err => {
              console.log(err);
              this.helpersService.messageNotification("error", 'Error', err.message, 3000);
           }
        })
      } else {
        this.helpersService.messageNotification("warn", 'Por favor', 'Seleccione un observador.', 3000);
      }
    }

    public removeObserver(observer:any){
      this.ticketService.deleteObserver(observer.key).subscribe({
         next: resp => {
            const index = this.setObserver().indexOf(observer);
            this.setObserver().splice(index, 1);
            this.helpersService.messageNotification("success", 'Eliminado', 'Observador eliminado', 3000);
         },
         error: err => {
            console.log(err);
            this.helpersService.messageNotification("error", 'Error', err.message, 3000);
         }
      })
    }

    public handleOpenModalGrapGantt(isStatus: boolean) {
      this.followService.timeline(this.ticket().id!, isStatus).subscribe({
        next: resp => {
          this.modalVisible = false;
          const data = {
            title: this.ticket().title,
            serie: JSON.parse(resp.timeLine)
          }
          this.graphGanttService.eventOpenModalGrapGantt.emit(data);
        },
        error: err => {
          console.log(err);
          this.helpersService.messageNotification("error", 'Error', err.message, 3000);
        }
      })

    }

    public getTimeline () {
      this.ticketService.listComments(this.idTicket()).subscribe({
          next: (res) => {
              this.timelineList.set(res.map( t => {
                  return {
                      ...t,
                      idStatus: t.fileName?.includes('docx')? 'text-blue-500': t.fileName?.includes('xlsx')? 'text-green-500' : t.fileName?.includes('pdf')? 'text-red-500': 'text-yellow-500'
                      }
                  }
              ));
          },
          error: (err) => {
              console.log(err);
              this.helpersService.messageNotification("error", 'Error', err.message, 3000);
          }
      })
    }

    public changeTab() {
      switch (this.activeIndex) {
        case 0:
          this.widthModal = "w-11";
          break;
        case 1:
          this.widthModal = "w-full lg:w-8";
          break;
        case 2:
          this.widthModal = "w-5";
          break;

        default:
          break;
      }
    }
}
