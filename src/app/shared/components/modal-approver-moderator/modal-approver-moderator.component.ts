import { Component, inject, OnDestroy, OnInit, signal, output } from '@angular/core';

import { PrimeModules } from '@shared/prime-components/prime-components.module';
import { TicketService } from '@ticket-historical/services/tickets.service';
import { FormsModule } from '@angular/forms';
import { IBodychangeApproverOrModerator, TicketHistory } from '@core/interfaces/ticket.interface';
import { HelpersService } from '@core/services/helpers.service';
import { Severity } from '@core/enums/severity';
import { LABELS } from '@core/constants/labels';
import { Subscription } from 'rxjs';
import { EnterpriseCategorySubcategory, ApproverModeratorShortEnterpriseCategory } from '@core/models/EnterpriseCategory';
import { EnterpriseCategoryService } from '@enterpriseCategory/services/enterpriseCategories.service';
import { STATES_TICKET_ENUM } from '@core/enums/ticket';

@Component({
   selector: 'app-modal-approver-moderator',
   standalone: true,
   imports: [FormsModule, PrimeModules],
   templateUrl: './modal-approver-moderator.component.html'
})
export class ModalApproverModeratorComponent implements OnInit, OnDestroy {

   readonly eventChangedApproverModerator = output<void>();
   
   private ticketService = inject(TicketService);
   private enterpriseCategoryService = inject(EnterpriseCategoryService);
   private helpersService = inject(HelpersService);
   
   public readonly labels = LABELS;
   public openModal: boolean = false;
   public modalTitle: string;
   public userList = signal<ApproverModeratorShortEnterpriseCategory[]>([]);
   public ticketSelected: TicketHistory;
   public selectedApproverOrModeratorId: number;
   private subscription: Subscription = new Subscription();

   ngOnInit() {
      this.subscription.add(
         this.ticketService.eventOpenModalApproverModerator.subscribe((ticketSelected) => {
            this.ticketSelected = ticketSelected;
            this.getApproversAndModeradors();
            if (this.ticketSelected.flowStatus == STATES_TICKET_ENUM.APPROVER_WAITING) {
               this.selectedApproverOrModeratorId = this.ticketSelected.approverId;
               this.modalTitle = this.labels.changeApprover;
            } else {
               this.selectedApproverOrModeratorId = this.ticketSelected.moderatorId;
               this.modalTitle = this.labels.changeModerator;
            }
         })
      )
   }

   ngOnDestroy(): void {
      this.subscription.unsubscribe();
   }

   private getApproversAndModeradors() {
      const body: EnterpriseCategorySubcategory = {
         enterpriseId: this.ticketSelected.enterpriseId,
         categoryId: this.ticketSelected.categoryId,
         subCategoryId: this.ticketSelected.subCategoryId
      };
      this.enterpriseCategoryService.getApproversAndModerators(body).subscribe({
         next: (res) => {
            this.userList.set(this.ticketSelected.flowStatus == STATES_TICKET_ENUM.APPROVER_WAITING? res.approvers: res.moderators);
            this.openModal = true;
         }
      })
   }

   public updateApproverOrModeartor() {
      const body: IBodychangeApproverOrModerator = {
         ticketId: this.ticketSelected.id,
         credentialId: this.selectedApproverOrModeratorId
      }
      const serviceTochange = this.ticketSelected.flowStatus == STATES_TICKET_ENUM.APPROVER_WAITING
         ? this.ticketService.changeApprover(body)
         : this.ticketService.changeModerator(body);
      serviceTochange.subscribe({
         next: () => {
            const message = this.ticketSelected.flowStatus == STATES_TICKET_ENUM.APPROVER_WAITING
               ? "Aprobador modificado con exito."
               : "Moderador modificado con exito."
            this.helpersService.messageNotification(Severity.success, "Correcto", message);
            this.openModal = false;
         }, complete: () => {
            this.eventChangedApproverModerator.emit();
         }
      });
   }
}
