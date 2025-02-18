export class EnterpriseCategory  {
    id: number | null = null;
    category: string | null = null;
    categoryId: number = 0;
    subCategory: string | null = null;
    subCategoryId: number = 0;
    leader: string | null = null;
    teamName: string | null = null;
    status?: boolean | null = false;
    isPublic?: boolean | null = false;
    enterpriseCategoryId: number | null = null;
    team: number | null = null;
    enterprise: number | null = null;
}

export interface EnterpriseCategoryTableDouble  {
    id: number;
    category: string;
    categoryId: number;
    description: string;
    status: string;
    subCategory: string;
    subCategoryId: number;
    teamName: string;
}

export class EnterpriseCategorySend  {
    enterprise: number | null = null;
    team: number | null = null;
    category: number | null = null;
    subCategory?: number | null = null;
    status?: boolean | null = null;
    isPublic?: boolean | null = null;
}
