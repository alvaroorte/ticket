import { Component, inject, signal } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { HelpersService } from 'src/app/core/services/helpers.service';
import { SupervisorSend } from 'src/app/core/models/Supervisor';
import { TableComponent } from '../table/table.component';
import { SupervisorService } from 'src/app/modules/supervisor/services/supervisor.service';
import { limits, regex, messages } from '@core/constants/constants';
import { Parameter } from '@core/models/Parameter';
import { noSpaceValidator } from '@core/validators/noSpaceValidator';

@Component({
  selector: 'app-form',
  templateUrl: './form.component.html'
})
export class FormComponent {

  private formBuilder = inject(FormBuilder);
  private helpersService = inject(HelpersService);
  private supervisorService = inject(SupervisorService);

  messages = messages;
  supervisorId: number = 0;
  openModal: boolean = false;
  tittleForm: string = "";
  tableComponent!: TableComponent;
  isLoading = false;
  dedicationTime = signal<Parameter[]>([]);
  user!: number | null;

  public formSupervisor: FormGroup = this.formBuilder.group({
    id: [],
    name: [, [Validators.required, Validators.minLength(limits.minLength), Validators.pattern(regex.fieldName), noSpaceValidator]],
    credential: [],
    status: []
  });

  ngOnInit() {
    this.supervisorService.eventFormComponent.emit(this);
    this.supervisorService.eventTableComponent.subscribe((tableComponent) => {
      this.tableComponent = tableComponent;
    });
  };

  hideModal() {
    this.openModal = false;
    this.isLoading = false;
    this.reset();
  };

  openCreate(){
    this.reset();
    this.tittleForm = "Nuevo Supervisor";
    this.openModal = true;
  };

  openEdit(id: number ){
    this.reset();
    this.tittleForm="Editar Supervisor";
    this.supervisorService.getById(id).subscribe({
      next: (res) => {
        this.user = res.credential.id!;
        this.formSupervisor.patchValue({ name: res.name });
        this.openModal = true;
      },
      error: (err) => {
        console.log(err);
        this.helpersService.messageNotification("error", 'Error', err.message, 3000);
      }
    })
  };

  setUser(idUser: number) {
    this.user = idUser;
  }

  saveSupervisor() {
    this.isLoading = true;
    if (this.formSupervisor.valid && this.user! > 0) {
      if (this.supervisorId > 0) {
        this.submitUpdate(this.supervisorId);
      } else{
        this.submitCreate();
      }
    } else {
      this.helpersService.messageNotification("warn", "Por Favor", "Seleccione un usuario", 3000);
      this.isLoading = false;
    }
  };

  reset(): void {
    this.formSupervisor.reset();
    this.supervisorId = 0;
    this.user = null;
  };

  submitCreate() {
    const data: SupervisorSend = {
      ...this.formSupervisor.value,
    };
    data.credential = this.user;
    this.supervisorService.create(data).subscribe({
      next: (res) => {
        this.tableComponent.reload();
        this.helpersService.messageNotification("success", "Correcto", `El supervisor ${res.name} ha sido creado.`, 3000);
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

  submitUpdate(idSupervisor : number) {
    const data: SupervisorSend = {
      ...this.formSupervisor.value,
    };
    data.credential = this.user;
    this.supervisorService.update(idSupervisor, data).subscribe({
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
