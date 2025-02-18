import { HttpClient } from '@angular/common/http';
import { Injectable, inject  } from '@angular/core';
import { Team } from 'src/app/core/models/Team';
import { environment } from '@core/environments/environment.development';
import { Follow } from '@core/models/follow';

@Injectable({
  providedIn: 'root'
})
export class FollowService {

  private http = inject(HttpClient);

  private serverUrl: string = environment.server_url;

  public create( body: Follow ) {
    return this.http.post<Team[]>(this.serverUrl+'follow', body)
  }

  public timeline( idTicket: number, isStatus: boolean ) {
    const url = isStatus? 'timeLine': 'leadTime';
    return this.http.get<{timeLine: string}>(this.serverUrl+'follow/'+ url + '/' + idTicket)
  }
}
