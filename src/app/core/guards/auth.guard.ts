import { inject } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivateFn, Router } from '@angular/router';
import { LocalStorageService } from '@core/services/local-storage.service';
import { LoginService } from '@core/services/login.service';
import { LOCAL_STORAGE } from '@core/constants/local-storage';
import { urlsWithPermissions } from '@core/constants/header-links';


export const authGuard: CanActivateFn = (route) => {
  let result: boolean = false;
  const router = inject(Router);
  const localStorageService = inject(LocalStorageService);
  const loginService = inject(LoginService);
  const token = localStorageService.get(LOCAL_STORAGE.TOKEN);
  if ( token ) {
    result = verifyRouteByRole(route, loginService.rolesUser());
    (!result)? router.navigate(['/404']): '';
  } else {
    loginService.logout();
    result = false;
  }
  return result;
};

const verifyRouteByRole = (route: ActivatedRouteSnapshot, roles: string[]): boolean => {
  const url = urlsWithPermissions.find(url => url.routerLink == route.url.join('/'));
  for (let i = 0; i < url?.access.length; i++) {
    const role = url.access[i];
    if (roles.includes(role)) {
      return true;
    }
  }
  return false;
}
