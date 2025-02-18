import { CredentialLeader } from "./credential";

export class Supervisor  {
    id: number | null = null;
    credential: CredentialLeader = new CredentialLeader;
    name: string | null = null;
}

export class SupervisorGetById  {
    id: number | null = null;
    description: string | null = null;
    supervisorId: number | null = null;
    supervisor: string | null = null;
}

export class SupervisorSend  {
    id: number | null = null;
    credential: number | null = null;
    name: string | null = null;
    status?: boolean | null = null;
}
