import { Component, OnInit, inject } from '@angular/core';
import { HelpersService } from '@core/services/helpers.service';
import { TeamMemberService } from '@team-members/services/teamMembers.service';
import { CredencialService } from '@core/services/credencial';
import { StatusTechnical } from '@core/models/credential';

@Component({
  selector: 'app-modal-disable-user-all-teams',
  templateUrl: './modal-disable-user-all-teams.component.html'
})
export class ModalDisableUserAllTeamsComponent implements OnInit {

  private helpersService = inject(HelpersService);
  private teamMemberService = inject(TeamMemberService);
  private credencialService = inject(CredencialService);

  public openModal: boolean = false;
  public userIsEnabled: boolean = false;
  public IdTeamMember!: number;
  public statusTechnical!: StatusTechnical;

  ngOnInit() {
    this.teamMemberService.eventOpenModalDisabledUserOfAllTeams.subscribe((IdTeamMember) => {
      this.IdTeamMember = IdTeamMember;
      this.openCreate();
    });
  };

  hideModal() {
    this.openModal = false;
  };

  openCreate(){
    this.getStatusTechnical();
      this.openModal = true;
  };

  private getStatusTechnical() {
    if (this.IdTeamMember > 0) {
      this.credencialService.statusTechnical(this.IdTeamMember).subscribe({
        next: (res: StatusTechnical[]) => {
          this.statusTechnical = res[0];
          this.userIsEnabled = this.statusTechnical.isEnabled;
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

  public saveStatus() {
    const body: { isEnabled: boolean } = { isEnabled: this.userIsEnabled };
    this.credencialService.statusTechnicalUpdate(this.IdTeamMember, body).subscribe({
      next: (res: StatusTechnical) => {
        this.actionsHideModal();
        this.hideModal();
      },
      error: (err) => {
        console.log(err);
        this.helpersService.messageNotification("error", 'Error', err.message, 3000);
      }
    })
  }

  actionsHideModal() {
    this.teamMemberService.eventSaveMemberTeam.emit();
  }
}
