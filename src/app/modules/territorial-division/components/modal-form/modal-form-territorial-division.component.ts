import { Component, inject, input } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { HelpersService } from '@core/services/helpers.service';
import { noSpaceValidator } from '@core/validators/noSpaceValidator';
import { TerritorialDivisionService } from '../../services/territorial-division.service';
import { TerritorialDivision } from '@core/models/territorial-division';
import { MESSAGES } from '@core/constants/messages';
import { LIMITS } from '@core/constants/limits';
import { regex } from '@core/constants/regexs';
import { LABELS } from '@core/constants/labels';
import { TypeSubmitEnum } from '@core/enums/type-submit';
import { Severity } from '@core/enums/severity';
import { MessageRequiredFieldComponent } from '../../../../shared/components/message-required-field/message-required-field.component';
import { TerritorialDivisionModule } from '../../territorial-division.module';

@Component({
    selector: 'app-modal-form-territorial-division',
    templateUrl: './modal-form-territorial-division.component.html',
    imports: [MessageRequiredFieldComponent, TerritorialDivisionModule]
})
export class ModalFormTerritorialDivisionComponent {

  readonly countryId = input.required<number>();

  private formBuilder = inject(FormBuilder);
  private helpersService = inject(HelpersService);
  private territorialDivisionService = inject(TerritorialDivisionService);

  public labels = LABELS;
  public messages = MESSAGES;
  public territorialDivisionTypes: string[] = [];
  private territorialDivisionId = 0;
  public openModal = false;
  public titleForm = "";
  private tableComponent = this.territorialDivisionService.eventTableComponent;

  public formTerritorialDivision: FormGroup = this.formBuilder.group({
    id: [],
    name: [, [Validators.required, Validators.minLength(LIMITS.minLengthFive), Validators.pattern(regex.fieldName), noSpaceValidator]],
    territorialDivisionType: ['', Validators.required],
  });

  ngOnInit() {
    this.territorialDivisionService.eventFormComponent.set(this);
    this.getTerritorialDivisionTypes();
  };


  private getTerritorialDivisionTypes() {
    this.territorialDivisionService.getTerritorialDivisionTypes().subscribe({
      next: (res) => {
        this.territorialDivisionTypes = res;
      }
    })
  };
  
  public hideModal() {
    this.openModal = false;
  };

  public openCreate(){
    this.reset();
    this.titleForm = this.labels.newRegistration("división territorial");
    this.openModal = true;
  };

  public openEdit(id: number ){
    this.reset();
    this.titleForm = this.labels.editRegistration("división territorial");
    this.territorialDivisionService.getById(id).subscribe({
      next: (res) => {
        this.territorialDivisionId = res.id!;
        this.formTerritorialDivision.patchValue(res);
        this.openModal=true;
      }
    })
  };

  public saveTerritorialDivision() {
    if (this.formTerritorialDivision.valid) {
      this.territorialDivisionId > 0 ? this.submit(TypeSubmitEnum.UPDATE) : this.submit(TypeSubmitEnum.CREATE);
    }
  };

  private reset(): void {
    this.formTerritorialDivision.reset();
    this.territorialDivisionId = 0;
  };

  private submit(type: TypeSubmitEnum) {
    const data: TerritorialDivision = {
      ...this.formTerritorialDivision.value,
      countryId: this.countryId()
    };
    const service = type == TypeSubmitEnum.CREATE
      ? this.territorialDivisionService.create(data)
      : this.territorialDivisionService.update(this.territorialDivisionId, data);
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
    });
  };
}
