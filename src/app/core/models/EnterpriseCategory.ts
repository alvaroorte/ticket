import { teamCategorySubCategory } from "@core/interfaces/enterprise.interface";
import { IParameterSelect } from "./Parameter";

export interface ApproverModeratorShortEnterpriseCategory {
    id: number;
    email: string;
}

export interface ApproversAndModeratorsEnterpriseCategory {
    approvers: ApproverModeratorShortEnterpriseCategory[];
    moderators: ApproverModeratorShortEnterpriseCategory[];
}
export class EnterpriseCategory  {
    id: number;
    categoryId:           number;
    subCategoryId:        number;
    enterpriseId:         number;
    enterpriseName:       string;
    teamId:               number;
    categoryName:         string;
    subCategoryName:      string;
    teamName:             string;
    enterpriseCategoryId: number;
    approvers:            ApproverModeratorShortEnterpriseCategory[];
    moderators:           ApproverModeratorShortEnterpriseCategory[];
    roles:                string[];
    tags:                 IParameterSelect[];
    rolesString:          string;
}

export interface EnterpriseCategoryTableDouble  {
    id: number;
    category: string;
    categoryId: number;
    description: string;
    status: string;
    subCategory: string;
    subCategoryId: number;
    teamId: number;
    teamName: string;
}

export class EnterpriseCategorySend  {
    enterpriseId: number;
    teamCategorySubCategory: teamCategorySubCategory[];
}

export interface EnterpriseCategoryUpdate  {
    roles: string[];
}

export interface EnterpriseCategoryDetailSend  {
    enterpriseId: number;
    categoryId: number;
    subCategoryId: number;
    approvers: number[];
    moderators: number[];
}

export interface EnterpriseCategorySubcategory  {
    enterpriseId: number;
    categoryId: number;
    subCategoryId: number;
}

export interface ListSubcategoryBody  {
    enterprise: number;
    category: number;
    subCategory: number;
}

export interface IUpdateTags  {
    parametersIds: number[];
}
