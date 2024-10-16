import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Router } from '@angular/router';
import { Observable, timer } from 'rxjs';
import { JwtHelperService } from '@auth0/angular-jwt';
import * as shajs from 'sha.js';
import { ToastifyRemoteControl } from '@ng-vibe/toastify';
import {
  AppearanceAnimation,
  DisappearanceAnimation,
  ProgressBar,
  TextAlignEnum,
  ToastifyService,
  ToastPosition,
  ToastTypeEnum,
} from '@ng-vibe/toastify';


@Injectable({
  providedIn: 'root'
})
export class AuthServiceService {

  public isAuthenticated = false;
  public expiryTime: number = 60;


  constructor(private http: HttpClient, private router: Router) { }

  login(adminID: string, password: string): Observable<any> {

    const bodyData = {
      "adminID": adminID,
      "password": shajs('sha256').update(password).digest('hex')
    };

    return this.http.post<any>("http://localhost:8080/login", bodyData);
  }

  logout(): void {
    localStorage.removeItem('accessToken');
    localStorage.removeItem('page');
    this.isAuthenticated = false;
    this.router.navigate(['/login']);
  }

  isAuthenticatedUser(): boolean {
    return this.isAuthenticated;
  }

  public service: ToastifyService = inject(ToastifyService);


  openToastSuccess(type: ToastTypeEnum | string) {
    const toast = new ToastifyRemoteControl();
    toast.options = {
      autoCloseDuration: 1000,
      layoutType: type as ToastTypeEnum,
      position: ToastPosition.TOP_RIGHT,
      progressBar: ProgressBar.DECREASE,
      textAlign: TextAlignEnum.START,
      animationIn: AppearanceAnimation.FADE_IN,
      animationOut: DisappearanceAnimation.ZOOM_OUT
    };
    toast.openToast('Request Sent Successfully!');
  }

  // autoLogout(expiryTime: number): void {
  //   const currentTime = new Date().getTime();
  //   const timeLeft = expiryTime - currentTime;
  //   console.log(timeLeft);

  //   if (timeLeft > 0) {
  //     timer(timeLeft).subscribe(() => {
  //       this.logout();
  //     });
  //   } else {
  //     this.logout();
  //   }
  // }

  autoLogout(expiryTime: number): void {
    if (expiryTime > 0) {
      timer(expiryTime).subscribe(() => {
        this.logout();
      });
    } else {
      this.logout();
    }
  }


  autoLogin(): void {
    const accessToken = localStorage.getItem('accessToken');

    if (!accessToken) {
      return;
    }

    const jwtHelper = new JwtHelperService();
    const expirationDate = jwtHelper.getTokenExpirationDate(accessToken);

    if (!expirationDate) {
      this.logout();
      return;
    }

    const currentTime = new Date().getTime();
    const expiryTime = expirationDate.getTime();

    console.log(expiryTime - currentTime);

    if (expiryTime > currentTime) {
      this.isAuthenticated = true;
      this.autoLogout(expiryTime - currentTime);
      const pageValue = localStorage.getItem('page');
      if(pageValue=='user'){
        this.router.navigate(['/new-table-component']);
      } else if(pageValue=='admin'){
        this.router.navigate(['/user-table-component']);
      }
      else if(pageValue=='role'){
        this.router.navigateByUrl('role-component');
      }else if(pageValue=='assetPage'){
        this.router.navigateByUrl('paging');
      }
      
    } else {
      
      this.logout();
    }
  }





  // autoLogin(): void {
  //   const accessToken = localStorage.getItem('accessToken');
  //   const expiryAt = localStorage.getItem('expiryAt');

  //   if (!accessToken || !expiryAt) {
  //     return;
  //   }

  //   const expiryTime = parseInt(expiryAt);
  //   const currentTime = new Date().getTime();

  //   if (expiryTime > currentTime) {
  //     this.isAuthenticated = true;
  //     this.autoLogout(expiryTime);
  //     this.router.navigate(['/user-table-component']);
  //   } else {
  //     this.logout();
  //   }
  // }

}
