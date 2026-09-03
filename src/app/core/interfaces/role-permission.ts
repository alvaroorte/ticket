import { Permission } from "@core/models/Permission";

export interface RolePermission {
    assigned: Permission[];
    unassigned: Permission[];
}