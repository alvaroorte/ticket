import { Component, inject, signal } from '@angular/core';
import { TeamService } from './services/teams.service';
import { TeamWithMembers } from '@core/models/Team';
import { ToolbarComponent } from '@shared/components/toolbar/toolbar.component';
import { ModalDeleteComponent } from '@shared/components/modal-delete/modal-delete.component';
import { HelpersService } from '@core/services/helpers.service';
import { LABELS } from '@core/constants/labels';
import { TableColumn } from '@core/interfaces/table.interface';
import { TableColumnDefinitions } from '@core/utils/table-column-definitions';
import { GenericTableComponent } from '@shared/components/generic-table/generic-table.component';
import { ModalFormComponent } from './components/modal-form/modal-form.component';
import { FieldsetModule } from 'primeng/fieldset';

@Component({
    selector: 'app-team',
    imports: [ToolbarComponent, ModalDeleteComponent, GenericTableComponent, ModalFormComponent, FieldsetModule],
    templateUrl: './team.component.html',
    providers: [HelpersService]
})
export class TeamComponent {

  public readonly labels = LABELS;

  public teamService = inject(TeamService);

  public titleTable = "Lista de equipos";
  public teamSelected = signal<TeamWithMembers | null>(null);
  public teams = signal<TeamWithMembers[]>([]);
  public tableColumnTeamDefinitions: TableColumn<TeamWithMembers>[] = TableColumnDefinitions.getTeamColumnsDefinition();

  ngOnInit(): void {
    this.getTeams();
  }

  public setTeam( team: TeamWithMembers  ) {
    this.teamSelected.set(team);
  }

  public getTeams(): void {
    this.teamService.getAllWithMembers().subscribe({
      next: (res) => {
        this.teams.set(res.map( team => {
          return {
            ...team,
            teamMembersString: team.teamMembers.map(member => member.technicianCredentialEmail).join(', ')
          }
        }));
      }
    })
  }

  public onTableSelfEmision(table: GenericTableComponent<TeamWithMembers>) {
    this.teamService.eventTableComponent.set(table);
  }
}
