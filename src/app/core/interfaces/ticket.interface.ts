import { keyTicketResponse, TicketSend } from "@core/models/Ticket";
import { nameFunction } from "./buttons-ticket.interface";
import { STATES_TICKET_ENUM, TypeTicketEnum } from "@core/enums/ticket";
import { WaitingTimeStatusClass, WaitingTimeStatusEnum } from "@core/enums/waitng-time-status.enum";

export interface DataTicket {
    values: TicketSend,
    file: File
}

export interface InfoOpenModalCommon {
    ticketId: number,
    ticketTitle: string
}

export interface InfoOpenModalDescription {
    nameFunction: nameFunction,
    ticketId: number,
}

export interface InfoOpenModalPriority {
    priorityId: number,
    ticketId: number,
}

export interface HttpParamsTicketList {
    sortBy: string,
    sortOrder: string
}

export interface FilterByFieldTickets {
    textSearch: string,
    orderField: keyTicketResponse,
    sort: string
}

export interface INextFunction {
    ticketId:        number,
    function:        nameFunction
    description?:    string;
    serviceQuality?: string;
    impact?:         string;
    issue?:          string;      
    activity?:       string;       
    system?:         string;
    ticketCode?:     string;
    attachmentId?:   number;
}

export interface INextFunctionAndFile {
    body: INextFunction;
    attachment?: File;
}

export interface TicketByTeam {
    id:             number;
    code:           string;
    title:          string;
    createdAt:      string;
    enterpriseCode: string;
    requester:      string;
    technician:     string;
    flowStatusId:   number;
    flowStatusName: STATES_TICKET_ENUM;
    priorityName:   string;
    priorityColor:  string;
    priorityId:     number;
    typeTicket:     TypeTicketEnum;
}

export interface TicketHistory {
    id:                       number;
    code:                     string;
    title:                    string;
    description:              string;
    flowStatus:               STATES_TICKET_ENUM;
    ticketTypeParameter:      string;
    ticketPriorityParameter:  string;
    ticketPriorityParameterId:number;
    enterpriseId:             number;
    enterprise:               string;
    categoryId:               number;
    category:                 string;
    subCategoryId:            number;
    subCategory:              string;
    requester:                string;
    technician:               string;
    approverId:               number;
    approver:                 string;
    moderatorId:              number;
    moderator:                string;
    createdAt:                string;
    initiatedAt:              string;
    resolvedAt:               string;
    closedAt:                 string;
    leadTime:                 string;
    cycleTime:                string;
    waitingTimeStatus:        WaitingTimeStatusEnum;
    waitingTimeClass:         WaitingTimeStatusClass;
    costCenter?:              string;
    estimatedStartDate?:      string;
    estimatedEndDate?:        string;
    associatedTickets?:       string;
    tag?:                     string;
}

export interface ISolution {
    createdAt: string;
    description: string;
    fileName: string;
    activity: string;
    causeIncident: string;
    impact: string;
    system: string;
}

export interface IBodyModifyPriority {
    ticketId: number;
    ticketPriorityParameterId: number;
}

export interface IBodychangeApproverOrModerator {
    ticketId: number;
    credentialId: number;
}

export interface IFiltersTicketsHistorical {
    page: number;
    size: number;
    sortBy: string | string[];
    sortOrder: string;
    code?: string;
    title?: string;
    description?: string;
    flowStatusId?: number;
    costCenterId?: number;
    ticketTypeParameterId?: number;
    ticketPriorityParameterId?: number;
    enterpriseId?: number;
    categoryIds?: number;
    subCategoryIds?: number;
    requesterCredentialId?: string;
    technicianCredentialId?: string;
    createdFrom?: string;
    createdTo?: string;
    initiatedFrom?: string;
    initiatedTo?: string;
    resolvedFrom?: string;
    resolvedTo?: string;
    closedFrom?: string;
    closedTo?: string;
    supervisor: boolean;
}