import { Base } from "./base";

export class Holiday extends Base {
    id: number;
    day: number;
    month: number;
    year: number;
    reason: string;
    holidayType: string;
    countryId: number;
    countryName: string;
    territorialDivisionId: number;
    territorialDivisionName: string;
}