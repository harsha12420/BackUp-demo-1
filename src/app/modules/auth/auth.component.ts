import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { LOCAL_STORAGE_KEYS, REDIRECT_ROUTE_PATH, ROUTE_PATH } from 'src/app/Constants/constants';
import { LocalStorageService } from 'src/app/services/local-storage.service';

@Component({
  selector: 'app-auth',
  templateUrl: './auth.component.html',
  styleUrls: ['./auth.component.scss'],
})
export class AuthComponent {
  userRole: any;
  constructor(
    private localstorage: LocalStorageService,
    private router: Router
  ) { }

  ngOnInit(): void {
    const token = this.localstorage.getLocalStore(LOCAL_STORAGE_KEYS.TOKEN);
    if (token) {
      this.router.navigate([REDIRECT_ROUTE_PATH.DASHBOARD]);
    }
  }
}
