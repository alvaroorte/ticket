import { Component, inject, signal } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { HelpersService } from '@core/services/helpers.service';
import { TeamsService } from '../../services/teams.service';
import { TeamSend } from '@core/models/Team';
import { TableComponent } from '../table/table.component';
import { DataCommon } from '@core/models/FieldsCommons';
import { limits, regex, messages } from '@core/constants/constants';
import { noSpaceValidator } from '@core/validators/noSpaceValidator';

@Component({
  selector: 'app-modal-form',
  templateUrl: './modal-form.component.html'
})
export class ModalFormComponent {

  private formBuilder = inject(FormBuilder);
  private helpersService = inject(HelpersService);
  private teamService = inject(TeamsService);

  messages = messages;
  teamId: number = 0;
  openModal: boolean = false;
  tittleForm: string = "";
  tableComponent!: TableComponent;
  isLoading = false;
  lider = signal<number>(0);
  liderData = signal(new DataCommon);

  public formTeam: FormGroup = this.formBuilder.group({
    id: [],
    name: [, [Validators.required, Validators.minLength(limits.minLength), Validators.pattern(regex.fieldName), noSpaceValidator]],
    credentialLeaderId: [ ],
    technicalAutomatic: [],
    status: []
  });

  ngOnInit() {
    this.teamService.eventFormComponent.emit(this);
    this.teamService.eventTableComponent.subscribe((tableComponent) => {
      this.tableComponent = tableComponent;
    });
  };

  setUser(idUser: number) {
    this.lider.set(idUser);
  }

  hideModal() {
    this.openModal = false;
    this.isLoading = false;
  };

  openCreate(){
    this.reset();
    this.tittleForm = "Nuevo Equipo";
    this.openModal = true;
  };

  openEdit(id: number ){
    this.reset();
    this.tittleForm="Editar Equipo";
    this.teamService.getById(id).subscribe({
      next: (res) => {
        this.teamId = res.id!;
        this.formTeam.patchValue({ name: res.name, technicalAutomatic: res.technicalAutomatic });
        this.liderData().id = res.credentialLeaderId!.id;
        this.liderData().name = res.credentialLeaderId!.userAppId!.username;
        this.openModal=true;
      },
      error: (err) => {
        console.log(err);
        this.helpersService.messageNotification("error", 'Error', err.message, 3000);
      }
    })
  };

  saveTeam() {
    this.isLoading = true;
    if (this.formTeam.valid && this.lider() ) {
      if ( this.teamId > 0 ) {
        this.submitUpdate(this.teamId);
      } else {
        this.submitCreate();
      }
    } else {
      this.helpersService.messageNotification("warn", "Por Favor", "Seleccione un lider", 3000);
      this.isLoading = false;
    }
  };

  reset(): void {
    this.liderData.set(new DataCommon);
    this.formTeam.reset();
    this.teamId = 0;

  };

  submitCreate() {
    const data: TeamSend = {
      ...this.formTeam.value,
    };
    data.credentialLeaderId = this.lider();
    this.teamService.create(data).subscribe({
      next: (res) => {
        this.tableComponent.reload();
        this.helpersService.messageNotification("success", "Correcto", `El Equipo ${res.name} ha sido creado.`, 3000);
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

  submitUpdate(idEnterprise : number) {
    const data: TeamSend = {
      ...this.formTeam.value,
    };
    data.credentialLeaderId = this.lider();
    this.teamService.update(idEnterprise, data).subscribe({
        next: (res) => {
          this.tableComponent.reload();
          this.helpersService.messageNotification("success", "Correcto", `El equipo ${res.name} ha sido actualizada.`, 3000);
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
