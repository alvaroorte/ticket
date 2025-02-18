import { Component, inject } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { HelpersService } from 'src/app/core/services/helpers.service';
import { Parameter } from 'src/app/core/models/Parameter';
import { TableComponent } from '../table/table.component';
import { ParametersService } from 'src/app/modules/parameters/services/parameters.service';
import { iconsPrime as IconsPrime } from 'src/app/shared/icons/icons-pime';
import { Icon } from 'src/app/core/models/Icon';
import { DataCommon } from '@core/models/FieldsCommons';
import { noSpaceValidator } from '@core/validators/noSpaceValidator';


@Component({
  selector: 'app-form',
  templateUrl: './form.component.html'
})
export class FormComponent {

  private formBuilder = inject(FormBuilder);
  private helpersService = inject(HelpersService);
  private parametersService = inject(ParametersService);

  iconsPrime!: Icon[];
  selectedIcon: Icon | null = null;
  folders!: DataCommon[];

  ngOnInit() {
    this.parametersService.eventFormComponent.emit(this);
    this.parametersService.eventTableComponent.subscribe((tableComponent) => {
      this.tableComponent = tableComponent;
    });
    this.iconsPrime = IconsPrime;
  };

  parameters!: Parameter[];
  parameterId: number = 0;
  openModal: boolean = false;
  tittleForm: string = "";
  tableComponent!: TableComponent;
  public isLoading = false;

  public formParameter: FormGroup = this.formBuilder.group({
    id: [],
    folder: [],
    ranking: [],
    value: [, [Validators.required, noSpaceValidator]],
    icon: [],
    color: [],
    status:[]
  });

  hideModal() {
    this.openModal = false;
    this.isLoading = false;
  };

  openCreate() {
    this.reset();
    if ( this.tableComponent.folderNameSelected ) {
      this.tittleForm = "Nuevo Parámetro";
      this.formParameter.patchValue({ folder: this.tableComponent.folderNameSelected });
      this.openModal = true;
    } else {
      this.helpersService.messageNotification('warn', 'Por favor', 'Seleccione un folder.');
    }
  };

  openEdit(id: number ){
    this.reset();
    this.tittleForm="Editar Parámetro";
    this.parametersService.getById(id).subscribe({
      next: (res) => {
        this.parameterId = res.id!;
        this.formParameter.patchValue(res)
        this.openModal=true;
      },
      error: (err) => {
        console.log(err);
        this.helpersService.messageNotification("error", 'Error', err.message, 3000);
      }
    })
  };

  saveParameter() {
    this.isLoading = true;
    if (this.formParameter.valid) {
      if(this.parameterId > 0){
        this.submitUpdate(this.parameterId);
      }else{
        this.submitCreate();
      }
    }
  };

  reset(): void {
    this.formParameter.reset();
    this.parameterId = 0;
  };

  submitCreate() {
    const data: Parameter = {
      ...this.formParameter.value,
    };
    this.parametersService.create(data).subscribe({
      next: (res) => {
        this.tableComponent.reload();
        this.helpersService.messageNotification("success", "Correcto", `El parámetro ${res.folder} ha sido creado.`, 3000);
        this.hideModal();
        this.reset();
      },
      error: (err) => {
        console.log(err);
        this.helpersService.messageNotification("error", 'Error', err.message, 3000);
        setTimeout(() => {
          this.isLoading = false;
          
        }, 2000);
      }
    })
  };

  submitUpdate(idParameter : number) {
    const data: Parameter = {
      ...this.formParameter.value,
    };
    this.parametersService.update(idParameter, data).subscribe({
        next: (res) => {
          this.tableComponent.reload();
          this.tableComponent.selectedParameter.set( res );
          this.helpersService.messageNotification("success", "Correcto", `El parámetro ${res.folder} ha sido actualizado.`, 3000);
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
