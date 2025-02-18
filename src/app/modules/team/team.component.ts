import { Component, inject, signal } from '@angular/core';
import { TeamsService } from './services/teams.service';
import { Team } from '@core/models/Team';
import { TeamModule } from './team.module';
import { ToolbarComponent } from '@shared/components/toolbar/toolbar.component';
import { ModaldeleteComponent } from '@shared/components/modal-delete/modal-delete.component';
import { HelpersService } from '@core/services/helpers.service';
import { TeamMembersComponent } from '../team-members/team-members.component';

@Component({
  selector: 'app-team',
  standalone: true,
  imports: [TeamModule, ToolbarComponent, ModaldeleteComponent, TeamMembersComponent],
  templateUrl: './team.component.html',
  providers: [ HelpersService ]
})
export class TeamComponent {

  teamService = inject(TeamsService);

  teams = signal<Team[]>([]);
  object = signal(new Team);

  ngOnInit(): void {
    this.object.set(new Team);
  }

  setObject( object: Team  ) {
    this.object.set(object);
  }
}
