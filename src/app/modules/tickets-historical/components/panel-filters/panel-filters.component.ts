import { DatePipe, NgClass } from '@angular/common';
import { Component, computed, DestroyRef, inject, OnInit, output, signal } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { CategoryService } from '@category/services/categories.service';
import { DataCommon } from '@core/models/FieldsCommons';
import { CategoryShort } from '@core/models/Category';
import { Enterprise } from '@core/models/Enterprise';
import { FlowStatusService } from '@core/services/flow-status.service';
import { EnterpriseService } from '@enterprise/services/enterprises.service';
import { FORMAT_DATE_SEND } from '@core/constants/format-date-time';
import { LABELS } from '@core/constants/labels';
import { ParameterService } from '@parameter/services/parameters.service';
import { IParameterSelect } from '@core/models/Parameter';
import { CredencialService } from '@core/services/credencial.service';
import { IFiltersTicketsHistorical } from '@core/interfaces/ticket.interface';
import { cleanObject } from '@core/utils/clean-object';
import { debounceTime, Subject, Subscription, takeUntil } from 'rxjs';
import { ICostCenter } from '@core/interfaces/cost-center.inteface.';
import { CostCenterService } from 'src/app/modules/cost-center/services/cost-center.service';
import { MESSAGES } from '@core/constants/messages';
import { FlowStatus } from '@core/interfaces/flow.interface';
import { PrimeModules } from '@shared/prime-components/prime-components.module';
import { FloatLabel } from "primeng/floatlabel"
import { FoldersParametersEnum } from '@core/enums/folder-parameters.enum';
import { LoginService } from '@core/services/login.service';
import { ROLES_CODE_SYSTEM } from '@core/enums/roles';
import { ICredentialUser } from '@core/interfaces/user.interface';
import { PLACEHOLDERS } from '@core/constants/placeholder';
import { COMMON } from '@core/constants/common';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

@Component({
    selector: 'app-panel-filters',
    templateUrl: './panel-filters.component.html',
    imports: [
    PrimeModules,
    ReactiveFormsModule,
    FloatLabel,
    NgClass
]
})
export class PanelFiltersComponent implements OnInit {

  readonly eventFilterTickets = output<IFiltersTicketsHistorical>();

  private formBuilder = inject(FormBuilder);
  private categoryService = inject(CategoryService);
  private enterpriseService = inject(EnterpriseService);
  private flowStatusService = inject(FlowStatusService);
  private credencialService = inject(CredencialService);
  private parameterService = inject(ParameterService);
  private costCenterService = inject(CostCenterService);
  private loginService = inject(LoginService);
  private datePipe = inject(DatePipe);
  private destroyRef = inject(DestroyRef);

  public readonly labels = LABELS;
  public readonly messages = MESSAGES;
  public readonly placeholders = PLACEHOLDERS;
  public enterprises = signal<Enterprise[]>([]);
  public flowStatus = signal<FlowStatus[]>([]);
  public categories = signal<CategoryShort[]>([]);
  public subCategories = signal<DataCommon[]>([]);
  public costCenters = signal<ICostCenter[]>([]);
  public maxDate: Date = new Date();
  public isTechnician: boolean = true;
  public activeIndex: number | number[] = 1;
  public priorities = signal<IParameterSelect[]>([]);
  public ticketTypes = signal<IParameterSelect[]>([]);
  public requesters = signal<ICredentialUser[]>([]);
  public technicians = signal<ICredentialUser[]>([]);
  public enterpriseHasCostCenter = signal<boolean>(false);
  private searchSubject = new Subject<string>();
  public isOnlyRequester = computed<boolean>(() => {
    if (this.loginService.rolesUser?.length > 0) {
      return this.loginService.haveSomeRole([ROLES_CODE_SYSTEM.ADMIN, ROLES_CODE_SYSTEM.LEADER, ROLES_CODE_SYSTEM.SUPERVISOR, ROLES_CODE_SYSTEM.TECHNICIAN, ROLES_CODE_SYSTEM.MONITOR])
    }
    return true;
  });
  public formTicket: FormGroup = this.formBuilder.group({
    code: [],
    title: [],
    description: [],
    createdFrom: [],
    initiatedFrom: [],
    resolvedFrom: [],
    closedFrom: [],
    enterpriseId: [],
    categoryIds: [{value: null, disabled: true}],
    costCenterId: [{value: null, disabled: true}],
    subCategoryIds: [{value: null, disabled: true}],
    ticketPriorityParameterId: [],
    ticketTypeParameterId: [],
    requesterCredentialId: [],
    technicianCredentialId: [],
    flowStatusId: [[]],
  });

  ngOnInit() {
    this.initData();
  };

  private initData() {
    this.getFlowStatus();
    this.getTypeTicketsAndPriorities();
    this.getUsers();
    this.getEnterprises();
  }

  public resetForm() {
    this.formTicket.reset();
    this.categories.set([]);
    this.subCategories.set([]);
    if (!this.isOnlyRequester()) {
      this.formTicket.patchValue({enterpriseId: this.loginService.enterpriseUserLogued().id})
      this.changedEnterprise();
    }
    this.sendParams();
  }

