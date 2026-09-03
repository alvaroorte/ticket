import { Component, computed, inject, signal } from '@angular/core';

import { DataTicket } from '@core/interfaces/ticket.interface';
import { TicketSend } from '@core/models/Ticket';
import { TicketService } from '@ticket-historical/services/tickets.service';
import { FileService } from '@core/services/file-service.service';
import { Router } from '@angular/router';
import { TYPE_VIEW_LIST_TICKET } from '@core/constants/ticket-view-type';
import { HelpersService } from '@core/services/helpers.service';
import { Severity } from '@core/enums/severity';
import { switchMap } from 'rxjs';
import { LABELS } from '@core/constants/labels';
import { MESSAGES } from '@core/constants/messages';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { ParameterService } from '@parameter/services/parameters.service';
import { CredencialService } from '@core/services/credencial.service';
import { CategoryService } from '@category/services/categories.service';
import { EnterpriseService } from '@enterprise/services/enterprises.service';
import { IncidentTitleService } from '../incident-title/services/incident-title.service';
import { CostCenterService } from '../cost-center/services/cost-center.service';
import { TeamService } from '@team/services/teams.service';
import { ObserverGroupService } from '../observer-group/services/observer-group.service';
import { DatePipe, NgClass } from '@angular/common';
import { ModeInputFile } from '@core/enums/file.enum';
import { fileTypeAllowed } from '@core/constants/file';
import { SubcategoryShort } from '@core/models/Category';
import { technicianShort } from '@core/models/Team';
import { Enterprise } from '@core/models/Enterprise';
import { ICostCenter } from '@core/interfaces/cost-center.inteface.';
import { IncidentTitle } from '@core/interfaces/incident-title';
import { ObserverGroup } from '@core/interfaces/observer-group.inteface.';
import { IParameterSelect } from '@core/models/Parameter';
import { LIMITS } from '@core/constants/limits';
import { FoldersParametersEnum } from '@core/enums/folder-parameters.enum';
import { removeTextIntoParentheses } from '@core/utils/format-value';
import { SliderChangeEvent } from 'primeng/slider';
import { AutoCompleteCompleteEvent } from 'primeng/autocomplete';
import { filterOfArrayByFields } from '@core/utils/filter-by-fields';
import { PrimeModules } from '@shared/prime-components/prime-components.module';
import { InputFileComponent } from '@shared/components/input-file/input-file.component';
import { MultiSelectGenericUsersComponent } from '@shared/components/multi-select-generic-users/multi-select-generic-users.component';
import { MessageRequiredFieldComponent } from '@shared/components/message-required-field/message-required-field.component';
import { FORMAT_DATE_TIME_SEND } from '@core/constants/format-date-time';

@Component({
  selector: 'app-ticket-incident',
  imports: [
    PrimeModules, 
    ReactiveFormsModule, 
    InputFileComponent, 
    FormsModule, 
    MultiSelectGenericUsersComponent,
    MessageRequiredFieldComponent,
    NgClass
  ],
  templateUrl: './ticket-incident.component.html'
})
export class TicketIncidentComponent {

  private formBuilder = inject(FormBuilder);
  private parameterService = inject(ParameterService);
  private credencialService = inject(CredencialService);
  private categoryService = inject(CategoryService);
  private enterpriseService = inject(EnterpriseService);
  private incidentTitleService = inject(IncidentTitleService);
  private costCenterService = inject(CostCenterService);
  private teamService = inject(TeamService);
  private observerGroupService = inject(ObserverGroupService);
  private datePipe = inject(DatePipe);
  private ticketService = inject(TicketService);
  private fileService = inject(FileService);
  private helpersService = inject(HelpersService);
  private router = inject(Router);
  
