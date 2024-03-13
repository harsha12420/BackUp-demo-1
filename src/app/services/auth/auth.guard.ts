import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { AuthService } from '../auth/auth.service';
import { LocalStorageService } from '../local-storage.service';
import { ROUTE_PATH } from 'src/app/Constants/constants';

@Injectable({
  providedIn: 'root',
})
export class AuthGuard implements CanActivate {
  constructor(
    private router: Router,
    private auth: AuthService,
    private storageService: LocalStorageService
  ) { }

  canActivate(): boolean {
    if (this.auth.isAuthenticated()) {
      return true;
    } else {
      this.router.navigate([ROUTE_PATH.AUTH, ROUTE_PATH.LOGIN]);
      this.storageService.clearStorage();
      return false;
    }
  }
}
