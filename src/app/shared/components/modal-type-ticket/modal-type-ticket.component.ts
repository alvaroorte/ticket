import { Component, EventEmitter, Input, Output, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HelpersService } from '@core/services/helpers.service';
import { PrimeComponentsModule } from '@shared/prime-components/prime-components.module';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { TicketsService } from '@ticket-historical/services/tickets-.service';
import { ParametersService } from '@parameter/services/parameters.service';
import { Parameter } from '@core/models/Parameter';

@Component({
  selector: 'app-modal-type-ticket',
  standalone: true,
  imports: [CommonModule, PrimeComponentsModule, ReactiveFormsModule],
  templateUrl: './modal-type-ticket.component.html',
  providers: [HelpersService]
})
export class ModalTypeTicketComponent {

  @Input({required: true}) idTicket = signal<number>(0);
  @Output() saveTypeTicket = new EventEmitter();

  private formBuilder = inject(FormBuilder);
  private helpersService = inject(HelpersService);
  private ticketService = inject(TicketsService);
  private parameterService = inject(ParametersService);

  typeTickets = signal<Parameter[]>([]);
  openModal: boolean = false;
  isLoading: boolean = false;

  ngOnInit(): void {
    this.ticketService.eventOpenModalTypeTicket.subscribe( () => {
      this.openModalTypeTicket();
    })
    this.getTypeTickets();
  }

  public formTicket: FormGroup = this.formBuilder.group({
      typeTicket: [, [Validators.required]],
  });

  hideModal() {
      this.openModal = false;
      this.isLoading = false;
    };

  openModalTypeTicket() {
    this.openModal = true;
    this.isLoading = false;
  }

  reset(): void {
      this.isLoading = false;
      this.formTicket.reset();
  };

  submitForm() {
      this.isLoading = true;
      this.ticketService.update(this.idTicket(), {typeTicket: this.formTicket.value.typeTicket}).subscribe({
        next: (res) => {
            this.saveTypeTicket.emit(res)
            this.helpersService.messageNotification("success", "Correcto", `¡Cambio guardado!.`, 3000);
            this.hideModal();
            this.reset();
        },
        error: (err) => {
            this.isLoading = false;
            console.log(err);
            this.helpersService.messageNotification("error", err.eroor, err.message, 3000);
        }
      })
  };

  getTypeTickets() {
    this.parameterService.searchMultiple('tipo de ticket').subscribe({
      next: (res) => {
        this.typeTickets.set(res);
      },
      error: (err) => {
        console.log(err);
        this.helpersService.messageNotification("error", 'Error', err.message, 3000);
      }
    });
  }
}
