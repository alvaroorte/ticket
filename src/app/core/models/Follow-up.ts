import { AverageByTypeticket } from "./Report";

export class FollowUpSend  {
    enterpriseId: string = '';
    categoryId: string = '';
    initialDate: string = '';
    endDate: string = '';
    tipoTicket: string = '';
}

export interface HoursFollowProjection  {
    category: string;
    subCategory: string;
    typeTicket: string;
}


export interface FollowUpResponse  {
    averageByTypeticket: AverageByTypeticket[];
    hoursFollow: string;
}


