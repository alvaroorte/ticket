import { Component, inject, signal, input } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { HelpersService } from '@core/services/helpers.service';
import { MESSAGES } from '@core/constants/messages';
import { SlaService } from '../../services/sla.service';
import { ParameterService } from '@parameter/services/parameters.service';
import { IParameterSelect } from '@core/models/Parameter';
import { ISla, ISlaSend } from '@core/interfaces/sla.inteface.';
import { LABELS } from '@core/constants/labels';
import { STAFF_AVAILABILITIES } from '@core/constants/staff-availability';
import { TypeSubmitEnum } from '@core/enums/type-submit';
import { Severity } from '@core/enums/severity';
import { FoldersParametersEnum } from '@core/enums/folder-parameters.enum';
import { MessageRequiredFieldComponent } from '../../../../shared/components/message-required-field/message-required-field.component';
import { PrimeModules } from '@shared/prime-components/prime-components.module';

@Component({
    selector: 'app-modal-form',
    templateUrl: './modal-form.component.html',
    imports: [ReactiveFormsModule, MessageRequiredFieldComponent, PrimeModules]
})
export class ModalFormComponent {

  readonly enterpriseId = input.required<number>();

  private formBuilder = inject(FormBuilder);
  private helpersService = inject(HelpersService);
  private slaService = inject(SlaService);
  private parameterService = inject(ParameterService);

  public readonly messages = MESSAGES;
  public readonly labels = LABELS;
  private slaId = 0;
  public openModal = false;
  public titleForm = "";
  public priorities = signal<IParameterSelect[]>([]);
  public ticketType = signal<IParameterSelect[]>([]);
  public staffAvailabilities = STAFF_AVAILABILITIES;
  private tableComponent = this.slaService.eventTableComponent;

  public formSla: FormGroup = this.formBuilder.group({
    firstResponseTime: ['', [Validators.required, Validators.min(1), Validators.max(24)]],
    staffAvailability: [, [Validators.required]],
    enterpriseId: [, Validators.required],
    ticketPriorityParameterId: [, Validators.required],
    ticketTypeParameterId: [, Validators.required]
  });

  ngOnInit() {
    this.slaService.eventFormComponent.set(this);
  };

  public hideModal() {
    this.openModal = false;
  };

  private getTypeTicketsAndPriorities() {
    this.parameterService.select([FoldersParametersEnum.TIPO_DE_TICKET, FoldersParametersEnum.PRIORIDAD]).subscribe({
       next: (res) => {
          this.ticketType.set(res.filter(p => p.folder == FoldersParametersEnum.TIPO_DE_TICKET));
          this.priorities.set(res.filter(p => p.folder == FoldersParametersEnum.PRIORIDAD));
       }
    });
  }

  public openCreate(){
    this.reset();
    this.getTypeTicketsAndPriorities();
    this.titleForm = this.labels.newRegistration("SLA");
    this.formSla.patchValue({ enterpriseId: this.enterpriseId() });
    this.openModal = true;
  };

  public openEdit(id: number ){
    this.reset();
    this.getTypeTicketsAndPriorities();
    this.titleForm = this.labels.editRegistration("SLA");
    this.slaService.getById(id).subscribe({
      next: (res) => {
        this.slaId = res.id;
        this.openModal = true;
        this.updateFormValues(res)
      }
    })
  };

  private updateFormValues(sla: ISla) {
    this.formSla.patchValue(sla);
  }

  public save() {
    if (this.formSla.valid ) {
      this.slaId > 0? this.submit(TypeSubmitEnum.UPDATE, this.slaId): this.submit(TypeSubmitEnum.CREATE);
    }
  };

  private reset(): void {
    this.formSla.reset();
    this.slaId = 0;
    this.ticketType.set([]);
    this.priorities.set([]);
  };

  private submit(type: TypeSubmitEnum, id?: number) {
    const data: ISlaSend = {
      ...this.formSla.value
    };
    const service = type == TypeSubmitEnum.CREATE?
      this.slaService.create(data)
      : this.slaService.update(id, data);
    const message: string = type == TypeSubmitEnum.CREATE?
      this.messages.recordCreated
      : this.messages.recordUpdated;
    service.subscribe({
      next: () => {
        this.helpersService.messageNotification(Severity.success, "Correcto", message);
        this.hideModal();
        this.reset();
      }, complete: () => {
        this.tableComponent().reload();
      }
    })
  };
}
