import { HttpClient } from '@angular/common/http';
import { Injectable, inject  } from '@angular/core';
import { Team } from 'src/app/core/models/Team';
import { environment } from '@core/environments/environment.development';
import { Follow } from '@core/models/follow';
import { ICreateMessages, IMessages } from '@core/interfaces/follow';
import { Timeline } from '@core/models/Timeline';

@Injectable({
  providedIn: 'root'
})
export class FollowService {

  private http = inject(HttpClient);

  private serverUrl: string = environment.server_url;

  public create( body: ICreateMessages ) {
    return this.http.post<Team[]>(this.serverUrl+'follow', body)
  }
  
  public getMessages( ticketId: number ) {
    return this.http.get<IMessages[]>(this.serverUrl+'follow/messages/' + ticketId)
  }
  
  public getTimelineByTicketId( ticketId: number ) {
    return this.http.get<Timeline[]>(this.serverUrl+'follow/timeLine/' + ticketId)
  }
}
