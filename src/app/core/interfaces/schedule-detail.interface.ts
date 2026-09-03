import { Base } from "../models/base";

export interface ScheduleDetail extends Base {
    id: number;
    dayOfWeek: string;
    startHour: string;
    endHour: string;
    breakStartHour: string;
    breakEndHour: string;
}
