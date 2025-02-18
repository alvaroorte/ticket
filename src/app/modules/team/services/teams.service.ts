import { HttpClient } from '@angular/common/http';
import { Injectable, Output, EventEmitter, inject  } from '@angular/core';
import { Params } from '@angular/router';
import { Team, TeamResponse, TeamSend } from 'src/app/core/models/Team';
import { environment } from '@core/environments/environment.development';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class TeamsService {

  @Output() eventFormComponent: EventEmitter<any> = new EventEmitter();
  @Output() eventTableComponent: EventEmitter<any> = new EventEmitter();
  @Output() eventModalDeleteComponent: EventEmitter<any> = new EventEmitter();
  @Output() eventToolbarComponent: EventEmitter<any> = new EventEmitter();

  private http = inject(HttpClient);

  private serverUrl: string = environment.server_url;
  params: Params = {};

  public getAll() {
    return this.http.get<Team[]>(this.serverUrl+'team')
  }

  public getById(id: number) {
    return this.http.get<TeamResponse>(this.serverUrl + 'team/' + id)
  }

  public create(team: TeamSend) {
    return this.http.post<Team>(this.serverUrl + 'team', team)
  }

  public update(id: number, team: TeamSend) {
    return this.http.put<Team>(this.serverUrl + 'team/' + id, team)
  }

  public delete(id: number): Observable<string> {
    return this.http.delete(this.serverUrl + 'team/' + id, { responseType:'text'})
  }

  public search() {
    return this.http.get<Team[]>(this.serverUrl+'team/teamSearch')
  }
}
