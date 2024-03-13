import { Injectable } from '@angular/core';
import { REDIRECT_ROUTE_PATH, ROUTE_PATH, USER_ROLE_TYPE } from 'src/app/Constants/constants';
import { Router } from '@angular/router';
import { EncryptDecryptUserroleService } from '../services/encrypt-decrypt-userrole.service';

@Injectable({
  providedIn: 'root',
})
export class superAdminGuard {
  constructor(
    private router: Router,
    private encryptDataService: EncryptDecryptUserroleService
  ) { }

  async canActivate() {
    const userRole: any = await this.encryptDataService.getAndDecryptData();
    if (+userRole == USER_ROLE_TYPE.superAdmin) return true;
    this.router.navigate([REDIRECT_ROUTE_PATH.DASHBOARD]);
    return false;
  }
}
