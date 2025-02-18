import { Permission } from "./Permission";

export class Role  {
    id: number | null = null;
    code: string | null = null;
    description: string | null = null;
    name: string | null = null;
    permissions: Permission[] | null = null;
}

export class RoleResponse  {
    id: number | null = null;
    description: string | null = null;
    folder: string | null = null;
    icon: string | null = null;
    principalView: string | null = null;
    value: string | null = null;
    urlImage: string | null = null;
}

export interface RoleWithPermissions {
    roleId: number,
    permissionsIds: number[]
}
