import { Component, inject, input } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { HelpersService } from 'src/app/core/services/helpers.service';
import { Parameter } from 'src/app/core/models/Parameter';
import { ParameterService } from 'src/app/modules/parameters/services/parameters.service';
import { iconsPrime as IconsPrime } from 'src/app/shared/icons/icons-pime';
import { DataCommon } from '@core/models/FieldsCommons';
import { noSpaceValidator } from '@core/validators/noSpaceValidator';
import { MESSAGES } from '@core/constants/messages';
import { LABELS } from '@core/constants/labels';
import { MessageRequiredFieldComponent } from '../../../../shared/components/message-required-field/message-required-field.component';
import { PrimeModules } from '@shared/prime-components/prime-components.module';
import { TypeSubmitEnum } from '@core/enums/type-submit';
import { Severity } from '@core/enums/severity';


@Component({
    selector: 'app-form',
    templateUrl: './form.component.html',
    imports: [MessageRequiredFieldComponent, PrimeModules, ReactiveFormsModule]
})
export class FormComponent {

  readonly folderNameSelected = input.required<string>();

  private formBuilder = inject(FormBuilder);
  private helpersService = inject(HelpersService);
  private parameterService = inject(ParameterService);

  public readonly messages = MESSAGES;
  public readonly labels = LABELS;
  public iconsPrime = IconsPrime;
  public folders: DataCommon[] = [];
  public parameters: Parameter[] = [];
  private parameterId = 0;
  public openModal = false;
  public titleForm = "";
  private tableComponent = this.parameterService.eventTableComponent;

  public formParameter: FormGroup = this.formBuilder.group({
    id: [],
    folder: [],
    ranking: [],
    value: [, [Validators.required, noSpaceValidator]],
    icon: [],
    color: [],
    status:[],
    active: [, [Validators.required]]
  });

  ngOnInit() {
    this.parameterService.eventFormComponent.set(this);
  };


  hideModal() {
    this.openModal = false;
  };

  public openCreate() {
    this.reset();
    const folderNameSelected = this.folderNameSelected();
    if ( folderNameSelected ) {
      this.titleForm = "Nuevo parámetro";
      this.formParameter.patchValue({ folder: folderNameSelected });
      this.openModal = true;
    } else {
      this.helpersService.messageNotification('warn', 'Por favor', 'Seleccione un folder.');
    }
  };

  public openEdit(id: number ) {
    this.reset();
    this.titleForm = "Editar parámetro";
    this.parameterService.getById(id).subscribe({
      next: (res) => {
        this.parameterId = res.id!;
        this.formParameter.patchValue(res)
        this.openModal=true;
      }
    })
  };

  public saveParameter() {
    if (this.formParameter.valid ) {
      this.parameterId > 0? this.submit(TypeSubmitEnum.UPDATE): this.submit(TypeSubmitEnum.CREATE);
    }
  };

  private reset(): void {
    this.formParameter.reset();
    this.formParameter.patchValue({active: true});
    this.parameterId = 0;
  };

  private submit(type: TypeSubmitEnum) {
    const data: Parameter = {
      ...this.formParameter.value,
    };
    const service = type == TypeSubmitEnum.CREATE
      ? this.parameterService.create(data)
      : this.parameterService.update(this.parameterId, data)
    service.subscribe({
      next: () => {
        const message = type == TypeSubmitEnum.CREATE
          ? MESSAGES.recordCreated
          : MESSAGES.recordUpdated;
        this.helpersService.messageNotification(Severity.success, "Correcto", message);
        this.hideModal();
        this.reset();
      }, complete: () => {
        this.tableComponent().reload();
      }
    })
  };

}
