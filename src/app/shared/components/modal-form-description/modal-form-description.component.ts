import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, OnInit, Output, Signal, inject, signal } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { TicketFunctionArrays, TicketFunctionSend, TicketSolutionProjection } from '@core/models/Ticket';
import { HelpersService } from '@core/services/helpers.service';
import { PrimeComponentsModule } from '@shared/prime-components/prime-components.module';
import { TicketsService } from '@ticket-historical/services/tickets-.service';

@Component({
  selector: 'app-modal-form-description',
  standalone: true,
  imports: [ CommonModule, PrimeComponentsModule, FormsModule, ReactiveFormsModule ],
  templateUrl: './modal-form-description.component.html'
})
export class ModalFormDescriptionComponent implements OnInit {

    @Input() nameFunction: Signal<string> = signal('');
    @Input() title: Signal<string> = signal('Descripción');
    @Input({required: true}) idTicket: Signal<number> = signal(0);
    @Input() solutionTemp!: TicketSolutionProjection;
    @Input() selector: Signal<TicketFunctionArrays> = signal(new TicketFunctionArrays);
    @Output() updateStatusOfButtons = new EventEmitter();

    private formBuilder = inject(FormBuilder);
    private helpersService = inject(HelpersService);
    private ticketService = inject(TicketsService);

    public openModal: boolean = false;
    isLoading: boolean = false;
    isRequired: boolean = false;
    editorEmpty: boolean = false;

    public formDescription: FormGroup = this.formBuilder.group({
        function: [''],
        priority: [],
        qualityService: [3],
        impact: [],
        causeIncident: [],
        activity: [],
        system: [],
        description: []
    });

    ngOnInit(): void {
        this.ticketService.eventOpenModalDescription.subscribe( () => {
            this.handleOnShowModal();
        })
    }

    private handleOnShowModal(){
      this.isRequired = false;
      if ((this.selector().prioridad && this.selector().prioridad!.length > 0) || !(this.selector().calidaddeservicio && this.selector().calidaddeservicio!.length > 0)) {
         this.isRequired = true;
      }
        this.formDescription = this.formBuilder.group({
            function: [''],
            priority: [, [(this.selector().prioridad && this.selector().prioridad!.length > 0)? Validators.required: Validators.nullValidator]],
            qualityService: (this.selector().calidaddeservicio && this.selector().calidaddeservicio!.length > 0)? [4 ,[ Validators.required ]]: [],
            impact: [, [(this.selector().prioridad && this.selector().prioridad!.length > 0)? Validators.required: Validators.nullValidator]],
            causeIncident: [, [(this.selector().prioridad && this.selector().prioridad!.length > 0)? Validators.required: Validators.nullValidator]],
            activity: [],
            system: [],
            description: [, [((this.selector().prioridad && this.selector().prioridad!.length > 0) || !(this.selector().calidaddeservicio && this.selector().calidaddeservicio!.length > 0))? Validators.required: Validators.nullValidator]]
        });
        this.openModal = true;
        this.isLoading = false;
    };

    reset(): void {
        this.isLoading = false;
        this.openModal = false;
        this.formDescription.reset();
    };

    submitModalDescription() {
        if (((this.selector().prioridad && this.selector().prioridad!.length > 0) || !(this.selector().calidaddeservicio && this.selector().calidaddeservicio!.length > 0)) && this.editorEmpty) {
            this.helpersService.messageNotification("warn", "Atención", "El campo descripción es requerido");
        } else {
            this.isLoading = true;
            const data: TicketFunctionSend = {
                ...this.formDescription.value,
            };
            data.function =  this.nameFunction();
            this.selector().calidaddeservicio ? data.qualityService = this.selector().calidaddeservicio![this.formDescription.value.qualityService-1].name: '';
            this.isLoading = false;

            this.ticketService.ticketFunction(this.idTicket(), data).subscribe({
                next: (res) => {
                    this.helpersService.messageNotification("success", "Correcto", `${res.message}`, 3000);
                    this.updateStatusOfButtons.emit()
                    this.reset();
                },
                error: (err) => {
                    this.isLoading = false;
                    console.log(err);
                    this.helpersService.messageNotification("error", err.eroor, err.message, 3000);
                }
            })
        }
    };

    public changeTextValueDescription( text: string){
        this.editorEmpty = ( text.trim().length == 0)? true: false;
    }
}
