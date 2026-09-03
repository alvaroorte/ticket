import { MenuHeader } from "@core/models/Header";
import { ROLES_CODE_SYSTEM } from "../enums/roles";
import { TYPE_VIEW_LIST_TICKET } from "./ticket-view-type";

export const urlsWithPermissions: MenuHeader[] = [
  { routerLink: 'incidents', label: 'Nuevo incidente', access: [ROLES_CODE_SYSTEM.MONITOR, ROLES_CODE_SYSTEM.ADMIN], show: false },
  { routerLink: 'new-ticket', label: 'Nuevo ticket', access: [ROLES_CODE_SYSTEM.REQUESTER, ROLES_CODE_SYSTEM.ADMIN], show: false },
  { routerLink: `tickets/${TYPE_VIEW_LIST_TICKET.myTicket}`, label: 'Mis Tickets', access: [ROLES_CODE_SYSTEM.REQUESTER, ROLES_CODE_SYSTEM.ADMIN], show: true, icon: 'pi pi-ticket'},
  { routerLink: `tickets/${TYPE_VIEW_LIST_TICKET.pending}`, label: 'Mis Pendientes', access: [ROLES_CODE_SYSTEM.TECHNICIAN, ROLES_CODE_SYSTEM.LEADER, ROLES_CODE_SYSTEM.ADMIN], show: true, icon: 'pi pi-clipboard'},
  { routerLink: `tickets/${TYPE_VIEW_LIST_TICKET.approver}`, label: 'Tickets por Aprobar', access: [ROLES_CODE_SYSTEM.APPROVER_MODERATOR, ROLES_CODE_SYSTEM.ADMIN], show: true, icon: 'pi pi-list-check'},
  { routerLink: 'tickets-historical', label: 'Histórico', access: [ROLES_CODE_SYSTEM.REQUESTER, ROLES_CODE_SYSTEM.ADMIN], show: true, icon: 'pi pi-calendar-clock'},
  { routerLink: 'management-teams', label: 'Asignaciones', access: [ROLES_CODE_SYSTEM.TECHNICIAN, ROLES_CODE_SYSTEM.LEADER, ROLES_CODE_SYSTEM.SUPERVISOR, ROLES_CODE_SYSTEM.ADMIN], show: true, icon: 'pi pi-users'},
  { routerLink: 'enterprises', label: 'Empresas', access: [ROLES_CODE_SYSTEM.LEADER, ROLES_CODE_SYSTEM.ADMIN, ROLES_CODE_SYSTEM.SUPERVISOR], icon: 'pi pi-building', show: false},
  { routerLink: 'teams', label: 'Equipos', access: [ROLES_CODE_SYSTEM.LEADER, ROLES_CODE_SYSTEM.ADMIN], icon: 'pi pi-users', show: false},
  { routerLink: 'categories', label: 'Categorías', access: [ROLES_CODE_SYSTEM.LEADER, ROLES_CODE_SYSTEM.ADMIN], icon: 'pi pi-sitemap', show: false},
  { routerLink: 'countries', label: 'Países', access: [ROLES_CODE_SYSTEM.ADMIN], icon: 'pi pi-compass', show: false},
  { routerLink: 'holidays', label: 'Feriados', access: [ROLES_CODE_SYSTEM.ADMIN], icon: 'pi pi-calendar', show: false},
  { routerLink: 'schedules', label: 'Horarios', access: [ROLES_CODE_SYSTEM.ADMIN], icon: 'pi pi-clock', show: false},
  { routerLink: 'supervisor', label: 'Supervisor', access: [ROLES_CODE_SYSTEM.ADMIN], icon: 'pi pi-eye', show: false},
  { routerLink: 'incident-titles', label: 'Títulos de incidentes', access: [ROLES_CODE_SYSTEM.ADMIN, ROLES_CODE_SYSTEM.MONITOR], icon: 'pi pi-book', show: false},
  { routerLink: 'observer-group', label: 'Grupo de observadores', access: [ROLES_CODE_SYSTEM.ADMIN, ROLES_CODE_SYSTEM.LEADER, ROLES_CODE_SYSTEM.SUPERVISOR], icon: 'pi pi-eye', show: false},
  { routerLink: 'roles', label: 'Accesos', access: [ROLES_CODE_SYSTEM.ADMIN], icon: 'pi pi-cog', show: false},
  { routerLink: 'users', label: 'Usuarios', access: [ROLES_CODE_SYSTEM.ADMIN], icon: 'pi pi-user', show: false},
  { routerLink: 'parameters', label: 'Parámetros', access: [ROLES_CODE_SYSTEM.ADMIN], icon: 'pi pi-align-justify', show: false},
  { routerLink: 'reports', label: 'Reportes', access: [ROLES_CODE_SYSTEM.ADMIN, ROLES_CODE_SYSTEM.SUPERVISOR], icon: 'pi pi-chart-bar', show: true},
];
  
export const configurationLinks: string[] = [ 
  'enterprises', 
  'teams', 
  'categories', 
  'countries', 
  'holidays', 
  'schedules', 
  'supervisor', 
  'incident-titles', 
  'observer-group', 
  'roles', 
  'users', 
  'parameters'
];