import { SchedulePojo } from "@core/interfaces/schedule.interface";
import { Base } from "../models/base";

export interface Branch extends Base {
    id: number;
    name: string;
    location: string;
    enterpriseId: number;
    territorialDivisionId: number;
    territorialDivisionName: string;
    countryName: string;
    countryId: number;
}

export interface BranchWithSchedule extends Base {
    id: number;
    name: string;
    location: string;
    enterpriseId: number;
    territorialDivisionId: number;
    territorialDivisionName: string;
    country: string;
    schedulesAssignedToAbranch: SchedulePojo[];
}
