import { Component, EventEmitter, Output, inject, signal } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { DataCommon } from '@core/models/FieldsCommons';
import { Parameter } from '@core/models/Parameter';
import { HelpersService } from '@core/services/helpers.service';
import { EnterprisesService } from '@enterprise/services/enterprises.service';
import { EnterpriseCategoriesService } from '@enterpriseCategory/services/enterpriseCategories.service';
import { ParametersService } from '@parameter/services/parameters.service';
import { AccordionTab } from 'primeng/accordion';
import { ReportService } from '../../services/report.service';
import { DashboardSend } from '@core/models/Report';
import { ExcelService } from '@core/services/excel';
import { formatDate } from '@core/utils/format-value';
import { environment } from '@core/environments/environment.dev';
import { DatePipe } from '@angular/common';

@Component({
  selector: 'app-panel-filters',
  templateUrl: './panel-filters.component.html'
})
export class PanelFiltersComponent {

  @Output() getDashboardEvent = new EventEmitter();

  private formBuilder = inject(FormBuilder);
  private helpersService = inject(HelpersService);
  private enterpriseCategoryService = inject(EnterpriseCategoriesService);
  private enterpriseService = inject(EnterprisesService);
  private parameterService = inject(ParametersService);
  private reportService = inject(ReportService);
  private excelService = inject(ExcelService);
  private datePipe = inject(DatePipe);

  enterprises = signal<DataCommon[]>([]);
  categories = signal<DataCommon[]>([]);
  typeTickets = signal<Parameter[]>([]);
  titleHeader = signal<string>('Filtros');
  dashboardSend = signal(new DashboardSend);
  maxDate: Date = new Date();

  formReport: FormGroup = this.formBuilder.group({
    enterpriseId: [],
    categoryId: [],
    initialDate: [],
    endDate: [],
    tipoTicket: [],
  });

  ngOnInit() {
    this.setDates();
    this.getEnterprises();
    this.getTypeTickets();
  };

  private setDates() {
    const dateLastMonth = new Date().setMonth(new Date().getMonth()-3)
    this.formReport.patchValue({
      initialDate: new Date(dateLastMonth),
      endDate: new Date()
    });
  }

  getEnterprises() {
    this.enterpriseService.getByLeader().subscribe({
      next: (res) => {
        this.enterprises.set(res);

        if ( res.length > 0 ) {
          this.formReport.get('enterpriseId')?.setValue(res[0].id);
          this.titleHeader.set(res[0].name!);
          this.getCategories();
        }
      },
      error: (err) => {
        console.log(err);
        this.helpersService.messageNotification("error", 'Error', err.message, 3000);
      }
    });
  }

  getCategories() {
    if ( this.formReport.value.enterpriseId ) {
      this.enterpriseCategoryService.getByLeader(this.formReport.value.enterpriseId).subscribe({
        next: (res) => {
          this.categories.set(res);
          this.formReport.get('categoryId')?.setValue(res.map( category => category.id ));
          this.sendParams(null, null, false)
        },
        error: (err) => {
          console.log(err);
          this.helpersService.messageNotification("error", 'Error', err.message, 3000);
        }
      });
    } else {
      this.categories.set([]);
    }
  }

  getTypeTickets() {
    this.parameterService.searchMultiple('tipo de ticket').subscribe({
      next: (res) => {
        this.typeTickets.set(res);
      },
      error: (err) => {
        console.log(err);
        this.helpersService.messageNotification("error", 'Error', err.message, 3000);
      }
    });
  }
  sendParams(tab: AccordionTab | null, event: MouseEvent | KeyboardEvent | any, downloadExcel: boolean) {
    this.dashboardSend.set({
      initialDate: (this.formReport.value.initialDate)? formatDate(this.formReport.value.initialDate): '',
      endDate: (this.formReport.value.endDate)? formatDate(this.formReport.value.endDate): '',
      enterpriseId: this.formReport.value.enterpriseId?? '',
      tipoTicket: (this.formReport.value.tipoTicket && this.formReport.value.tipoTicket.length > 0)? this.formReport.value.tipoTicket.join(','): '',
      categoryId: (this.formReport.value.categoryId && this.formReport.value.categoryId.length > 0)? this.formReport.value.categoryId.join(','): ''
    });
    const dates: string = ', del: ' + this.datePipe.transform(this.formReport.value.initialDate, environment.formatDate) + ' al: ' + this.datePipe.transform(this.formReport.value.endDate, environment.formatDate);
    this.dashboardSend().enterpriseId?
        this.titleHeader.set(this.enterprises().find( enterprise => enterprise.id as number == parseInt(this.dashboardSend().enterpriseId) )?.name + dates)  :
        this.titleHeader.set('Filtros');
    downloadExcel? this.downloadExcel(): this.getDashboard();
    tab?.toggle(event);
  }

  downloadExcel() {
      this.reportService.listInformationSystem(this.dashboardSend()).subscribe({
        next: (res) => {
          let textEnterprise: string[] = [];
          if (this.formReport.value.enterpriseId) {
                let enterprise = this.enterprises().find( enterprise => enterprise.id == this.formReport.value.enterpriseId);
                textEnterprise.push(enterprise!.name!);
          }
          let textCategory: string[] = [];
          if (this.formReport.value.categoryId) {
            this.formReport.value.categoryId.forEach( (catId: number) => {
              if ( this.categories().find( category => category.id == catId ) ) {
                let category = this.categories().find( category => category.id == catId);
                textCategory.push(category!.name!);
              }
            });
          }

          this.excelService.downloadExcel(res, this.formReport , textEnterprise, textCategory)
        },
        error: (err) => {
          console.log(err);
          this.helpersService.messageNotification("error", 'Error', err.message, 3000);
        }
      });
    }

  getDashboard() {
    this.getDashboardEvent.emit(this.dashboardSend());
  }
}
