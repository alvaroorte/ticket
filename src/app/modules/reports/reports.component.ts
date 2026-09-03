import { DatePipe, NgClass } from '@angular/common';
import { Component, inject, OnDestroy, OnInit, signal } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { CategoryService } from '@category/services/categories.service';
import { COMMON } from '@core/constants/common';
import { FORMAT_DATE_SEND } from '@core/constants/format-date-time';
import { LABELS } from '@core/constants/labels';
import { PLACEHOLDERS } from '@core/constants/placeholder';
import { TYPE_REPORT_DROPDOWN_OPTIONS } from '@core/constants/report';
import { MimeTypeEnum } from '@core/enums/mime-type';
import { CodeReportsEnum, TypeReportsEnum } from '@core/enums/type-reports';
import { AttachmenReport, IFiltersReport } from '@core/interfaces/reports.interface';
import { ICredentialUser } from '@core/interfaces/user.interface';
import { CategoryShort, SubcategoryShort } from '@core/models/Category';
import { Enterprise } from '@core/models/Enterprise';
import { CredencialService } from '@core/services/credencial.service';
import { FileService } from '@core/services/file-service.service';
import { ReportsService } from '@core/services/reports.service';
import { EnterpriseService } from '@enterprise/services/enterprises.service';
import { MessageRequiredFieldComponent } from '@shared/components/message-required-field/message-required-field.component';
import { PrimeModules } from '@shared/prime-components/prime-components.module';
import { debounceTime, filter, Observable, Subject, switchMap, takeUntil } from 'rxjs';

@Component({
  selector: 'app-reports',
  imports: [MessageRequiredFieldComponent, PrimeModules, ReactiveFormsModule, FormsModule, NgClass],
  templateUrl: './reports.component.html',
  styles: ``
})
export class ReportsComponent implements OnInit, OnDestroy {

  private enterpriseService = inject(EnterpriseService);
  private categoryService = inject(CategoryService);
  private credencialService = inject(CredencialService);
  private reportsService = inject(ReportsService);
  private fileService = inject(FileService);
  private datePipe = inject(DatePipe);
  private formBuilder = inject(FormBuilder);

  public readonly labels = LABELS;
  public readonly placeholders = PLACEHOLDERS;
  public readonly codeReportsEnum = CodeReportsEnum;
  public readonly TypeReportsDropdownOptions = TYPE_REPORT_DROPDOWN_OPTIONS;
  public selectedTypeReport: CodeReportsEnum;
  public enterprises = signal<Enterprise[]>([]);
  public categories = signal<CategoryShort[]>([]);
  public subcategories = signal<SubcategoryShort[]>([]);
  public technicians = signal<ICredentialUser[]>([]);
  public maxDate: Date = new Date();
  private searchSubject = new Subject<string>();
  private destroy$ = new Subject<void>();
  public dates: Date[];
  public formReport: FormGroup = this.formBuilder.group({
    enterpriseId: [null as number],
    categoryIds: [[] as number[]],
    subCategoryIds: [[] as number[]],
    technicianCredentialId: [null as number],
    createdFrom: [null as Date],
    createdTo: [null as Date]
  });

