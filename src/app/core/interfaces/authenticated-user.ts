import { ROLES_CODE_SYSTEM } from "@core/enums/roles";

export interface AuthenticatedUser {
  iat: number;
  exp: number;
  isAdmin: boolean;
  sub: string ;
  userId: number;
  userEmail: string;
  authorities: ROLES_CODE_SYSTEM[]
}