  private getEnterprises() {
    this.enterpriseService.select().subscribe({
      next: (res) => {
        this.enterprises.set(res);
      }, complete: () => {
        this.resetForm();
      }
    });
  }

  public changedEnterprise() {
    this.formTicket.get('categoryIds').reset();
    this.formTicket.get('subCategoryIds').reset();
    this.formTicket.get('costCenterId').reset();
    if (this.formTicket.value.enterpriseId) {
       this.getCategories();
       this.getCostCenters();
    } else {
      this.formTicket.get('categoryIds').disable();
      this.formTicket.get('subCategoryIds').disable();
      this.formTicket.get('costCenterId').disable();
      this.categories.set([]);
      this.subCategories.set([]);
      this.costCenters.set([]);
    }
  }

  private getCategories() {
    this.categoryService.getListCategoriesByEnterprise(this.formTicket.value.enterpriseId).subscribe({
      next: (res) => {
        this.categories.set(res);
        this.formTicket.get('categoryIds').enable();
      }
    });
  }
  
  private getCostCenters() {
    this.enterpriseHasCostCenter.set(this.enterprises().find(e => e.id == this.formTicket.value.enterpriseId).hasCostCenter) 
    if (this.enterpriseHasCostCenter()) {
      this.costCenterService.getByEnterprise(this.formTicket.value.enterpriseId).subscribe({
        next: (res) => {
          this.costCenters.set(res.map(costCenter => {
            return {
              ...costCenter,
              name: costCenter.code + ' - ' + costCenter.name
            }
          }));
          this.formTicket.get('costCenterId').enable();
        }
      });
    } else {
      this.formTicket.get('costCenterId').disable();
      this.costCenters.set([]);
    }
  }

  public getSubCategories() {
    this.formTicket.get('subCategoryIds').reset();
    if (this.formTicket.value.categoryIds.length > 0) {
      this.categoryService.getSubCategoriesByCategories(this.formTicket.value.enterpriseId, this.formTicket.value.categoryIds ).subscribe({
        next: (res) => {
          this.subCategories.set(res);
          this.formTicket.get('subCategoryIds').enable();
        }
      });
    } else {
      this.subCategories.set([]);
      this.formTicket.get('subCategoryIds').disable();
    }
  }

  private getFlowStatus() {
    this.flowStatusService.getSelect().subscribe({
      next: (res) => {
        this.flowStatus.set(res);
      }
    });
  }

  private getTypeTicketsAndPriorities() {
    this.parameterService.select([FoldersParametersEnum.TIPO_DE_TICKET, FoldersParametersEnum.PRIORIDAD]).subscribe({
       next: (res) => {
          this.ticketTypes.set(res.filter(p => p.folder == FoldersParametersEnum.TIPO_DE_TICKET));
          this.priorities.set(res.filter(p => p.folder == FoldersParametersEnum.PRIORIDAD));
       }
    });
  }

  public tryGetUsers(some: string, isTechnician: boolean) {
    this.isTechnician = isTechnician;
    if (some?.length >= 3) {
      this.searchSubject.next(some);
    }
  }

  private getUsers() {
    this.searchSubject.pipe(
      debounceTime(COMMON.inputDebounceDelay),
      takeUntilDestroyed(this.destroyRef)
    ).subscribe((some) => {
      this.credencialService.allUsers(some).subscribe({
        next: (res) => {
          this.isTechnician
            ? this.technicians.set(res)
            : this.requesters.set(res);
        }
      });
    });
  }

  public sendParams() {
    this.activeIndex = 1;
    const filters: IFiltersTicketsHistorical = { 
      ...this.formTicket.value,
      createdFrom: this.datePipe.transform(this.formTicket.value.createdFrom? this.formTicket.value.createdFrom[0]: null, FORMAT_DATE_SEND),
      createdTo: this.datePipe.transform(this.formTicket.value.createdFrom? this.formTicket.value.createdFrom[1]: null, FORMAT_DATE_SEND),
      initiatedFrom: this.datePipe.transform(this.formTicket.value.initiatedFrom? this.formTicket.value.initiatedFrom[0]: null, FORMAT_DATE_SEND),
      initiatedTo: this.datePipe.transform(this.formTicket.value.initiatedFrom? this.formTicket.value.initiatedFrom[1]: null, FORMAT_DATE_SEND),
      resolvedFrom: this.datePipe.transform(this.formTicket.value.resolvedFrom? this.formTicket.value.resolvedFrom[0]: null, FORMAT_DATE_SEND),
      resolvedTo: this.datePipe.transform(this.formTicket.value.resolvedFrom? this.formTicket.value.resolvedFrom[1]: null, FORMAT_DATE_SEND),
      closedFrom: this.datePipe.transform(this.formTicket.value.closedFrom? this.formTicket.value.closedFrom[0]: null, FORMAT_DATE_SEND),
      closedTo: this.datePipe.transform(this.formTicket.value.closedFrom? this.formTicket.value.closedFrom[1]: null, FORMAT_DATE_SEND),
    };
    const result: IFiltersTicketsHistorical = cleanObject(filters);
    this.eventFilterTickets.emit(result);
  }
}