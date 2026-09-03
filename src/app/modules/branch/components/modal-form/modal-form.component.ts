import { Component, computed, inject, signal, input } from '@angular/core';
import { FormBuilder, FormGroup, Validators, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HelpersService } from '@core/services/helpers.service';
import { BranchService } from '../../services/branch.service';
import { Branch, BranchWithSchedule } from '@core/interfaces/branch.interface';
import { noSpaceValidator } from '@core/validators/noSpaceValidator';
import { Country } from '@core/models/country';
import { CountryService } from 'src/app/modules/country/services/country.service';
import { TerritorialDivisionService } from 'src/app/modules/territorial-division/services/territorial-division.service';
import { TerritorialDivision } from '@core/models/territorial-division';
import { Schedule } from '@core/models/schedule';
import { ScheduleDetailService } from 'src/app/modules/schedule-detail/services/schedule-detail.service';
import { ScheduleDetail } from '@core/interfaces/schedule-detail.interface';
import { ScheduleService } from 'src/app/modules/schedule/services/schedule.service';
import { Severity } from '@core/enums/severity';
import { SchedulePojo } from '@core/interfaces/schedule.interface';
import { MESSAGES } from '@core/constants/messages';
import { LIMITS } from '@core/constants/limits';
import { regex } from '@core/constants/regexs';
import { LABELS } from '@core/constants/labels';
import { TypeSubmitEnum } from '@core/enums/type-submit';
import { MessageRequiredFieldComponent } from '../../../../shared/components/message-required-field/message-required-field.component';
import { NgStyle } from '@angular/common';
import { GanttForHoursOfWeekComponent } from '../../../../shared/components/gantt-for-hours-of-week/gantt-for-hours-of-week.component';
import { BranchModule } from '../../branch.module';
import { IGenericModalForm } from '@core/interfaces/generic-modal-form.interface';

@Component({
    selector: 'app-modal-form',
    templateUrl: './modal-form.component.html',
    imports: [MessageRequiredFieldComponent, NgStyle, GanttForHoursOfWeekComponent, BranchModule]
})
export class ModalFormComponent implements IGenericModalForm {

  readonly enterpriseId = input.required<number>();

  private formBuilder = inject(FormBuilder);
  private helpersService = inject(HelpersService);
  private branchService = inject(BranchService);
  private countryService = inject(CountryService);
  private territorialDivisionService = inject(TerritorialDivisionService);
  private scheduleService = inject(ScheduleService);
  private scheduleDetailService = inject(ScheduleDetailService);

  public readonly labels = LABELS;
  public readonly messages = MESSAGES;
  private branchId = 0;
  public openModal = false;
  public titleForm = "";
  public countries: Country[] = [];
  public schedules: Schedule[] = [];
  public selectedSchedules: SchedulePojo[] = [];
  public territorialDivisions: TerritorialDivision[] = [];
  public scheduleDetails: ScheduleDetail[] = [];
  public activeIndex = signal<number>(1);
  public labelButtonTab = computed(() => {
    return this.activeIndex() == 2? this.labels.previus: this.labels.next
  })
  public iconButtonTab = computed(() => {
    return this.activeIndex() == 2? "pi pi-angle-left": "pi pi-angle-right"
  })
  private tableComponent = this.branchService.eventTableComponent;

  public formBranch: FormGroup = this.formBuilder.group({
    id: [],
    name: ['', [Validators.required, Validators.minLength(LIMITS.minLengthFive), Validators.pattern(regex.fieldName), noSpaceValidator]],
    location: [, [Validators.required, Validators.minLength(LIMITS.minLengthFive), Validators.pattern(regex.fieldName), noSpaceValidator]],
    enterpriseId: [, Validators.required],
    countryId: [, Validators.required],
    territorialDivisionId: [, Validators.required],
    scheduleIds: [, Validators.required],
    scheduleId: []
  });

  ngOnInit() {
    this.branchService.eventFormComponent.set(this);
  };

  private getSchedules() {
    this.scheduleService.getAll().subscribe({
      next: (res) => {
        this.schedules = res;
      }
    })
  };
  
