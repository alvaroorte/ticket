import { UserApp } from "./user-app";

export class CredentialLeader  {
    id: number | null = null;
    userAppId: UserApp | null = null;
}

export interface StatusTechnical  {
    id: number,
    isEnabled: boolean,
    technicalOf: string;
    leaderOf: string
}

