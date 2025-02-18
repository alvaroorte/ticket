export class EnterpriseCategoryDetail  {
    id: number | null = null;
    approvedid: number | null = null;
    approvedname: string | null = null;
    moderatorid: number | null = null;
    moderatorname: string | null = null;
    subCategoryId: number | null = null;
    subCategory: string | null = null;
    isPublic?: boolean | null = false;
}

export class EnterpriseCategoryDetailSend  {
    enterprise: number | null = null;
    category: number | null = null;
    subCategory: number | null = null;
    moderator: number | null = null;
    approved: number | null = null;
    isPublic?: boolean | null = false
}

export interface ListSubcategoryBody  {
    enterprise: number;
    category: number;
    subCategory: number;
}
