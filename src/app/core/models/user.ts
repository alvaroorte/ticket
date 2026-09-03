import { Role } from "./Role";

export class User  {
    active:         boolean;
    createdBy:      string;
    updatedBy:      string;
    createdAt:      string;
    updatedAt:      string;
    id:             number;
    username:       string;
    email:          string;
    phone:         string;
    internal_phone: string;
    city:           string;
    ubication:      string;
    ldap:           boolean;
    roles:          Role[] = [];
    rolesString:    string;
}