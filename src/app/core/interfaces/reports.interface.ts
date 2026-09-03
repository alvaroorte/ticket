import { CodeReportsEnum, TypeReportsEnum } from "@core/enums/type-reports";

export interface IFiltersReport {
    supervisor: boolean;
    reportCode: CodeReportsEnum;
    reportType: TypeReportsEnum;
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
}

export interface AttachmenReport {
    name: string;
    file: string;
    typeFile: string;
}
