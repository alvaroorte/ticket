
import { Component, OnInit, inject, signal, input, output } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { HelpersService } from '@core/services/helpers.service';
import { PrimeModules } from '@shared/prime-components/prime-components.module';
import { InputFileComponent } from '../input-file/input-file.component';
import { CredencialService } from '@core/services/credencial.service';
import { DataTicket } from '@core/interfaces/ticket.interface';
import { CategoryShort, SubcategoryShort } from '@core/models/Category';
import { CategoryService } from '@category/services/categories.service';
import { removeTextIntoParentheses } from '@core/utils/format-value';
import { LABELS } from '@core/constants/labels';
import { fileTypeAllowed } from '@core/constants/file';
import { ModeInputFile } from '@core/enums/file.enum';
import { ICostCenter } from '@core/interfaces/cost-center.inteface.';
import { CostCenterService } from 'src/app/modules/cost-center/services/cost-center.service';
import { EnterpriseCategoryService } from '@enterpriseCategory/services/enterpriseCategories.service';
import { EnterpriseCategorySubcategory, ApproverModeratorShortEnterpriseCategory } from '@core/models/EnterpriseCategory';
import { LIMITS } from '@core/constants/limits';
import { MESSAGES } from '@core/constants/messages';
import { NgClass } from '@angular/common';
import { MultiSelectGenericUsersComponent } from '../multi-select-generic-users/multi-select-generic-users.component';
import { ObserverGroupService } from 'src/app/modules/observer-group/services/observer-group.service';
import { ObserverGroup } from '@core/interfaces/observer-group.inteface.';
import { SelectGenericUsersComponent } from '../select-generic-users/select-generic-users.component';
import { TypeCreateTicketEnum } from '@core/enums/ticket-create.enum';
import { LoginService } from '@core/services/login.service';
import { ROLES_CODE_SYSTEM } from '@core/enums/roles';
import { MessageRequiredFieldComponent } from '../message-required-field/message-required-field.component';
import { Severity } from '@core/enums/severity';
import { DropdownCommonInterface } from '@core/interfaces/dropdow-common.interface';
import { SelectButtonOptionClickEvent } from 'primeng/selectbutton';

@Component({
    selector: 'app-form-ticket-requester',
    imports: [
        PrimeModules, 
        ReactiveFormsModule, 
        InputFileComponent, 
        FormsModule, 
        MultiSelectGenericUsersComponent,
        SelectGenericUsersComponent,
        MessageRequiredFieldComponent,
        NgClass
    ],
    templateUrl: './form-ticket-requester.component.html'
})
export class FormTicketRequesterComponent implements OnInit {

    readonly enterpriseId = input.required<number>();
    readonly enterpriseName = input.required<string>();
    readonly hasCostCenter = input.required<boolean>();
    readonly category = input.required<CategoryShort>();
    readonly saveTicket = output<DataTicket>();

    private formBuilder = inject(FormBuilder);
    private credencialService = inject(CredencialService);
    private categoryService = inject(CategoryService);
    private enterpriseCategoryService = inject(EnterpriseCategoryService);
    private costCenterService = inject(CostCenterService);
    private observerGroupService = inject(ObserverGroupService);
    private helpersService = inject(HelpersService);
    private loginService = inject(LoginService);
    
    public readonly labels = LABELS;
    public readonly messages = MESSAGES;
    public readonly modeInputFile = ModeInputFile;
    public readonly TypeCreateTicketEnum = TypeCreateTicketEnum;
    public readonly allowedFormats: string = `${fileTypeAllowed.allowedImageFormat},${fileTypeAllowed.allowedOfficeFormat},${fileTypeAllowed.allowedCompressedFormat},${fileTypeAllowed.allowedOtherFormats}`;
    public subcategories = signal<SubcategoryShort[]>([]);
    public costCenters = signal<ICostCenter[]>([]);
    public approvers = signal<ApproverModeratorShortEnterpriseCategory[]>([]);
    public observerGroups = signal<ObserverGroup[]>([]);
    public showObserverGroups = signal<boolean>(false);
    public haveRoleForCreateTicketForSomebodyElse = signal<boolean>(false);
    private isFieldDescriptionValid: boolean = false;
    private fileUploaded: File;
    public typeCreateticket = signal<TypeCreateTicketEnum>(TypeCreateTicketEnum.FOR_ME);
    public readonly optionsOfView: DropdownCommonInterface[] = [
        { label: this.labels.createTicket, value: TypeCreateTicketEnum.FOR_ME },
        { label: this.labels.createTicketSupport, value: TypeCreateTicketEnum.FOR_SOMEBODY }
    ];
    
