import { Routes } from '@angular/router';
import { authGuard } from '@core/guards/auth.guard';

export const routes: Routes = [
  { path: '', redirectTo: '/login', pathMatch: 'full' },
  { path: 'tickets', redirectTo: '/', pathMatch: 'full' },
  { path: 'home', redirectTo: '/', pathMatch: 'full' },
  {
    path: 'login',
    loadComponent: () => import('./modules/login/login.component').then(c => c.LoginComponent),
  },
  {
    path: 'new-ticket',
    loadComponent: () => import('./modules/home/home.component').then(c => c.HomeComponent),
    canActivate: [authGuard]
  },
  {
    path: 'enterprises',
    loadComponent: () => import('./modules/enterprises/enterprises.component').then(c => c.EnterprisesComponent),
    canActivate: [authGuard]
  },
  {
    path: 'teams',
    loadComponent: () => import('./modules/team/team.component').then(c => c.TeamComponent),
    canActivate: [authGuard]
  },
  {
    path: 'parameters',
    loadComponent:  () => import('./modules/parameters/parameters.component').then(p => p.ParametersComponent),
    canActivate: [authGuard]
  },
  {
    path: 'categories',
    loadComponent:  () => import('./modules/categories/categories.component').then(c => c.CategoriesComponent),
    canActivate: [authGuard]
  },
  {
    path: 'tickets/:typeOfListTicket',
    loadComponent: () => import('./modules/tickets/tickets.component').then(c => c.TicketsComponent),
    canActivate: [authGuard]
  },
  {
    path: 'tickets-historical',
    loadComponent: () => import('./modules/tickets-historical/tickets-historical.component').then(c => c.TicketsHistoricalComponent),
    canActivate: [authGuard]
  },
  {
    path: 'management-teams',
    loadComponent: () => import('./modules/management-teams/management-teams.component').then(c => c.ManagementTeamsComponent),
    canActivate: [authGuard]
  },
  {
    path: 'supervisor',
    loadComponent: () => import('./modules/supervisor/supervisor.component').then(c => c.SupervisorComponent),
    canActivate: [authGuard]
  },
  {
    path: 'roles',
    loadComponent: () => import('./modules/role/role.component').then(c => c.RoleComponent),
    canActivate: [authGuard]
  },
  {
    path: 'countries',
    loadComponent: () => import('./modules/country/country.component').then(c => c.CountryComponent),
    canActivate: [authGuard]
  },
  {
    path: 'holidays',
    loadComponent: () => import('./modules/holiday/holiday.component').then(c => c.HolidayComponent),
    canActivate: [authGuard]
  },
  {
    path: 'schedules',
    loadComponent: () => import('./modules/schedule/schedule.component').then(c => c.ScheduleComponent),
    canActivate: [authGuard]
  },
  {
    path: 'incidents',
    loadComponent: () => import('./modules/ticket-incident/ticket-incident.component').then(c => c.TicketIncidentComponent),
    canActivate: [authGuard]
  },
  {
    path: 'users',
    loadComponent: () => import('./modules/user/user.component').then(c => c.UserComponent),
    canActivate: [authGuard]
  },
  {
    path: 'incident-titles',
    loadComponent: () => import('./modules/incident-title/incident-title.component').then(c => c.IncidentTitleComponent),
    canActivate: [authGuard]
  },
  {
    path: 'reports',
    loadComponent: () => import('./modules/reports/reports.component').then(c => c.ReportsComponent),
    canActivate: [authGuard]
  },
  {
    path: 'observer-group',
    loadComponent: () => import('./modules/observer-group/observer-group.component').then(c => c.ObserverGroupComponent),
    canActivate: [authGuard]
  },
  {
    path: '**',
    pathMatch: 'full',
    loadComponent: () => import('./shared/components/nout-found/nout-found.component').then(c => c.NoutFoundComponent)
  }
];