  private getCountries() {
    this.countryService.getAll().subscribe({
      next: (res) => {
        this.countries = res;
      }
    })
  };

  public getTerritorialDivisions() {
    if (this.formBranch.value.countryId) {
      this.territorialDivisionService.getByCountry(this.formBranch.value.countryId).subscribe({
        next: (res) => {
          this.territorialDivisions = res;
        }
      })
    } else {
      this.territorialDivisions = [];
      this.formBranch.patchValue({territorialDivisionId: null});
    }
  };
  
  public getScheduleDetail() {
    if (this.formBranch.value.scheduleId) {
      this.scheduleDetailService.getBySchedule(this.formBranch.value.scheduleId.id).subscribe({
        next: (res) => {
          this.scheduleDetails = res;
        }
      })
    } else {
      this.scheduleDetails = [];
    }
  };
 
  public hideModal() {
    this.openModal = false;
  };
  
  public changeIndexTab() {
    this.activeIndex.set(this.activeIndex() == 1? 2: 1);
    this.resetScheduleDropdown();
  };
  
  public addSchedule() {
    if (this.formBranch.value.scheduleId) {
      if ( !this.selectedSchedules.find((item) => item.scheduleId == this.formBranch.value.scheduleId.id) ) {
        this.selectedSchedules.push({
          scheduleId: this.formBranch.value.scheduleId.id,
          scheduleName: this.formBranch.value.scheduleId.name
        });
      }
      this.resetScheduleDropdown();
      this.updateScheduleIdsinForm();
    } else {
      this.helpersService.messageNotification(Severity.warn, "Por favor", "Seleccione un horario.")
    }
  }

  public removeSchedule(id: number) {
    this.selectedSchedules = [...this.selectedSchedules.filter((item) => item.scheduleId !== id)];
    this.updateScheduleIdsinForm();
  }

  private resetScheduleDropdown() {
    this.scheduleDetails = [];
    this.formBranch.patchValue({scheduleId: null});
  }

  private updateScheduleIdsinForm() {
    this.formBranch.patchValue({
      scheduleIds: this.selectedSchedules.map( schedule => schedule.scheduleId)
    })
  }

  public openCreate(){
    this.reset();
    this.getCountries();
    this.getSchedules();
    this.titleForm = "Nueva sucursal";
    this.formBranch.patchValue({ enterpriseId: this.enterpriseId() });
    this.openModal = true;
  };

  public openEdit(id: number ){
    this.reset();
    this.getCountries();
    this.getSchedules();
    this.titleForm = "Editar sucursal";
    this.branchService.getById(id).subscribe({
      next: (res) => {
        this.branchId = res.id;
        this.openModal = true;
        this.updateFormValues(res)
      }
    })
  };

  private updateFormValues(branch: BranchWithSchedule) {
    this.formBranch.patchValue(branch);
    this.getTerritorialDivisions();
    this.selectedSchedules = branch.schedulesAssignedToAbranch;
    this.updateScheduleIdsinForm();
  }

  public save() {
    if (this.formBranch.valid ) {
      this.branchId > 0 ? this.submit(TypeSubmitEnum.UPDATE) : this.submit(TypeSubmitEnum.CREATE);
    }
  };

  private reset(): void {
    this.activeIndex.set(1);
    this.selectedSchedules = [];
    this.formBranch.reset();
    this.resetScheduleDropdown();
    this.territorialDivisions = [];
    this.branchId = 0;
  };

  private submit(type: TypeSubmitEnum) {
    const data: Branch = {
      ...this.formBranch.value,
    };
    const service = type == TypeSubmitEnum.CREATE
      ? this.branchService.create(data)
      : this.branchService.update(this.branchId, data);
    service.subscribe({
      next: () => {
        const message = type == TypeSubmitEnum.CREATE
          ? MESSAGES.recordCreated
          : MESSAGES.recordUpdated;
        this.helpersService.messageNotification(Severity.success, "Correcto", message, 3000);
        this.hideModal();
        this.reset();
      }, complete: () => {
        this.tableComponent().reload();
      }
    });
  };
}
