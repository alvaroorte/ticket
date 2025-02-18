import { Component, EventEmitter, Output, inject, signal } from '@angular/core';
import { Team, TeamSend } from '@core/models/Team';
import { TeamsService } from '../../services/teams.service';
import { HelpersService } from '@core/services/helpers.service';
import { Table } from 'primeng/table';
import { TableComponent as TableTeamMemberComponent } from '@team-members/components/table/table.component';
import { TeamMemberService } from '@team-members/services/teamMembers.service';

@Component({
  selector: 'app-table',
  templateUrl: './table.component.html'
})
export class TableComponent {

  @Output() rowSelected = new EventEmitter<Team>();

  private teamService = inject(TeamsService);
  private teamMemberService = inject(TeamMemberService);
  private helpersService = inject(HelpersService);

  teams = signal<Team[]>([]);
  selectedTeam = signal<Team>(new Team);
  firstPage = 0;
  rows = 10;
  optionsPage = signal([5, 10, 20]);
  loading = signal(false);
  sidebarVisible = signal(false);
  tableTeamMember!: TableTeamMemberComponent

  ngOnInit() {
    this.teamService.eventTableComponent.emit(this);
    this.teamMemberService.eventTableComponent.subscribe( (tableTeamMember) => {
      this.tableTeamMember = tableTeamMember;
    })

    this.getAll();
  }

  getAll(): void {
    this.loading.set(true);
    this.teamService.search().subscribe({
      next: (res) => {
        this.teams.set(res);
        this.loading.set(false);
      },
      error: (err) => {
        console.log(err);
        this.helpersService.messageNotification("error", 'Error', err.message, 3000);
      }
    })
  }

  onGlobalFilter(table: Table, event: Event) {
    table.filterGlobal((event.target as HTMLInputElement).value, 'contains');
  }

  clear(table: Table) {
      table.clear();
  }

  reload (): void {
    this.getAll();
    this.firstPage = 0;
    this.onRowUnselect();
  }

  onRowSelect(event: any) {
    this.selectedTeam.set(event.data);
    this.rowSelected.emit(this.selectedTeam());
    this.tableTeamMember.listTeamMembers();
  }

  onRowUnselect() {
    this.selectedTeam.set(new Team);
    this.rowSelected.emit(this.selectedTeam());
    this.tableTeamMember.listTeamMembers();
  }

  switchStatus(team: TeamSend) {
      this.loading.set(true);
      this.teamService.update(Number(team.id), team).subscribe(
         {
            next: resp => {
               this.loading.set(false);
            },
            error: (err) => {
               this.loading.set(false);
               this.helpersService.messageNotification("error", 'Error', err.message, 3000);
            }
         }
      )
  }
}