  ngOnInit(): void {
    this.getEnterprises();
    this.getUsers();
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  private getUsers() {
    this.searchSubject.pipe(
      debounceTime(COMMON.inputDebounceDelay),
      switchMap(some => this.credencialService.allUsers(some)),
      takeUntil(this.destroy$)
    ).subscribe({
        next: (res) => {
          this.technicians.set(res);
        }
    });
  }
  
  public tryGetUsers(some: string) {
    if (some?.length >= 3) {
      this.searchSubject.next(some);
    } else {
      this.technicians.set([]);
    }
  }

  public onChangedTypeReport() {
    this.formReport.get('technicianCredentialId').clearValidators();
    this.formReport.get('enterpriseId').clearValidators();
    this.formReport.get('createdFrom').clearValidators();
    this.formReport.get('createdTo').clearValidators();
    switch (this.selectedTypeReport) {
      case CodeReportsEnum.TECHNICIAN:
        this.formReport.get('technicianCredentialId').addValidators([Validators.required]);
        this.formReport.get('enterpriseId').addValidators([Validators.required]);
        this.formReport.get('createdFrom').addValidators([Validators.required]);
        this.formReport.get('createdTo').addValidators([Validators.required]);
        break;
      case CodeReportsEnum.ALERTS_EVENTS:
        break;
    
      default:
        this.formReport.get('enterpriseId').addValidators([Validators.required]);
        this.formReport.get('createdFrom').addValidators([Validators.required]);
        this.formReport.get('createdTo').addValidators([Validators.required]);
        break;
    }
    this.formReport.get('technicianCredentialId').updateValueAndValidity();
    this.formReport.get('enterpriseId').updateValueAndValidity();
    this.formReport.get('createdFrom').updateValueAndValidity();
    this.formReport.get('createdTo').updateValueAndValidity();
    this.dates = null;
  }

  private getEnterprises() {
    this.enterpriseService.select().subscribe({
      next: (res) => {
        this.enterprises.set(res);
      }
    })
  }

  public getCategoriesByEnterprise(): void {
    this.formReport.get('categoryIds').reset();
    this.formReport.get('subCategoryIds').reset();
    this.categories.set([]);
    this.subcategories.set([]);
    this.categoryService.getListCategoriesByEnterprise(this.formReport.value.enterpriseId).subscribe({
      next: (res: CategoryShort[]) => {
          this.categories.set(res);
      }
    });
  }
  
  public getSubCategoriesByCategories(): void {
    this.formReport.patchValue({ subCategoryIds: null });
    if (this.formReport.value.categoryIds.length > 0) {
      this.categoryService.getSubCategoriesByCategories(this.formReport.value.enterpriseId, this.formReport.value.categoryIds).subscribe({
        next: (res: SubcategoryShort[]) => {
            this.subcategories.set(res);
        }
      });
    } else {
        this.subcategories.set([]);
    }
  }

  public setDates() {
    this.formReport.patchValue({
      createdFrom: this.datePipe.transform(this.dates[0], FORMAT_DATE_SEND) ,
      createdTo: this.datePipe.transform(this.dates[1]?? null, FORMAT_DATE_SEND)
    });
  }

  public getReport() {
    const filters: IFiltersReport = {
        ...this.formReport.value,
        reportCode: this.selectedTypeReport,
        reportType: TypeReportsEnum.EXCEL
    };
    if (!filters.categoryIds) delete filters.categoryIds;
    if (!filters.createdFrom) delete filters.createdFrom;
    if (!filters.createdTo) delete filters.createdTo;
    if (!filters.subCategoryIds) delete filters.subCategoryIds;
    if (!filters.enterpriseId) delete filters.enterpriseId;
    if (!filters.technicianCredentialId) delete filters.technicianCredentialId;
    const service: Observable<AttachmenReport> = this.getService(filters);
    service?.subscribe({
      next: (resp) => {
        const file: File = this.fileService.convertBase64ToFile(resp.file, resp.name, MimeTypeEnum.EXCEL);
        this.fileService.downloadFile(file, resp.name);
      },
    })
  }

  private getService(filters: IFiltersReport): Observable<AttachmenReport> {
    switch (this.selectedTypeReport) {
      case CodeReportsEnum.TOTALS:
        return this.reportsService.generatereportTotals(filters);
      case CodeReportsEnum.SUBCATEGORYTOTALS:
        return this.reportsService.generatereportSubcategoryTotals(filters);
      case CodeReportsEnum.TECHNICIAN:
        return this.reportsService.generatereportTechnician(filters);
      case CodeReportsEnum.ALERTS_EVENTS:
        return this.reportsService.generatereportAlertsEvents(filters);
      default:
        return null;
    }
  }

}