    public formTicket: FormGroup = this.formBuilder.group({
        title: [],
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
        technicianCredentialId: [],
        costCenterId: [],
        isIncident: [],
    });
    
    ngOnInit(): void {
        this.getCredentialComplement();
        this.getObserverGroups();
        this.setDataTicket()
        this.getSubcategory();
        if (this.hasCostCenter()) this.getCostCenters();
        this.haveRoleForCreateTicketForSomebodyElse.set(this.loginService.haveSomeRole([ROLES_CODE_SYSTEM.LEADER, ROLES_CODE_SYSTEM.TECHNICIAN, ROLES_CODE_SYSTEM.MONITOR]))
    }

    private setDataTicket() {
        const formControlCostCenter = this.formTicket.get('costCenterId');
        this.hasCostCenter()
            ? formControlCostCenter?.setValidators(Validators.required)
            : formControlCostCenter?.clearValidators();
        formControlCostCenter?.updateValueAndValidity();
        this.formTicket.patchValue({
            categoryId: this.category().id,
            enterpriseId: this.enterpriseId()
        });
    }

    private getSubcategory() {
        this.categoryService.getSubCategoriesByCategory(this.enterpriseId(), this.category().id).subscribe({
            next: (res) => {
                this.subcategories.set(res.map( subCategory => {
                    subCategory.name = removeTextIntoParentheses(subCategory.name);
                    return subCategory;
                }));
            }
        });
    }

    private getCostCenters() {
        this.costCenterService.getSelectByEnterprise(this.enterpriseId()).subscribe({
            next: (res) => {
                this.costCenters.set(res.map(costCenter => {
                    return {
                        ...costCenter,
                        name: costCenter.code + ' - ' + costCenter.name
                    }
                }));
            }
        })
    }
    
    public getApproversAndModeradors() {
        const body: EnterpriseCategorySubcategory = {
            enterpriseId: this.enterpriseId(),
            categoryId: this.category().id,
            subCategoryId: this.formTicket.value.subCategoryId
        };
        this.enterpriseCategoryService.getApproversAndModerators(body).subscribe({
            next: (res) => {
                this.approvers.set(res.approvers);
                const formControlCredentialApprover = this.formTicket.get('credentialApproverId');
                res.approvers.length > 0
                    ? formControlCredentialApprover?.setValidators(Validators.required)
                    : formControlCredentialApprover?.clearValidators();
                formControlCredentialApprover?.reset();
            }
        })
    }

    public createTicket() {
        if (this.isFieldDescriptionValid) {
            const dataTicket: DataTicket = {
                values: {
                    ...this.formTicket.value,
                    title: this.formTicket.value.title?.trim()? this.formTicket.value.title: null,
                    description: this.formTicket.value.description.split('&nbsp;').join(' '),
                    phone: this.formTicket.value.phone?.toString(),
                    ubication: this.formTicket.value.ubication? this.formTicket.value.ubication: null,
                },
                file: this.fileUploaded
            };
            this.saveTicket.emit(dataTicket);
        } else {
            this.helpersService.messageNotification(Severity.warn, LABELS.warning, MESSAGES.fieldDescriptionRequiresMinimumFiveCharacters);
        }
    };

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

    public getEditorChanges(textLength: number) {
        this.isFieldDescriptionValid = textLength > 4? true: false;
    }

    private getObserverGroups() {
        this.showObserverGroups.set(false);
        this.observerGroupService.getByEnterpriseId(this.enterpriseId()).subscribe({
            next: (res) => {
                this.observerGroups.set(res);
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

    public changeTypeCreateTicket(event: SelectButtonOptionClickEvent) {
        const formControlCredentialRequester = this.formTicket.get('credentialRequesterId');
        const option: DropdownCommonInterface = event.option;
        option.value === TypeCreateTicketEnum.FOR_ME
            ? formControlCredentialRequester?.clearValidators()
            : formControlCredentialRequester?.setValidators(Validators.required);
        formControlCredentialRequester?.reset();
    }

    public setRequester(requesterId: number) {
        this.formTicket.patchValue({credentialRequesterId: requesterId})
    }
}
