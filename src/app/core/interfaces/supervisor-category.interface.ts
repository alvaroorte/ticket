export interface ISupervisorCategory  {
    id:              number;
    enterpriseId:    number;
    enterpriseName:  string;
    categoryId:      number;
    categoryName:    string;
    subCategoryId:   number;
    subCategoryName: string;
}

export interface ISupervisorCategoryAssignedUnassigned {
    assigned: ISupervisorCategory[];
    unassigned: ISupervisorCategory[]
}

export interface ICategorySubCategory {
    categoryId: number;
    subCategoryId: number;
}

export interface ISupervisorCategorySave {
    supervisorId: number;
    enterpriseId: number;
    categorySubCategory: ICategorySubCategory[]
}