import { Injectable } from '@angular/core';
import {
  CanActivate,
  ActivatedRouteSnapshot,
  RouterStateSnapshot,
  UrlTree,
} from '@angular/router';
import { Observable } from 'rxjs';
import { MasterAPIsServicesService } from './apis/master-apis-services.service';

@Injectable({
  providedIn: 'root',
})
export class LoginGuardGuard implements CanActivate {
  constructor(private apis: MasterAPIsServicesService) {}
  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ):
    | Observable<boolean | UrlTree>
    | Promise<boolean | UrlTree>
    | boolean
    | UrlTree {
    if (
      localStorage.getItem('user_type') === 'SuperAdmin' ||
      localStorage.getItem('user_type') === 'Admin' ||
      localStorage.getItem('user_type') === 'Staff'
    ) {
      var permits: any = localStorage.getItem('permits');
      permits = JSON.parse(permits);
      if (permits != null) {
        if (permits.length == 0) {
          this.apis.showNotifications('error', 'Authenticated Access');
          return false;
        }
      }
      return true;
    } else {
      return false;
    }
  }
}
