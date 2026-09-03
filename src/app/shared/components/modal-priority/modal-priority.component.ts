import { Component, inject, OnDestroy, OnInit, signal, output } from '@angular/core';

import { PrimeModules } from '@shared/prime-components/prime-components.module';
import { TicketService } from '@ticket-historical/services/tickets.service';
import { ParameterService } from '@parameter/services/parameters.service';
import { IParameterSelect } from '@core/models/Parameter';
import { FormsModule } from '@angular/forms';
import { IBodyModifyPriority } from '@core/interfaces/ticket.interface';
import { HelpersService } from '@core/services/helpers.service';
import { Severity } from '@core/enums/severity';
import { LABELS } from '@core/constants/labels';
import { Subscription } from 'rxjs';
import { FoldersParametersEnum } from '@core/enums/folder-parameters.enum';

@Component({
    selector: 'app-modal-priority',
    imports: [FormsModule, PrimeModules],
    templateUrl: './modal-priority.component.html'
})
export class ModalPriorityComponent implements OnInit, OnDestroy {

   readonly eventChangedPriority = output<void>();
   
   private ticketService = inject(TicketService);
   private parameterService = inject(ParameterService);
   private helpersService = inject(HelpersService);
   
   public readonly labels = LABELS;
   public openModal: boolean = false;
   public priorities = signal<IParameterSelect[]>([]);
   private ticketId: number;
   public selectedPriority = signal<number>(null);
   private subscription: Subscription = new Subscription();

   ngOnInit() {
      this.subscription.add(
         this.ticketService.eventOpenModalPriority.subscribe((data) => {
            this.getPriorities();
            this.ticketId = data.ticketId;
            this.selectedPriority.set(data.priorityId);            
         })
      )
   }

   ngOnDestroy(): void {
      this.subscription.unsubscribe();
   }

   private getPriorities() {
      this.parameterService.select([FoldersParametersEnum.PRIORIDAD]).subscribe({
         next: (res) => {
            this.priorities.set(res);
            this.openModal = true;
         }
      });
   }

   public updatePriority() {
      const body: IBodyModifyPriority = {
         ticketId: this.ticketId,
         ticketPriorityParameterId: this.selectedPriority()
      }
      this.ticketService.modifyPriority(body).subscribe({
         next: () => {
            this.helpersService.messageNotification(Severity.success, "Correcto", "prioridad modificada con exito.");
            this.openModal = false;
         }, complete: () => {
            this.eventChangedPriority.emit();
         }
      });
   }
}
