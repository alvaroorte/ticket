import { Component, Input, Signal, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Team, TeamMember } from '@core/models/Team';
import { ToolbarComponent } from '@shared/components/toolbar/toolbar.component';
import { TeamMembersModule } from './team-members.module';
import { TeamMemberService } from './services/teamMembers.service';
import { ModaldeleteComponent } from '@shared/components/modal-delete/modal-delete.component';

@Component({
  selector: 'app-team-members',
  standalone: true,
  imports: [CommonModule, TeamMembersModule, ToolbarComponent, ModaldeleteComponent],
  templateUrl: './team-members.component.html'
})
export class TeamMembersComponent {

  @Input() team: Signal<Team> = signal(new Team);

  teamMemberService = inject(TeamMemberService);

  teamMember = signal(new TeamMember);
  public iconButton: string = '';
  public tootilpButton: string = '';

  setObject( teamMember: TeamMember  ) {
    this.teamMember.set(teamMember);
    if ( teamMember.id ) {
      this.iconButton = teamMember.status? 'pi-ban': 'pi-check' ;
      this.tootilpButton = teamMember.status? 'Desactivar': 'Activar' ;
    }
  }

  public openModalDisabledUserOfAllTeams() {
    this.teamMemberService.eventOpenModalDisabledUserOfAllTeams.emit(this.teamMember().credentialId);
  }
}
