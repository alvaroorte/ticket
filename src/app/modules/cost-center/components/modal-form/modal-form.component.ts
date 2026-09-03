import { Component, inject, signal, input } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { HelpersService } from '@core/services/helpers.service';
import { MESSAGES } from '@core/constants/messages';
import { Parameter } from '@core/models/Parameter';
import { LABELS } from '@core/constants/labels';
import { STAFF_AVAILABILITIES } from '@core/constants/staff-availability';
import { CostCenterService } from '../../services/cost-center.service';
import { ICostCenter } from '@core/interfaces/cost-center.inteface.';
import { Severity } from '@core/enums/severity';
import { regex } from '@core/constants/regexs';
import { LIMITS } from '@core/constants/limits';
import { TypeSubmitEnum } from '@core/enums/type-submit';
import { noSpaceValidator } from '@core/validators/noSpaceValidator';
import { GenericTableComponent } from '@shared/components/generic-table/generic-table.component';
import { MessageRequiredFieldComponent } from '../../../../shared/components/message-required-field/message-required-field.component';
import { PrimeModules } from '@shared/prime-components/prime-components.module';

@Component({
    selector: 'app-modal-form',
    templateUrl: './modal-form.component.html',
    imports: [MessageRequiredFieldComponent, PrimeModules, ReactiveFormsModule]
})
export class ModalFormComponent {

  readonly enterpriseId = input.required<number>();

  private formBuilder = inject(FormBuilder);
  private helpersService = inject(HelpersService);
  private costCenterService = inject(CostCenterService);

  public readonly messages = MESSAGES;
  public readonly labels = LABELS;
  private costCenterId = 0;
  public openModal = false;
  public titleForm = "";
  public priorities = signal<Parameter[]>([]);
  public ticketType = signal<Parameter[]>([]);
  public staffAvailabilities = STAFF_AVAILABILITIES;
  public activeIndex: number = 0;
  public activeIndexSignal = signal<number>(0);
  private tableComponent = this.costCenterService.eventTableComponent;

  public formCostCenter: FormGroup = this.formBuilder.group({
    code: ['', [Validators.required, Validators.pattern(regex.fieldCode), Validators.minLength(LIMITS.minLengthThree), noSpaceValidator]],
    name: [, [Validators.required, Validators.pattern(regex.fieldName), Validators.minLength(LIMITS.minLengthFive), noSpaceValidator]],
    active: [, [Validators.required]],
    enterpriseId: [, Validators.required]
  });

  ngOnInit() {
    this.costCenterService.eventFormComponent.set(this);
  };

  public hideModal() {
    this.openModal = false;
  };
  
  public openCreate(){
    this.reset();
    this.titleForm = this.labels.newRegistration("centro de costo");
    this.formCostCenter.patchValue({ enterpriseId: this.enterpriseId() });
    this.openModal = true;
  };

  public openEdit(id: number ){
    this.reset();
    this.titleForm = this.labels.editRegistration("centro de costo") ;
    this.costCenterService.getById(id).subscribe({
      next: (res) => {
        this.costCenterId = res.id;
        this.openModal = true;
        this.updateFormValues(res)
      }
    })
  };

  private updateFormValues(costCenter: ICostCenter) {
    this.formCostCenter.patchValue({
      ...costCenter,
      enterpriseId: this.enterpriseId()
    });
  }

  public save() {
    if (this.formCostCenter.valid ) {
      this.costCenterId > 0
        ? this.submit(TypeSubmitEnum.UPDATE, this.costCenterId)
        : this.submit(TypeSubmitEnum.CREATE);
    }
  };

  private reset(): void {
    this.formCostCenter.reset();
    this.formCostCenter.patchValue({active: true});
    this.costCenterId = 0;
  };

  private submit(type: TypeSubmitEnum, id?: number) {
      const data: ICostCenter = {
        ...this.formCostCenter.value
      };
      const service = type == TypeSubmitEnum.CREATE?
        this.costCenterService.create(data)
        : this.costCenterService.update(id, data);
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
