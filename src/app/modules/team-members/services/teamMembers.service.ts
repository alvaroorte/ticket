import { HttpClient } from '@angular/common/http';
import { Injectable, Output, EventEmitter, inject  } from '@angular/core';
import { TeamMember, TeamMemberSend } from '@core/models/Team';
import { environment } from '@core/environments/environment.development';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class TeamMemberService {

  @Output() eventFormComponent: EventEmitter<any> = new EventEmitter();
  @Output() eventTableComponent: EventEmitter<any> = new EventEmitter();
  @Output() eventModalDeleteComponent: EventEmitter<any> = new EventEmitter();
  @Output() eventToolbarComponent: EventEmitter<any> = new EventEmitter();
  @Output() eventTableDobleComponent: EventEmitter<any> = new EventEmitter();
  @Output() eventSaveMemberTeam: EventEmitter<any> = new EventEmitter();
  @Output() eventOpenModalDisabledUserOfAllTeams: EventEmitter<any> = new EventEmitter();

  private http = inject(HttpClient);

  private serverUrl: string = environment.server_url;

  public create(teamMember: TeamMemberSend) {
    return this.http.post<void>(this.serverUrl + 'teamMember', teamMember)
  }

  public delete(idMember: number): Observable<string> {
    return this.http.delete(this.serverUrl + 'teamMember/' + idMember, { responseType:'text'})
  }

  public search(idTeam: string | number | void, isTable?: boolean) {
    let params: any = {};
    ( idTeam )? params['id'] = idTeam : "";
    ( isTable )? params['tableMembers'] = isTable : false;
    return this.http.get<TeamMember[]>(this.serverUrl+'teamMember/teamMemberSearch', { params })
  }

  public update (id: number, teamMember: TeamMemberSend) {
      return this.http.put<TeamMember>(this.serverUrl + 'teamMember/' + id , teamMember)
  }
}
