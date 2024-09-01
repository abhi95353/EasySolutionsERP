import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, UrlTree, Router } from '@angular/router';
import { Observable } from 'rxjs';
import { MasterAPIsServicesService } from './apis/master-apis-services.service';

@Injectable({
  providedIn: 'root'
})
export class PermitsGuardGuard implements CanActivate {
  constructor(private router:Router , private apis:MasterAPIsServicesService){}
  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
      var permits:any = localStorage.getItem('permits')
      permits = JSON.parse(permits)
      console.log(permits);

      
    if (
      localStorage.getItem('user_type') === 'SuperAdmin' ||
      localStorage.getItem('user_type') === 'Admin' 
    ) {
      return true;
    } 
      if(permits == null){
        this.apis.showNotifications('error' , 'Authenticated Access')
        return false
      }
      for (let index = 0; index < permits.length; index++) {
        const element = permits[index];
        if(element.permit_name == "Attendance")
        {
          return true
        }
        }
        this.apis.showNotifications('error' , 'Authenticated Access')
        return false
  }
  
}
