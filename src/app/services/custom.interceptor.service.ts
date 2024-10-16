import { HttpEvent, HttpHandler, HttpInterceptor, HttpRequest } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { request } from 'http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})

@Injectable()
export class CustomInterceptorService implements HttpInterceptor {


  constructor() { }
  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {

    const localToken = localStorage.getItem('accessToken');
    req = req.clone({
      headers: req.headers.set('authorization', `${localToken}`)
    });
    return next.handle(req);
  }
}
