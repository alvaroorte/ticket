import { Component, OnInit, inject, signal } from '@angular/core';
import { TeamMemberSend } from '@core/models/Team';
import { HelpersService } from '@core/services/helpers.service';
import { TeamMemberService } from '@team-members/services/teamMembers.service';
import { TableComponent } from '@team-members/components/table/table.component';

@Component({
  selector: 'app-modal-form',
  templateUrl: './modal-form.component.html'
})
export class ModalFormComponent implements OnInit {

  private helpersService = inject(HelpersService);
  private teamMemberService = inject(TeamMemberService);

  TeamMemberSend!: TeamMemberSend;
  openModal: boolean = false;
  tittleForm: string = "";
  tableComponent!: TableComponent;
  isLoading = false;
  idUser = signal(0);

  ngOnInit() {
    this.teamMemberService.eventFormComponent.emit(this);

    this.teamMemberService.eventTableComponent.subscribe((tableComponent) => {
      this.tableComponent = tableComponent;
    });
  };

  hideModal() {
    this.openModal = false;
    this.isLoading = false;
  };

  openCreate(){
      this.tittleForm = "Agregar Miembro al Equipo";
      this.openModal = true;
  };

  setUser(idUser: number) {
    this.idUser.set(idUser);
  }

  saveMember() {
    if (this.idUser() > 0) {
      let data: TeamMemberSend = {
        credential: this.idUser(),
        team: this.tableComponent.team().id
      }
      this.teamMemberService.create(data).subscribe({
        next: () => {
          this.hideModal();
          this.helpersService.messageNotification("success", "Correcto", "Miembro agregado correctamente", 3000);
          this.setUser(0);
        },
        error: (err) => {
          console.log(err);
          this.helpersService.messageNotification("error", 'Error', err.message, 3000);
        }
      })
    } else {
      this.helpersService.messageNotification("warn", 'Por favor', "Seleccione un Miembro de equipo", 3000);
    }
  }

  actionsHideModal() {
    this.teamMemberService.eventSaveMemberTeam.emit();
  }
}
