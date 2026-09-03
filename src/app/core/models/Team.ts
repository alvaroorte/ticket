import { CredentialLeader } from "./credential";

export class Team  {
    id: number;
    active: boolean;
    name: string;
    leaderCredentialId: number
    leaderCredentialEmail: string
    technicalAutomatic: boolean;
}

export interface technicianShort {
    technicianCredentialId: number;
    technicianCredentialEmail: string
}

export interface TeamWithMembers  {
    id: number;
    active: boolean;
    name: string;
    leaderCredentialId: number
    leaderCredentialEmail: string
    technicalAutomatic: boolean;
    teamMembers: technicianShort[]
    teamMembersString: string;
}

export interface TeamSelect  {
    id: number;
    name: string;
}

export class TeamSend  {
    id: number | null = null;
    name: string | null = null;
    credentialLeaderId: number | null = null;
    phone: string | null = null;
    technicalAutomatic: boolean = false;
    status: boolean = false;
}

export class TeamMember  {
    id: number;
    active: boolean;
    technicianCredentialId: number;
    technicianCredentialEmail: string;
    teamId: number;
    teamName: string;
}

export class TeamMemberForManagementTeam  {
    id: number | null = null;
    credentialId?: number;
    member: string | null = null;
    team: string | null = null;
    status?: boolean | null = null;
}

export class TeamMemberSend  {
    technicianCredentialId: number;
    teamId: number;
    active: boolean;
}
