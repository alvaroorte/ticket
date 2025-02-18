import { DataCommon } from "./FieldsCommons";
import { Enterprise } from "./Enterprise";
import { TeamMember } from "./Team";


export class Ticket {
    id:           number | null = null;
    idRecursive:  number | null = null;
    enterpriseId: Enterprise | null = null;
    code:         string | null = null;
    number:       number | null = null;
    title:        string | null = null;
    description:  string | null = null;
    image:        string | null = null;
    okApprover:   boolean | null = null;
    okModerator:  boolean | null = null;
    typeTicket:  string | null = null;
}

export class TicketSend {
    id:            number | null = null;
    idRecursive:    number | null = null;
    title:         string | null = null;
    description:   string | null = null;
    image:         string | null = null;
    categoryId:    number | null = null;
    subCategoryId: number | null = null;
    priorityId: number | null = null;
    ubication: string | null = null;
    phone: string | null = null;
    domain: string | null = null;
}

export class TicketResponse {
    subCategory:   string | null = null;
    category:      string | null = null;
    enterprise:    string | null = null;
    code:          string | null = null;
    ticket:        number | null = null;
    technical:     string | null = null;
    title:         string | null = null;
    status:        string | null = null;
    created:       string | null = null;
    applicant:     string | null = null;
    functionality: string | null = null;
    priority: string | null = null;
    priorityColour: string | null = null;
    typeTicket: string | null = null;
    team: string | null = null;
    teamId: number;
}


export class TicketById {
    id:               number | null = null;
    flowStatusId:     number | null = null;
    code:             string | null = null;
    subCategoryId:    number | null = null;
    categoryId:       number | null = null;
    image:            string | null = null;
    technical:        string | null = null;
    technicalPhone:   string | null = null;
    description:      string = '';
    parameterActorId: number | null = null;
    enterprise:       string | null = null;
    moderator:        string | null = null;
    subCategory:      string | null = null;
    category:         string | null = null;
    approver:         string | null = null;
    created:          string | null = null;
    applicant:        string | null = null;
    priority:        string | null = null;
    priorityId:       number = 0;
    applicantPhone:   string | null = null;
    applicantUbication: string | null = null;
    title:            string | null = null;
    status:           string | null = null;
    fileName:         string | null = null;
}

export class TicketFunctionSend {
    function:       string | null = null;
    priority:       string | null = null;
    qualityService: string | null = null;
    impact:         string | null = null;
    causeIncident:  string | null = null;
    description:    string | null = null;
    typeTicket:    string | null = null;
}

export class TicketFunctionArrays {
    causaincidente:       DataCommon[] = [];
    impacto:       DataCommon[] = [];
    prioridad: DataCommon[] = [];
    tipodeticket:         DataCommon[] = [];
    calidaddeservicio:         DataCommon[] = [];
    actividad:         DataCommon[] = [];
    sistema:         DataCommon[] = [];
}

export class TicketByTeam {
    priority:      string | null = null;
    status:        string | null = null;
    title:         string | null = null;
    enterprise:    string | null = null;
    code:          string | null = null;
    ticketId:      number | null = null;
    teamId:        number | null = null;
    applicant:     string | null = null;
    created:       string | null = null;
    technicalId:   number | null = null;
    technicalName: string | null = null;
    teamName:      string | null = null;
    colorPriority: string | null = null;
    totalRecords: number = 0;
}

export class TicketSolutionProjection {
   cause:       string | null = null;
   priority:    string | null = null;
   description: string | null = null;
   impact:      string | null = null;
   activity:    any | null = null;
   ticketId:    number | null = null;
   ranking:     number | null = null;
   system:      any | null = null;
   closeAt:     string | null = null;
   quality:     string | null = null;
   acceptAt:    string | null = null;
}

export interface SendChangeTicket {
    actorId: number
}

export interface TeamByLeader {
    teamId: number,
    teamName: string
}

export class ListByTeam {
    ticketTeam: TicketByTeam[] | null = null;
    teamByLeader: TeamByLeader[] | null = null;
    teamMember: TeamMember[] | null = null;
}

export interface DerivationTicket {
    categoryId: number;
    subCategoryId: number;
    domain: string;
    description: string;
    priorityId: number;
}

export class TicketOnDemandResponse {
    priority:     string | null = null;
    id:           number | null = null;
    technical:    string | null = null;
    title:        string | null = null;
    status:       string | null = null;
    created:      Date | null = null;
    applicant:    string | null = null;
    category:     string | null = null;
    subCategory:  string | null = null;
    enterprise:   string | null = null;
    code:         string | null = null;
    totalRecords: string | null = null;
}

export interface DataOpenFormTicket {
    idRecursive: number | null;
    isDerivation: boolean;
    dataTicket: TicketById;
}

export class TicketByIdResponse {
   observerList: ObservatorResponse[] = [];
   ticketByIdProjection: TicketById | null = null;
   ticketSolutionProjection: TicketSolutionProjection | null = null;
}

export class Observator {
   ticket: number | null = null;
   credential: number | null = null;
   nameActor: string | null = null;
}

export class ObservatorResponse {
   key: number | null = null;
   value: string | null = null;
}
