import { DatePipe } from '@angular/common';
import { Component, inject, signal } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { CategoriesService } from '@category/services/categories.service';
import { environment } from '@core/environments/environment.development';
import { DataCommon } from '@core/models/FieldsCommons';
import { CategoryResponse } from '@core/models/Category';
import { Enterprise } from '@core/models/Enterprise';
import { FlowStatusService } from '@core/services/flow-status.service';
import { HelpersService } from '@core/services/helpers.service';
import { EnterprisesService } from '@enterprise/services/enterprises.service';
import { TicketsService } from '@ticket-historical/services/tickets-.service';

@Component({
  selector: 'app-panel-filters',
  templateUrl: './panel-filters.component.html'
})
export class PanelFiltersComponent {

  private formBuilder = inject(FormBuilder);
  private helpersService = inject(HelpersService);
  private categoriesService = inject(CategoriesService);
  private enterpriseService = inject(EnterprisesService);
  private ticketService = inject(TicketsService);
  private flowStatusService = inject(FlowStatusService);
  private datePipe = inject(DatePipe);

  enterprises = signal<Enterprise[]>([]);
  flowStatus = signal<DataCommon[]>([]);
  categories = signal<CategoryResponse[]>([]);
  subCategories = signal<DataCommon[]>([]);
  maxDate: Date = new Date();
  activeIndex: number | number[] = 1;

  formTicket: FormGroup = this.formBuilder.group({
    enterpriseId: [],
    code: [],
    categoryId: [],
    subCategoryId: [],
    statusId: [],
    initialDate: [],
    endDate: []
  });

  ngOnInit() {
    this.getEnterprises();
    this.getCategories();
    this.getFlowStatus();
  };

  getEnterprises() {
    this.enterpriseService.search().subscribe({
      next: (res) => {
        this.enterprises.set(res);
      },
      error: (err) => {
        console.log(err);
        this.helpersService.messageNotification("error", 'Error', err.message, 3000);
      }
    });
  }

  getCategories() {
    this.categoriesService.search('categoria').subscribe({
      next: (res) => {
        this.categories.set(res);
      },
      error: (err) => {
        console.log(err);
        this.helpersService.messageNotification("error", 'Error', err.message, 3000);
      }
    });
  }

  getSubCategories( id: number ) {
    if (id) {
      this.categoriesService.detailByCategory( id ).subscribe({
        next: (res) => {
          this.subCategories.set(res.filter( dato => dato.code != null ));
        },
        error: (err) => {
          console.log(err);
          this.helpersService.messageNotification("error", 'Error', err.message, 3000);
        }
      });
    } else {
      this.subCategories.set([])
    }
  }

  getFlowStatus() {
    this.flowStatusService.listSelect( ).subscribe({
      next: (res) => {
        this.flowStatus.set(res);
      },
      error: (err) => {
        console.log(err);
        this.helpersService.messageNotification("error", 'Error', err.message, 3000);
      }
    });
  }

  sendParams() {
    this.activeIndex = 1;
    this.formTicket.value.initialDate = this.formTicket.value.initialDate? this.datePipe.transform(this.formTicket.value.initialDate, environment.formatDateSend): '';
    this.formTicket.value.endDate = this.formTicket.value.endDate? this.datePipe.transform(this.formTicket.value.endDate, environment.formatDateSend): '';
    this.formTicket.value.statusId = this.formTicket.value.statusId?? '';
    this.formTicket.value.subCategoryId = this.formTicket.value.subCategoryId?? '';
    this.formTicket.value.categoryId = this.formTicket.value.categoryId?? '';
    this.formTicket.value.code = this.formTicket.value.code?? '';
    this.formTicket.value.enterpriseId = this.formTicket.value.enterpriseId?? '';
    this.ticketService.eventFilterTickets.emit(this.formTicket.value);
  }
}
