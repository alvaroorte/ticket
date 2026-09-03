import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable, Output, EventEmitter, inject  } from '@angular/core';
import { CredentialComplement, DataCommon } from '@core/models/FieldsCommons';
import { environment } from '@core/environments/environment.development';
import { StatusTechnical } from '@core/models/credential';
import { ICredentialUser } from '@core/interfaces/user.interface';

@Injectable({
  providedIn: 'root'
})
export class CredencialService {
  
  @Output() eventOpenModalInfoUser = new EventEmitter();

  private http = inject(HttpClient);

  private serverUrl: string = environment.server_url;

  public allUsers(some: string) {
    const params: HttpParams = new HttpParams().set('some', some);
    return this.http.get<ICredentialUser[]>(this.serverUrl+'credential/allUser', { params })
  }

  public credentialComplement() {
    return this.http.get<CredentialComplement>(this.serverUrl+'credential/credentialComplement')
  }

  public statusTechnical( idTeamMember: number ) {
    return this.http.get<StatusTechnical[]>(this.serverUrl+'credential/statusTechnical/' + idTeamMember)
  }

  public statusTechnicalUpdate( idTeamMember: number, body: { isEnabled: boolean } ) {
    return this.http.post<StatusTechnical>(this.serverUrl+'credential/statusTechnical/' + idTeamMember, body)
  }

  public credentialUpdate( body: CredentialComplement ) {
    return this.http.put<CredentialComplement>(this.serverUrl+'credential', body)
  }
}
