import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable, Output, EventEmitter, inject, signal  } from '@angular/core';
import { Params } from '@angular/router';
import { Team, TeamSelect, TeamSend, TeamWithMembers, technicianShort } from 'src/app/core/models/Team';
import { environment } from '@core/environments/environment.development';
import { Observable } from 'rxjs';
import { IServiceCommon } from '@core/interfaces/service-common.interface';
import { GenericTableComponent } from '@shared/components/generic-table/generic-table.component';
import { ModalDeleteComponent } from '@shared/components/modal-delete/modal-delete.component';
import { IGenericModalForm } from '@core/interfaces/generic-modal-form.interface';

@Injectable({
  providedIn: 'root'
})
export class TeamService implements IServiceCommon {

  public eventFormComponent = signal<IGenericModalForm>(null);
  public eventTableComponent = signal<GenericTableComponent<TeamWithMembers>>(null);
  public eventModalDeleteComponent = signal<ModalDeleteComponent>(null);

  private http = inject(HttpClient);

  private urlTeam: string = environment.server_url + 'team';
  params: Params = {};

  public getAll() {
    return this.http.get<Team[]>(this.urlTeam);
  }
  
  public select() {
    return this.http.get<TeamSelect[]>(`${this.urlTeam}/select`);
  }
  
  public getAllWithMembers() {
    return this.http.get<TeamWithMembers[]>(`${this.urlTeam}/allWithMembers`);
  }

  public getById(id: number) {
    return this.http.get<TeamWithMembers>(`${this.urlTeam}/${id}`)
  }

  public create(team: TeamSend) {
    return this.http.post<Team>(this.urlTeam, team)
  }

  public update(id: number, team: TeamSend) {
    return this.http.put<Team>(`${this.urlTeam}/${id}`, team)
  }

  public delete(id: number): Observable<string> {
    return this.http.delete(`${this.urlTeam}/${id}`, { responseType:'text'})
  }
  
  public getMine(enterpriseId: number, supervisor: boolean) {
    let params: HttpParams = new HttpParams().set('supervisor', supervisor);
    params = enterpriseId? params.set('enterpriseId', enterpriseId): params;
    return this.http.get<TeamWithMembers[]>(`${this.urlTeam}/mine`, { params })
  }
  
  public getOma(enterpriseId: number) {
    return this.http.get<technicianShort[]>(`${this.urlTeam}/oma/${enterpriseId}`)
  }
}
