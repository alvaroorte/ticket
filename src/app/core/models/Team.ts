import { CredentialLeader } from "./credential";

export class Team  {
    id: number | null = null;
    name: string | null = null;
    username: number | null = null;
    phone: string | null = null;
    technical: boolean = false;
    status: boolean = false;
    credentialLeaderId: number | null = null
}

export class TeamSend  {
    id: number | null = null;
    name: string | null = null;
    credentialLeaderId: number | null = null;
    phone: string | null = null;
    technicalAutomatic: boolean = false;
    status: boolean = false;
}

export class TeamResponse  {
    id: number | null = null;
    name: string | null = null;
    credentialLeaderId: CredentialLeader | null = null;
    phone: string | null = null;
    technicalAutomatic: boolean = false;
}

export class TeamMember  {
    id: number | null = null;
    credentialId?: number;
    member: string | null = null;
    team: string | null = null;
    status?: boolean | null = null;
}

export class TeamMemberSend  {
    credential: number | null = null;
    team: number | null = null;
    status?: boolean | null = null;
}
