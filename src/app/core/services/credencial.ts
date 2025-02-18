import { HttpClient } from '@angular/common/http';
import { Injectable, Output, EventEmitter, inject  } from '@angular/core';
import { CredentialComplement, DataCommon, RolUser } from '@core/models/FieldsCommons';
import { environment } from '@core/environments/environment.development';
import { StatusTechnical } from '@core/models/credential';

@Injectable({
  providedIn: 'root'
})
export class CredencialService {

  @Output() eventFormComponent: EventEmitter<any> = new EventEmitter();
  @Output() eventOpenFormLogin: EventEmitter<any> = new EventEmitter();
  @Output() eventLogout: EventEmitter<any> = new EventEmitter();
  @Output() eventOpenModalInfoUser = new EventEmitter();

  private http = inject(HttpClient);

  private serverUrl: string = environment.server_url;

  public allUsers(name:string = '') {
    let params = { name }
    return this.http.get<DataCommon[]>(this.serverUrl+'credential/allUser', { params })
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

  public credentialRoluser() {
    return this.http.get<RolUser>(this.serverUrl+'credential/rolUser')
  }
}
