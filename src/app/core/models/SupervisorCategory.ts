export class SupervisorCategory  {
    id: number | null = null;
    categoria: string | null = null;
    lider: string | null = null;
    equipo: string | null = null;
}

export interface SupervisorCategorySend  {
    supervisor: number;
    enterprise: number;
    category: number;
    subCategory: number;
}

export interface SupervisorDetailDelete  {
    supervisorDetail: number;
}