  public readonly labels = LABELS;
  public readonly messages = MESSAGES;
  public readonly modeInputFile = ModeInputFile;
  public readonly maxDate = new Date();
  public readonly allowedFormats: string = `${fileTypeAllowed.allowedImageFormat},${fileTypeAllowed.allowedOfficeFormat},${fileTypeAllowed.allowedCompressedFormat},${fileTypeAllowed.allowedOtherFormats}`;
  public hasCostCenter = signal<boolean>(false);
  public subcategories: SubcategoryShort[] = [];
  public technicians: technicianShort[] = [];
  public enterprises: Enterprise[] = [];
  public costCenters: ICostCenter[] = [];
  public incidentTitles: IncidentTitle[] = [];
  public incidentTitlesfiltered: string[] = [];
  public observerGroups: ObserverGroup[] = [];
  public enterpriseSelectedId = signal<number>(null);
  public priorities = signal<IParameterSelect[]>([]);
  public positionPriority = signal<number>(0);
  public showObserverGroups: boolean = false;
  private fileUploaded: File;
  public labelInputSlider = computed(() => {
      if (this.priorities().length > 0) {
          return this.priorities()[this.positionPriority()].value
      }
      return "";
  });
  public formTicket: FormGroup = this.formBuilder.group({
      title: ['', Validators.required],
      ticketPriorityParameterId: [],
      description: [, [Validators.required, Validators.minLength(LIMITS.minLengthFive)]],
      incidentStartDate: [],
      incidentEndDate: [],
      ubication: [],
      phone: [],
      credentialApproverId: [],
      credentialObserverId: [],
      enterpriseId: [, [Validators.required]],
      categoryId: [, [Validators.required]],
      subCategoryId: [, [Validators.required]],
      credentialRequesterId: [],
      technicianCredentialId: [null, Validators.required],
      costCenterId: [],
      isIncident: [true],
  });
  
  ngOnInit(): void {
      this.getCredentialComplement();
      this.setDataTicket();
      this.getPriorities();
      this.getEnterprises();
      this.getIncidentTiles();
  }

  private setDataTicket() {
      this.formTicket.patchValue({
          isIncident: true,
      });
  }

  private getPriorities() {
      this.parameterService.select([FoldersParametersEnum.PRIORIDAD]).subscribe({
          next: (res) => {
              res.sort((a, b) => a.ranking - b.ranking);
              this.priorities.set(res);
              setTimeout(() => {
                  this.formTicket.patchValue({ ticketPriorityParameterId: 0 });
              }, 200);
          }
      });
  }

  private getEnterprises() {
      this.enterpriseService.select().subscribe({
          next: (res) => {
              this.enterprises = res;
          }
      })
  }
  
  private getIncidentTiles() {
      this.incidentTitleService.getAll().subscribe({
          next: (res) => {
              this.incidentTitles = res;
          }
      })
  }

  public onChangedEnterprise() {
      this.getCategoryIncidentByEnterprise();
      this.getObserverGroups();
      this.hasCostCenter.set(this.enterprises.find(e => e.id == this.enterpriseSelectedId()).hasCostCenter);
      if (this.hasCostCenter()) {
          this.getCostCenters();
          this.formTicket.get('costCenterId').setValidators(Validators.required);
      } else {
          this.formTicket.get('costCenterId').clearValidators();
      }
      this.formTicket.get('costCenterId').reset();
  }

  private getCategoryIncidentByEnterprise() {
      this.categoryService.getCategoryIncidentByEnterprise(this.enterpriseSelectedId()).subscribe({
          next: (res) => {
              if ( res.length > 0 ) {
                  this.formTicket.patchValue({ 
                      categoryId: res[0].id,
                      enterpriseId: this.enterpriseSelectedId()
                  });
                  this.subcategories = res[0].subCategories.map( subCategory => {
                      return {
                          ...subCategory,
                          name: removeTextIntoParentheses(subCategory.name)
                      };
                  });
                  this.getTechniciansForIncident();
              }
          }
      })
  }

  private getCostCenters() {
      this.costCenterService.getSelectByEnterprise(this.enterpriseSelectedId()).subscribe({
          next: (res) => {
              this.costCenters = res.map(costCenter => {
                  return {
                      ...costCenter,
                      name: costCenter.code + ' - ' + costCenter.name
                  }
              });
          }
      })
  }

