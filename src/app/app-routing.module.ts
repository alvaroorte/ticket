import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomeComponent } from './modules/home/home.component';
import { authGuard } from '@core/guards/auth.guard';

const routes: Routes = [
  { path: '', redirectTo: '/welcome', pathMatch: 'full' },
  {
    path: 'welcome',
    loadComponent: () => import('./modules/welcome/welcome.component').then(c => c.WelcomeComponent),
  },
  {
    path: 'home',
    component: HomeComponent,
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
    loadChildren:  () => import('./modules/parameters/parameters.module').then(m => m.ParametersModule),
    canActivate: [authGuard]
  },
  {
    path: 'categories',
    loadComponent:  () => import('./modules/categories/categories.component').then(c => c.CategoriesComponent),
    canActivate: [authGuard]
  },
  {
    path: 'tickets/:typeTicketCard',
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
    path: 'reports',
    loadComponent: () => import('./modules/reports/reports.component').then(c => c.ReportsComponent),
    canActivate: [authGuard]
  },
  {
    path: 'follow-up',
    loadComponent: () => import('./modules/follow-up/follow-up.component').then(c => c.FollowUpComponent),
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
    path: '**',
    pathMatch: 'full',
    loadComponent: () => import('./shared/components/nout-found/nout-found.component').then(c => c.NoutFoundComponent)
  }  
];

@NgModule({
  imports: [ RouterModule.forRoot(routes,{ bindToComponentInputs: true } ) ],
  exports: [ RouterModule ]
})
export class AppRoutingModule { }