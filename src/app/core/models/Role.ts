import { ROLES_CODE_SYSTEM } from "@core/enums/roles";
import { Base } from "./base";
import { Permission } from "./Permission";

export class Role extends Base {
    id: number;
    name: string;
    code: ROLES_CODE_SYSTEM;
    description: string;
    permissions: Permission[];
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
