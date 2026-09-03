import { DataCommon } from "./FieldsCommons";
import { Enterprise } from "./Enterprise";
import { nameFunction } from "@core/interfaces/buttons-ticket.interface";
import { ISolution } from "@core/interfaces/ticket.interface";
import { STATES_TICKET_ENUM, TypeTicketEnum } from "@core/enums/ticket";


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
    title:          string;
    ticketPriorityParameterId: number;
    description:    string;
    ubication:      string;
    phone:          string;
    enterpriseId:   number;
    categoryId:     number;
    subCategoryId:  number;
    technicianCredentialId: number;
    parentTicketId: number;
    attachmentId?:  number;
    isIncident:     boolean
}

export class TicketResponse {
    id: number;
    code: string;
    title: string;
    enterpriseCode: string;
    requester: string;
    technician: string;
    tag: string;
    tagColor: string;
    flowStatusId: number;
    flowStatusName: STATES_TICKET_ENUM;
    priorityName: string;
    priorityColor: string;
    priorityId: number;
    createdAt: string;
    typeTicket: TypeTicketEnum;
    functions: nameFunction[];
}

export interface TicketResponseForOrder {
    code: string;
    title: string;
    enterpriseCode: string;
    requester: string;
    technician: string;
    flowStatusName: string;
    priorityName: string;
    createdAt: string;
}

export interface ITicketUnread {
    ticketId: number;
    unread: number;
}

export type keyTicketResponse = keyof TicketResponseForOrder;

interface EstimatedDate {
    active: boolean;
    endDate: string;
    startDate: string;
    createdBy: string;
}
export class TicketById {
    id:                   number;
    code:                 string;
    title:                string;
    description:           string;
    createdAt:            string;
    enterpriseCode:       string;
    category:             string;
    subCategory:          string;
    requester:            string;
    requesterAddress:     string;
    requesterPhoneNumber: string;
    flowStatusId:         number;
    flowStatusName:       string;
    priorityName:         string;
    priorityColor:        string;
    approver:             string;
    moderator:            string;
    fileName:             string;
    technician:           string;
    technicianPhoneNumber:string;
    technicianAddress:    string;
    leader:               string;
    leaderPhoneNumber:    string;
    costCenter:           string;
    tag:                  string;
    tagColor:             string;
    incidentEndDate:      string;
    incidentStartDate:    string;
    typeTicket:           TypeTicketEnum;
    solutions:            ISolution[];
    associatedTicketCodes:string[];
    estimatedDates: EstimatedDate[];
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

export class TicketSolutionProjection {
   cause:       string | null = null;
   priority:    string | null = null;
   description: string | null = null;
   impact:      string | null = null;
   activity:    string | null = null;
   ticketId:    number | null = null;
   ranking:     number | null = null;
   system:      string | null = null;
   closeAt:     string | null = null;
   quality:     string | null = null;
   acceptAt:    string | null = null;
}

export interface BodyChangeTechnical {
    technicianCredentialId: number,
    ticketId: number
}

export interface TeamByLeader {
    teamId: number,
    teamName: string
}

export interface DerivationTicket {
    categoryId: number;
    subCategoryId: number;
    enterpriseId: number;
    ticketId: number;
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
    parentTicketId: number;
    dataTicket: TicketById;
}

export class TicketByIdResponse {
   observerList: ObservatorResponse[] = [];
   ticketByIdProjection: TicketById;
   ticketSolutionProjection: TicketSolutionProjection;
}

export interface addObservers {
    ticketId: number;
   credentialId: number[]
}

export interface Observer {
    email: string;
    credentialId: number
}

export class ObservatorResponse {
    key: number | null = null;
    value: string | null = null;
}

export interface EstimateDates {
    dateRange: {
        startDate: string,
        endDate: string
    }
}

export interface IncidentDates {
    startDate: string,
    endDate: string,
    tagId: number
}
