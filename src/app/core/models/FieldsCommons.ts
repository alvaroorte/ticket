import { TicketSolutionProjection } from "./Ticket";

export interface FieldsCommons  {
    active: boolean |null,
    createdBy: string |null,
    updatedBy: string |null,
    createdAt: Date |null,
    updatedAt: Date |null,
}

export class DataCommon {
    id: number | null = null;
    subId: number | null = null;
    name: string | null = null;
    description: string | null = null;
    code: string | null = null;
    status: boolean | null = false;
}

export interface SimpleResponse  {
    message: string,
    selector: DataCommon[],
    title: string,
    solutionTemp: TicketSolutionProjection
}

export interface CredentialComplement  {
    ubication: string,
    phone: string |null,
}

export interface RolUser  {
    leader: number,
    technical: number,
    supervisor: number,
}
