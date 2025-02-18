import { Component, inject, signal } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { HelpersService } from 'src/app/core/services/helpers.service';
import { Enterprise } from 'src/app/core/models/Enterprise';
import { TableComponent } from '../table/table.component';
import { EnterprisesService } from 'src/app/modules/enterprises/services/enterprises.service';
import { limits, regex, messages } from '@core/constants/constants';
import { ParametersService } from '@parameter/services/parameters.service';
import { Parameter } from '@core/models/Parameter';
import { noSpaceValidator } from '@core/validators/noSpaceValidator';

@Component({
  selector: 'app-form',
  templateUrl: './form.component.html'
})
export class FormComponent {

  private formBuilder = inject(FormBuilder);
  private helpersService = inject(HelpersService);
  private enterprisesService = inject(EnterprisesService);
  private parametersService = inject(ParametersService);

  public messages = messages;
  public enterpriseId: number = 0;
  public openModal: boolean = false;
  public tittleForm: string = "";
  private tableComponent!: TableComponent;
  public isLoading = false;
  public dedicationTime = signal<Parameter[]>([]);

  public formEnterprise: FormGroup = this.formBuilder.group({
    id: [],
    code: [, [Validators.required, Validators.pattern(regex.fieldCode)]],
    name: [, [Validators.required, Validators.minLength(limits.minLength), Validators.pattern(regex.fieldName), noSpaceValidator]],
    domain: [, [Validators.required, Validators.maxLength(20), Validators.pattern(regex.fieldName)]],
    urlLogo: [, [Validators.required, Validators.maxLength(250), noSpaceValidator]],
    dedicationTime: [, Validators.required],
    status: []
  });

  ngOnInit() {
    this.enterprisesService.eventFormComponent.emit(this);
    this.enterprisesService.eventTableComponent.subscribe((tableComponent) => {
      this.tableComponent = tableComponent;
    });
  };

  hideModal() {
    this.openModal = false;
    this.isLoading = false;
  };

  public openCreate() {
    this.reset();
    this.tittleForm = "Nueva Empresa";
    this.getDedicationTime();
    this.openModal = true;
  };

  public openEdit(id: number ) {
    this.reset();
    this.getDedicationTime();
    this.tittleForm="Editar Empresa";
    this.enterprisesService.getById(id).subscribe({
      next: (res) => {
        this.formEnterprise.patchValue({
          ...res,
          dedicationTime: res.parameterDedicationTimeId.id
        })
        this.enterpriseId = res.id!;
        this.openModal = true;
      },
      error: (err) => {
        console.log(err);
        this.helpersService.messageNotification("error", 'Error', err.message, 3000);
      }
    })
  };

  private getDedicationTime() {
    this.parametersService.search('tiempo de dedicación').subscribe({
      next: (res) => {
        this.dedicationTime.set(res);
      },
      error: (err) => {
        console.log(err);
        this.helpersService.messageNotification("error", 'Error', err.message, 3000);
      }
    });
  }

  public saveEnterprise() {
    this.isLoading = true;
    if (this.formEnterprise.valid) {
      if (this.enterpriseId > 0) {
        this.submitUpdate(this.enterpriseId);
      } else {
        this.submitCreate();
      }
    }
  };

  private reset(): void {
    this.formEnterprise.reset();
    this.enterpriseId = 0;
  };

  private submitCreate() {
    const data: Enterprise = {
      ...this.formEnterprise.value,
    };
    this.enterprisesService.create(data).subscribe({
      next: (res) => {
        this.tableComponent.reload();
        this.helpersService.messageNotification("success", "Correcto", `la Empresa ${res.name} ha sido creada.`, 3000);
        this.hideModal();
        this.reset();
      },
      error: (err) => {
        this.isLoading = false;
        console.log(err);
        this.helpersService.messageNotification("error", 'Error', err.message, 3000);
      }
    })
  };

  private submitUpdate(idEnterprise : number) {
    const data: Enterprise = {
      ...this.formEnterprise.value,
    };
    this.enterprisesService.update(idEnterprise, data).subscribe({
        next: (res) => {
          this.tableComponent.reload();
          this.helpersService.messageNotification("success", "Correcto", `La empresa ${res.name} ha sido actualizada.`, 3000);
          this.hideModal();
          this.reset();
        },
        error: (err) => {
          console.log(err);
          this.helpersService.messageNotification("error", 'Error', err.message, 3000);
          this.isLoading = false;
        }
    });
  }
}
