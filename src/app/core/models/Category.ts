import { Enterprise } from "./Enterprise";

export class Category  {
    id: number | null = null;
    folder: string | null = null;
    value: string | null = null;
    icon: string | null = null;
    urlImage: string | null = null;
    service: string | null = null;
    name: string | null = null;
}

export class CategoryResponse  {
    id: number | null = null;
    description: string | null = null;
    folder: string | null = null;
    icon: string | null = null;
    principalView: string | null = null;
    value: string | null = null;
    urlImage: string | null = null;
}

export class ServicesByUser  {
    leader: number | null = null;
    listServices: Category[] | null = null;
    technical: number | null = null;
    supervisor: number | null = null;
    enterprise: Enterprise = new Enterprise();
}

