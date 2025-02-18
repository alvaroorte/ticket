export interface Gantt  {
    status: string,
    current: number,
    dates: DatesGantt[]
}


interface DatesGantt  {
    inHandsOf: string,
    createdAt: number,
    closeAt: number;
}