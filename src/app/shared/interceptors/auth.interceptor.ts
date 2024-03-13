import { Injectable } from '@angular/core';
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor
} from '@angular/common/http';
import { Observable, catchError, switchMap, throwError, from, map } from 'rxjs';
import { HttpRequestsService } from 'src/app/services/http-requests.service';
import { LocalStorageService } from 'src/app/services/local-storage.service';
import { LOCAL_STORAGE_KEYS } from 'src/app/Constants/constants';

@Injectable()
export class AuthInterceptor implements HttpInterceptor {

  constructor(private http: HttpRequestsService, private localstorege: LocalStorageService) { }

  intercept(request: HttpRequest<unknown>, next: HttpHandler): Observable<HttpEvent<unknown>> {
    return next.handle(request).pipe(
      catchError(error => {
        if (error.status === 401) {
          // Token expired, initiate refresh token logic
          return this.handle401Error(request, next);
        }
        return throwError(error);
      })
    );
  }

  private handle401Error(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    const res = this.http.generateToken();
    return from(res).pipe(map((res: any) => {
      this.localstorege.setLocalStore(
        LOCAL_STORAGE_KEYS.TOKEN,
        res.data.token
      );
      this.localstorege.setLocalStore(
        LOCAL_STORAGE_KEYS.REFRESH_TOKEN,
        res.data.refreshToken
      );
      request = request.clone({
        setHeaders: {
          Authorization: `Bearer ${res.data.token}`
        }
      })
      return res
    }))
      .pipe(
        switchMap(() => next.handle(request))
      )
  }
}
