import { Injectable } from '@angular/core';
import { HttpInterceptor } from '@angular/common/http';
import { HttpRequest } from '@angular/common/http';
import { HttpHandler } from '@angular/common/http';
import { HttpEvent } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable()
export class CustomHttpInterceptor implements HttpInterceptor {
  constructor() {}

  intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    return this.setHeaders(request, next);
  }

  private setHeaders(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    // check request headers
    if (!request.headers.get('accept')) {
        // set headers
        request = request.clone({
            setHeaders: {
                accept: `application/json`,
            },
        });
    }

    return next.handle(request);
  }

}
