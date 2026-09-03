import { Component, inject } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { HelpersService } from 'src/app/core/services/helpers.service';
import { Enterprise } from 'src/app/core/models/Enterprise';
import { EnterpriseService } from 'src/app/modules/enterprises/services/enterprises.service';
import { noSpaceValidator } from '@core/validators/noSpaceValidator';
import { TypeSubmitEnum } from '@core/enums/type-submit';
import { MESSAGES } from '@core/constants/messages';
import { regex } from '@core/constants/regexs';
import { LIMITS } from '@core/constants/limits';
import { Severity } from '@core/enums/severity';
import { LABELS } from '@core/constants/labels';
import { MessageRequiredFieldComponent } from '@shared/components/message-required-field/message-required-field.component';
import { PrimeModules } from '@shared/prime-components/prime-components.module';
import { InputFileComponent } from '@shared/components/input-file/input-file.component';
import { ModeInputFile } from '@core/enums/file.enum';
import { fileTypeAllowed, maxImageSizeAllowed } from '@core/constants/file';
import { FileService } from '@core/services/file-service.service';
import { MimeTypeEnum } from '@core/enums/mime-type';

@Component({
    selector: 'app-form',
    templateUrl: './form.component.html',
    imports: [
      PrimeModules,
      ReactiveFormsModule,
      MessageRequiredFieldComponent,
      InputFileComponent
    ]
})
export class FormComponent {

  private formBuilder = inject(FormBuilder);
  private helpersService = inject(HelpersService);
  private enterpriseService = inject(EnterpriseService);
  private fileService = inject(FileService);
  
  public readonly messages = MESSAGES;
  public readonly labels = LABELS;
  public readonly modeInputFile = ModeInputFile;
  public readonly allowedImageFormat = fileTypeAllowed.allowedImageFormat;
  public readonly maxImageSizeAllowed = maxImageSizeAllowed;
  public file: File = null;
  public enterpriseId = 0;
  public openModal = false;
  public titleForm = "";
  private tableComponent = this.enterpriseService.eventTableComponent;
  
  public formEnterprise: FormGroup = this.formBuilder.group({
    id: [],
    code: [, [Validators.required, Validators.pattern(regex.fieldCode)]],
    name: [, [Validators.required, Validators.minLength(LIMITS.minLengthFive), Validators.pattern(regex.fieldName), noSpaceValidator]],
    logo: [, Validators.required],
    domain: [, [Validators.required, Validators.maxLength(20), Validators.pattern(regex.fieldName)]],
    hasCostCenter: [false, Validators.required],
    active: [true, Validators.required],
  });

  ngOnInit() {
    this.enterpriseService.eventFormComponent.set(this);
  };

  hideModal() {
    this.openModal = false;
  };

  public openCreate() {
    this.reset();
    this.titleForm = this.labels.newRegistration("empresa");
    this.openModal = true;
  };

  public openEdit(id: number ) {
    this.reset();
    this.titleForm = this.labels.editRegistration("empresa");
    this.enterpriseService.getById(id).subscribe({
      next: (res) => {
        const fileName = "logo.png";
        this.file = this.fileService.convertBase64ToFile(res.logo, fileName, MimeTypeEnum.IMAGE);
        this.formEnterprise.patchValue({
          ...res,
          hasCostCenter: res.hasCostCenter?? false
        })
        this.enterpriseId = res.id;
        this.openModal = true;
      }
    })
  };

  public loadFile(dataFile: File) {
      dataFile? 
         this.convertFileToBase64(dataFile)
         : this.formEnterprise.get('logo').patchValue(null);
  }

  private async convertFileToBase64(file: File) {
      const base64Image: string = await this.fileService.convertFileToBase64(file, true);
      this.formEnterprise.get('logo').patchValue(base64Image);
   }

  private reset(): void {
    this.formEnterprise.reset();
    this.file = null;
    this.formEnterprise.patchValue({
      active: true,
      hasCostCenter: false
    });
    this.enterpriseId = 0;
  };

  public saveEnterprise() {
    if (this.formEnterprise.valid) {
      this.enterpriseId > 0?
        this.submitSave(TypeSubmitEnum.UPDATE, this.enterpriseId)
        : this.submitSave(TypeSubmitEnum.CREATE);
    }
  };

  private submitSave(type: TypeSubmitEnum, idEnterprise?: number) {
    const data: Enterprise = {
      ...this.formEnterprise.value,
    };
    const save = type == TypeSubmitEnum.CREATE? 
      this.enterpriseService.create(data)
      : this.enterpriseService.update(idEnterprise, data);
    save.subscribe({
      next: () => {
        const message: string = type == TypeSubmitEnum.CREATE? 
          this.messages.recordCreated
          : this.messages.recordUpdated;
        this.helpersService.messageNotification(Severity.success, "Correcto", message, 3000);
        this.hideModal();
        this.reset();
      }, complete: () => {
        this.tableComponent().reload();
      }
    })
  };
}
