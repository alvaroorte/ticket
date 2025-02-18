export interface ReportSendParams  {
    categoryId: string;
    enterpriseId: string;
    tipoTicket: string;
    initialDate: string;
    endDate: string;
}

export interface AverageByTypeticket  {
    icon: string;
    quantity: number;
    averageHours: number;
    typeticket: string;
}

export interface Technical {
    key: string;
    value:string;
}

export class DashboardSend  {
    enterpriseId: string = '';
    categoryId: string = '';
    initialDate: string = '';
    endDate: string = '';
    tipoTicket: string = '';
}

export interface DashboardResponse  {
    averageByTypeticket: AverageByTypeticket[];
    categorySerie: string;
    subCategorySerie: string;
    impactSerie: string;
    motiveSerie: string;
    acceptance: string;
    technical: Technical;
}

export interface  QueryMaster {
    number:number;

    category: string;
    closeAt: Date;
    code: string;
    createdAt: Date;

    createdBy: string;
    hours: number;
    lifeTime: string;
    observation: string;

    status: string;
    subCategory: string;
    technical: string;
    title: string;

    total: number;
    typeTicket: string;
}
export interface LisInformationSystem  {
    queryMaster:QueryMaster[];
}

