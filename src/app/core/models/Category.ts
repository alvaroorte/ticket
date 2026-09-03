import { Base } from "./base";

export class Category extends Base {
    id: number;
    folder: string;
    value: string;
    description: string;
    image: string;
    name: string;
    status: boolean;
}

export class SubcategoryShort  {
    id: number;
    name: string;
    image: string;
}

export class CategoryShort  {
    id: number;
    name: string;
    image: string;
    description: string;
    subCategories: SubcategoryShort[]
}

export class CategoryShortWithFilterSubcategory  {
    id: number;
    name: string;
    image: string;
    subCategories: SubcategoryShort[];
    subCategoriesForFilter: string
}


export interface CategoryWithEnterprise  {
    category: CategoryShort;
    enterpriseId: number;
    enterpriseName: string;
    hasCostCenter: boolean;
}

export class CategoryResponse extends Base  {
    id: number;
    name: string;
    image: string;
    description: string;
}

export class SubcategoryForAsignToCategory {
    code: string;
    description: string;
    id: number;
    name: string;
    status: boolean;
}

export class SubcategorySendAddToCategory {
    category: number;
    subCategory: number;
}

