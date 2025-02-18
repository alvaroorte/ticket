import { inject } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivateFn, Router } from '@angular/router';
import { LocalStorageService } from '@core/services/local-storage.service';
import { LoginService } from '@core/services/login.service';
import { urlsWithPermissions } from '@core/constants/constants';


export const authGuard: CanActivateFn = (route) => {
  let result: boolean = false;
  const router = inject(Router);
  const localStorageService = inject(LocalStorageService);
  const loginService = inject(LoginService);
  if ( localStorageService.get('token') ) {
    result = verifyRouteByRole(route, localStorageService.get('role')!);
    (!result)? router.navigate(['/404']): '';
  } else {
    router.navigate(['/']);
    loginService.eventOpenFormLogin.emit();
    result = false;
  }
  return result;
};

const verifyRouteByRole = (route: ActivatedRouteSnapshot, role: string):boolean => {
  let url = urlsWithPermissions.find(url => url.routerLink == route.url.join('/'));
  if (url?.access.includes(role? role: '')) {
    return true;
  }
  return false;
}
