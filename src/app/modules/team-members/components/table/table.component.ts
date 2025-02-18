import { Component, EventEmitter, Input, Output, Signal, inject, signal } from '@angular/core';
import { Team, TeamMember, TeamMemberSend } from '@core/models/Team';
import { HelpersService } from '@core/services/helpers.service';
import { TeamMemberService } from '../../services/teamMembers.service';
import { Table } from 'primeng/table';

@Component({
  selector: 'app-table',
  templateUrl: './table.component.html'
})
export class TableComponent {

  @Input() team!: Signal<Team>;
  @Output() rowSelected = new EventEmitter<TeamMember>();

  private teamMemberService = inject(TeamMemberService);
  private helpersService = inject(HelpersService);

  teamMembers = signal<TeamMember[]>([]);
  firstPage = 0;
  rows = 10;
  optionsPage = signal([5, 10, 20]);
  loading = signal(false);

  ngOnInit() {
    this.teamMemberService.eventTableComponent.emit(this);
    this.teamMemberService.eventSaveMemberTeam.subscribe(() => this.listTeamMembers())
  }

  listTeamMembers() {
    if ( this.team() && this.team().id ) {
      this.loading.set(true);
      this.teamMembers.set([]);
      this.teamMemberService.search(this.team().id as number, true).subscribe({
        next: (res) => {
          this.teamMembers.set(res);
          this.loading.set(false);
        },
        error: (err) => {
          console.log(err);
          this.loading.set(false);
          this.helpersService.messageNotification("error", 'Error', err.message, 3000);
        }
      })
    } else {
      this.setEnterpriseCategories([]);
    }
  }

  setEnterpriseCategories( data:TeamMember[] ) {
    this.teamMembers.set(data);
  }

  onGlobalFilter(table: Table, event: Event) {
    table.filterGlobal((event.target as HTMLInputElement).value, 'contains');
  }

  clear(table: Table) {
      table.clear();
  }

  reload () {
    this.listTeamMembers();
    this.firstPage = 0;
  }

  onRowSelect(event: any) {
    this.rowSelected.emit(event.data);
  }

  onRowUnselect() {
    this.rowSelected.emit(new TeamMember);
  }

  switchStatus(members: any){
      this.loading.set(true);
      let sendMembers:TeamMemberSend = new TeamMemberSend();
      sendMembers.status = members.status
      sendMembers.credential = null;
      sendMembers.team = null;
      this.teamMemberService.update(members.id,sendMembers).subscribe({
         next: () => {
            this.loading.set(false);
         },
         error: (err) => {
            console.log(err);
            this.loading.set(false);
            this.helpersService.messageNotification("error", 'Error', err.message, 3000);
         }
      });
  }
}
