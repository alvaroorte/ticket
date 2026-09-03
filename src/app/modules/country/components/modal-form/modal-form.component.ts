import { Component, inject } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { HelpersService } from '@core/services/helpers.service';
import { noSpaceValidator } from '@core/validators/noSpaceValidator';
import { CountryService } from '../../services/country.service';
import { Country } from '@core/models/country';
import { LIMITS } from '@core/constants/limits';
import { regex } from '@core/constants/regexs';
import { MESSAGES } from '@core/constants/messages';
import { LABELS } from '@core/constants/labels';
import { TypeSubmitEnum } from '@core/enums/type-submit';
import { Severity } from '@core/enums/severity';
import { MessageRequiredFieldComponent } from '../../../../shared/components/message-required-field/message-required-field.component';
import { CountryModule } from '../../country.module';

@Component({
    selector: 'app-modal-form',
    templateUrl: './modal-form.component.html',
    imports: [MessageRequiredFieldComponent, CountryModule]
})
export class ModalFormComponent {

  private formBuilder = inject(FormBuilder);
  private helpersService = inject(HelpersService);
  private countryService = inject(CountryService);

  public readonly labels = LABELS;
  public readonly messages = MESSAGES;
  private countryId = 0;
  public openModal = false;
  public titleForm = "";
  private tableComponent = this.countryService.eventTableComponent;

  public isLoading = false;

  public formCountry: FormGroup = this.formBuilder.group({
    name: [, [Validators.required, Validators.minLength(LIMITS.minLengthThree), Validators.pattern(regex.fieldName), noSpaceValidator]]
  });

  ngOnInit() {
    this.countryService.eventFormComponent.set(this);
  };


  public hideModal() {
    this.openModal = false;
    this.isLoading = false;
  };

  public openCreate(){
    this.reset();
    this.titleForm = "Nuevo país";
    this.openModal = true;
  };

  public openEdit(id: number ){
    this.reset();
    this.titleForm = "Editar país";
    this.countryService.getById(id).subscribe({
      next: (res) => {
        this.countryId = res.id!;
        this.formCountry.patchValue(res);
        this.openModal=true;
      }
    })
  };

  public saveCountry() {
    this.isLoading = true;
    if (this.formCountry.valid ) {
      this.countryId > 0? this.submit(TypeSubmitEnum.UPDATE): this.submit(TypeSubmitEnum.CREATE);
    } else {
      this.isLoading = false;
    }
  };

  private reset(): void {
    this.formCountry.reset();
    this.countryId = 0;
  };

  private submit(typeSubmitEnum: TypeSubmitEnum) {
    const data: Country = {
      ...this.formCountry.value,
    };
    const service = typeSubmitEnum == TypeSubmitEnum.CREATE 
      ? this.countryService.create(data) 
      : this.countryService.update(this.countryId, data);
    service.subscribe({
      next: (res) => {
        const message = typeSubmitEnum == TypeSubmitEnum.CREATE 
          ? MESSAGES.recordCreated 
          : MESSAGES.recordUpdated;
        this.helpersService.messageNotification(Severity.success, LABELS.ok, message, 3000);
        this.hideModal();
        this.reset();
      }, complete: () => {
        this.tableComponent().reload();
      }
    })
  };

}
