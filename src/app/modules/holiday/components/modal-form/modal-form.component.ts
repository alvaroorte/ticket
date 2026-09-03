import { Component, inject, WritableSignal } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { HelpersService } from '@core/services/helpers.service';
import { noSpaceValidator } from '@core/validators/noSpaceValidator';
import { HolidayService } from '../../services/holiday.service';
import { Holiday } from '@core/models/holiday';
import { CountryService } from 'src/app/modules/country/services/country.service';
import { TerritorialDivisionService } from 'src/app/modules/territorial-division/services/territorial-division.service';
import { Country } from '@core/models/country';
import { TerritorialDivision } from '@core/models/territorial-division';
import { HolidayTypes } from '@core/enums/holiday-types.enum';
import { MESSAGES } from '@core/constants/messages';
import { LIMITS } from '@core/constants/limits';
import { regex } from '@core/constants/regexs';
import { LABELS } from '@core/constants/labels';
import { TypeSubmitEnum } from '@core/enums/type-submit';
import { Severity } from '@core/enums/severity';
import { MessageRequiredFieldComponent } from '../../../../shared/components/message-required-field/message-required-field.component';
import { HolidayModule } from '../../holiday.module';
@Component({
    selector: 'app-modal-form',
    templateUrl: './modal-form.component.html',
    imports: [MessageRequiredFieldComponent, HolidayModule]
})
export class ModalFormComponent {

  private formBuilder = inject(FormBuilder);
  private helpersService = inject(HelpersService);
  private holidayService = inject(HolidayService);
  private countryService = inject(CountryService);
  private territorialDivisionService = inject(TerritorialDivisionService);

  public readonly labels = LABELS;
  public readonly messages = MESSAGES;
  public holidayTypesEnum = HolidayTypes;
  public openModal = false;
  public titleForm = "";
  public countries: Country[] = [];
  public territorialDivisions: TerritorialDivision[] = [];
  public holidayTypes: string[] = [];
  private holidayId = 0;
  private tableComponent = this.holidayService.eventTableComponent;

  public formHoliday: FormGroup = this.formBuilder.group({
    id: [],
    day: [, [Validators.required, Validators.min(1), Validators.max(31)]],
    month: [, [Validators.required, Validators.min(1), Validators.max(12)]],
    year: [, [Validators.required, Validators.min(2024), Validators.max(2050)]],
    reason: [, [Validators.required, Validators.minLength(LIMITS.minLengthFive), Validators.pattern(regex.fieldName), noSpaceValidator]],
    holidayType: [, Validators.required],
    countryId: [],
    territorialDivisionId: [],
    dateHoliday: [, Validators.required],
  });
  

  ngOnInit() {
    this.holidayService.eventFormComponent.set(this);
    this.getCountries();
    this.getTerritorialDivisions();
    this.getHolidayTypes();
  };

  private getCountries() {
    this.countryService.getAll().subscribe({
      next: (res) => {
        this.countries = res;
      }
    })
  };
  
  private getHolidayTypes() {
    this.holidayService.getHolidayTypes().subscribe({
      next: (res) => {
        this.holidayTypes = res;
      }
    })
  };
  
  public changedTypeHoliday() {
    switch (this.formHoliday.value.holidayType) {
      case this.holidayTypesEnum.NACIONAL:
        this.getCountries();
        this.formHoliday.controls['territorialDivisionId'].clearValidators();
        this.formHoliday.controls['countryId'].setValidators(Validators.required);
        this.formHoliday.patchValue({ territorialDivisionId: null });
        break;
      case this.holidayTypesEnum.REGIONAL:
        this.getCountries();
        this.getTerritorialDivisions();
        this.formHoliday.controls['territorialDivisionId'].setValidators(Validators.required);
        this.formHoliday.controls['countryId'].setValidators(Validators.required);
        break;
      default:
        this.formHoliday.controls['territorialDivisionId'].clearValidators();
        this.formHoliday.controls['countryId'].clearValidators();
        this.formHoliday.patchValue({ territorialDivisionId: null, countryId: null });
        break;
    }
    this.formHoliday.controls['territorialDivisionId'].updateValueAndValidity();
    this.formHoliday.controls['countryId'].updateValueAndValidity();
  };
  
  public getTerritorialDivisions() {
    if (this.formHoliday.value.countryId) {
      this.territorialDivisionService.getByCountry(this.formHoliday.value.countryId).subscribe({
        next: (res) => {
          this.territorialDivisions = res;
        }
      })
    } else {
      this.territorialDivisions = [];
      this.formHoliday.patchValue({territorialDivisionId: null});
    }
  };

  public setDayMonthYear(date: Date) {
    this.formHoliday.patchValue({
      day: date.getDate(),
      month: date.getMonth() + 1,
      year: date.getFullYear()
    })
  };
  
  public hideModal() {
    this.openModal = false;
  };

  private getDateOfDAyMonthAndYear(day: number, month: number, year: number){
    return new Date(year, month - 1, day);
  };
 
  public openCreate(){
    this.reset();
    this.titleForm = "Nuevo feriado";
    this.formHoliday.patchValue({ holidayType: this.holidayTypesEnum.NINGUNO });
    this.openModal = true;
  };

  public openEdit(id: number ){
    this.reset();
    this.titleForm="Editar feriado";
    this.holidayService.getById(id).subscribe({
      next: (res) => {
        this.holidayId = res.id!;
        this.formHoliday.patchValue({
          ...res,
          dateHoliday: this.getDateOfDAyMonthAndYear(res.day, res.month, res.year)
        });
        this.openModal=true;
      }, complete: () => {
        this.changedTypeHoliday();
      }
    })
  };

  public saveHoliday() {
    if (this.formHoliday.valid ) {
      this.holidayId > 0? this.submit(TypeSubmitEnum.UPDATE): this.submit(TypeSubmitEnum.CREATE);
    }
  };

  private reset(): void {
    this.formHoliday.reset();
    this.holidayId = 0;
  };

  private submit(type: TypeSubmitEnum) {
    const data: Holiday = {
      ...this.formHoliday.value,
    };
    const service = type == TypeSubmitEnum.CREATE
      ? this.holidayService.create(data)
      : this.holidayService.update(this.holidayId, data)
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