  public changeInputSlider( event: SliderChangeEvent ) {
      this.positionPriority.set(parseInt((event.value / (101/this.priorities().length)).toString()));
      if ( document.querySelector('.p-slider-range') ) {
          const slider: HTMLElement = document.querySelector('.p-slider-range');
          slider.style.backgroundColor = this.priorities()[this.positionPriority()].color;

          const sliderRound: HTMLElement = document.querySelector('.p-slider-handle');
          sliderRound.style.backgroundColor = this.priorities()[this.positionPriority()].color;
      }
  }

  private getCredentialComplement() {
      this.credencialService.credentialComplement().subscribe({
          next: (res) => {
              res.phone = res.phone? res.phone: null;
              this.formTicket.patchValue({...res});
          }
      });
  }

  public loadFile(dataFile: File) {
      this.fileUploaded = dataFile;
  }

  public setTitle(event: AutoCompleteCompleteEvent) {
      this.incidentTitlesfiltered = filterOfArrayByFields(event.query, this.incidentTitles, ['title']).map((incidentTitle: IncidentTitle) => incidentTitle.title);
  }
  
  private getTechniciansForIncident() {
      this.teamService.getOma(this.enterpriseSelectedId()).subscribe({
          next: (res) => {
              this.technicians = res;
          }
      });
  }

  private getObserverGroups() {
      this.showObserverGroups = false;
      this.observerGroupService.getByEnterpriseId(this.enterpriseSelectedId()).subscribe({
          next: (res) => {
              this.observerGroups = res;
          }
      });
  }

  public resetCredentialObserverId() {
      this.formTicket.patchValue({ credentialObserverId: [] })
  }

  public setCredentialsId(ids: number[]) {
      this.formTicket.patchValue({ credentialObserverId: ids })
  }
  
  public getCredencialIdsOfObserverGroup(observer: ObserverGroup) {
      this.formTicket.patchValue({ credentialObserverId: observer.observers.map(o => o.credentialId) })
  }

  public setRequester(requesterId: number) {
      this.formTicket.patchValue({credentialRequesterId: requesterId})
  }

  public getBodyForCreateTicket(): DataTicket{
      return {
          values: {
              ...this.formTicket.value,
              title: this.formTicket.value.title?.trim()? this.formTicket.value.title: null,
              description: this.formTicket.value.description.split('&nbsp;').join(' '),
              phone: this.formTicket.value.phone?.toString(),
              ubication: this.formTicket.value.ubication? this.formTicket.value.ubication: null,
              ticketPriorityParameterId: this.priorities()[this.positionPriority()].id,
              incidentStartDate: this.formTicket.value.incidentStartDate? this.datePipe.transform(this.formTicket.value.incidentStartDate, FORMAT_DATE_TIME_SEND): null,
              incidentEndDate: this.formTicket.value.incidentEndDate? this.datePipe.transform(this.formTicket.value.incidentEndDate, FORMAT_DATE_TIME_SEND): null,
          },
          file: this.fileUploaded
      };
  };

  public saveTicket() {
      this.fileUploaded
          ? this.saveWithAttachment()
          : this.createTicket();
  }

  private saveWithAttachment() {
    const body: FormData = this.fileService.getDataForUploadFile(this.fileUploaded, this.getBodyForCreateTicket().values.title);
    this.fileService.upload(body).pipe(
      switchMap((resp) => {
        const data: TicketSend = { ...this.getBodyForCreateTicket().values, attachmentId: resp.id };
        return this.ticketService.createIncident(data);
      })
    ).subscribe({
      next: () => this.onTicketCreated()
    });
  }

  private createTicket() {
    const data: TicketSend = { ...this.getBodyForCreateTicket().values };
    this.ticketService.createIncident(data).subscribe({
      next: () => { this.onTicketCreated() }
    })
  }

  private onTicketCreated() {
    this.helpersService.messageNotification(Severity.success, LABELS.ok, MESSAGES.recordCreated);
    this.router.navigateByUrl(`/tickets/${TYPE_VIEW_LIST_TICKET.myTicket}`);
  }

}