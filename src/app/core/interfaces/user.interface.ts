export interface IFiltersUser {
    page: number;
    size: number;
    sortBy: string | string[];
    sortOrder: string;
}

export interface IUpdateRolesToUSer {
    userAppId: number;
    rolesIds: number[];
}

export interface IAddRoleToUSerByCode {
    userAppId: number;
    roleCode: string;
}

export interface ICredentialUser {
    credentialId: number;
    email: string;
}