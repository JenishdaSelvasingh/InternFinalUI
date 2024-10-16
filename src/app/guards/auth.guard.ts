import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, CanActivateChild, CanDeactivate, CanLoad, CanMatch, Route, Router, RouterStateSnapshot, UrlSegment, UrlTree } from '@angular/router';
import { Observable } from 'rxjs';
import { AuthServiceService } from '../services/auth-service.service';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate  {
  constructor(private authService: AuthServiceService, private router: Router) {}

  canActivate(): boolean {
    return this.checkAuth();
  }

  // canActivateChild(): boolean {
  //   return this.checkAuth();
  // }


  // canLoad(): boolean {
  //   return this.checkAuth();
  // }

  private checkAuth(): boolean {
    if (this.authService.isAuthenticatedUser()) {
      return true;
    } else {
      this.router.navigate(['/login']);
      return false;
    }
  }

}