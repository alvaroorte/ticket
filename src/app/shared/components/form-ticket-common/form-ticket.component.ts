import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, OnInit, Output, Signal, inject, signal } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Parameter } from '@core/models/Parameter';
import { HelpersService } from '@core/services/helpers.service';
import { ParametersService } from '@parameter/services/parameters.service';
import { PrimeComponentsModule } from '@shared/prime-components/prime-components.module';
import { InputFileComponent } from '../input-file/input-file.component';
import { CredencialService } from '@core/services/credencial';
import { messages } from '@core/constants/constants';

@Component({
  selector: 'app-form-ticket-common',
  standalone: true,
  imports: [CommonModule, PrimeComponentsModule, ReactiveFormsModule, InputFileComponent],
  templateUrl: './form-ticket.component.html'
})
export class FormTicketCommonComponent implements OnInit {

    @Input() showUploadFile: Signal<boolean> = signal(false);
    @Input() domain: string = '';
    @Output() saveTicket = new EventEmitter<any>();

    public labelInputSlider = signal('Muy');
    public labelDescriptionSlider = signal('');
    public messages = messages;

    private formBuilder = inject(FormBuilder);
    private parametersService = inject(ParametersService);
    private credencialService = inject(CredencialService);
    private helpersService = inject(HelpersService);
    priorities = signal<Parameter[]>([]);
    priority: number = 0;
    editarEmpty: boolean = false;

    archivoUploaded: any;
    formTicket: FormGroup = this.formBuilder.group({
        idRecursive: [null],
        title: [],
        description: [, [Validators.required]],
        priorityId: [, [Validators.required]],
        ubication: [],
        phone: []
    });

    reset(): void {
        this.formTicket.reset();
    };

    ngOnInit(): void {
        this.getPriorities();
        this.getCredentialComplement();
    }

    createTicket() {
        if (this.editarEmpty) {
            this.helpersService.messageNotification("warn", 'Error', 'El campo descripción requiere como mínimo 5 caracteres', 3000);
        } else {
            this.formTicket.value.title = this.formTicket.value.title.trim()
            this.formTicket.value.priorityId = ( this.formTicket.value.priorityId == 'priority' )? this.priorities()[0].id: this.priorities()[this.formTicket.value.priorityId].id;
            this.formTicket.value.domain = this.domain;
            let dataTicket = {
                values: this.formTicket.value,
                file: this.archivoUploaded
            };

            this.saveTicket.emit(dataTicket);
        }
    };

    changeInputSlider( value: number | undefined ) {
        if ( document.querySelector('.p-slider-range') ) {
            const slider:any = document.querySelector('.p-slider-range');
            slider.style.backgroundColor = this.priorities()[value as number].color;

            const sliderRound:any = document.querySelector('.p-slider-handle');
            sliderRound.style.backgroundColor = this.priorities()[value as number].color;

            this.labelInputSlider.set(this.priorities()[value as number].value as string);
            this.labelDescriptionSlider.set(this.priorities()[value as number].description as string);
        }
    }

    getPriorities() {
        this.parametersService.search('prioridad').subscribe({
        next: (res) => {
            this.priorities.set(res);
            this.changeInputSlider(0);
            setTimeout(() => {
                this.formTicket.patchValue({ priorityId: 0 })
            }, 200);
        },
        error: (err) => {
            console.log(err);
            this.helpersService.messageNotification("error", 'Error', err.message, 3000);
        }
        });
    }

    getCredentialComplement() {
        this.credencialService.credentialComplement().subscribe({
        next: (res) => {
            res.phone = res.phone? res.phone: null;
            this.formTicket.patchValue({...res})
        },
        error: (err) => {
            console.log(err);
            this.helpersService.messageNotification("error", 'Error', err.message, 3000);
        }
        });
    }

    cargarArchivo(dataFile: any) {
        this.archivoUploaded = dataFile;
    }

    getEditorChanges(e:any) {
            this.editarEmpty = (e.textValue.length == 0)? true: false;
    }
}
