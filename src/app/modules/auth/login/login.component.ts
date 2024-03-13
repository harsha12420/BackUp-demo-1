import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import {
  LOCAL_STORAGE_KEYS,
  ROUTE_PATH,
  Constants,
  REDIRECT_ROUTE_PATH,
} from 'src/app/Constants/constants';
import { LocalStorageService } from '../../../services/local-storage.service';
import { RegexEnum } from 'src/app/Constants/regex';
import { UtilityService } from '../../../services/utility.service';
import { AuthService } from '../../../services/auth/auth.service';
import { EncryptDecryptUserroleService } from 'src/app/services/encrypt-decrypt-userrole.service';
import { environment } from '../../../../environments/environment';
import { getMessaging, getToken } from 'firebase/messaging';
import { CookieService } from 'ngx-cookie-service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
})
export class LoginComponent {
  loginForm: FormGroup;
  submitted: boolean = false;
  messageList: any;
  message: any = null;
  fcmToken: any;
  osNumber: any;
  showPassword = false;
  isSubmitting = false;

  constructor(
    private localstorage: LocalStorageService,
    private router: Router,
    private fb: FormBuilder,
    private UtilityService: UtilityService,
    private authService: AuthService,
    private encryptDataService: EncryptDecryptUserroleService,
    private cookieService: CookieService
  ) { }
  ngOnInit(): void {
    this.osNumber = this.getOperatingSystem();
    this.cookieService.set('device_type', this.osNumber);

    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(8)]],
      user_type: [Constants.USER_ROLE],
      device_type: this.osNumber,
    });
  }
  togglePasswordVisibility() {
    this.showPassword = !this.showPassword;
  }

  get form() {
    return this.loginForm.controls;
  }
  async login() {
    try {
      this.submitted = true;
      if (this.loginForm.valid) {
        this.isSubmitting = true;
        this.UtilityService.showLoading();
        const rep: any = await this.authService.login(this.loginForm.value);
        if (rep.statusCode == 200) {
          this.localstorage.setLocalStore(
            LOCAL_STORAGE_KEYS.TOKEN,
            rep.data.token
          );
          this.localstorage.setLocalStore(
            LOCAL_STORAGE_KEYS.REFRESH_TOKEN,
            rep.data.refreshToken
          );
          this.UtilityService.setUserData(rep.data);
          await this.encryptDataService.setAndEncryptData(rep.data.userRole);
          this.requestPermission();
          this.UtilityService.hideLoading();
          this.router.navigate([REDIRECT_ROUTE_PATH.DASHBOARD]);
          this.UtilityService.showSuccessToast(rep.message);
          this.isSubmitting = false;
        }
      }
    } catch (err: any) {
      this.isSubmitting = false;
      this.UtilityService.hideLoading();
    }
  }

  removeSpace(event: any) {
    if (event.target.value.trim() === '') {
      event.target.value = '';
    }
  }
  navigateToForgetPassword() {
    this.router.navigate([ROUTE_PATH.AUTH, ROUTE_PATH.FORGOT_PASSWORD]);
  }
  requestPermission() {
    const messaging = getMessaging();
    getToken(messaging, { vapidKey: environment.firebase.vapidKey })
      .then(async (currentToken) => {
        if (currentToken) {
          const obj = {
            fcm_token: currentToken,
            device_type: this.osNumber,
          };
          const response: any = await this.authService.fcmToken(obj);
          if (response.statusCode === 200) {
            const newToken = currentToken ? currentToken : '';
            this.cookieService.set('fcm_token', newToken);
          }
        }
      })
  }

  getOperatingSystem() {
    const platform = navigator.platform.toLowerCase();
    if (platform.includes('win')) {
      return 0; // Windows
    } else if (
      platform.includes('iphone') ||
      platform.includes('ipad') ||
      platform.includes('ipod')
    ) {
      return 1; // iOS
    } else if (platform.includes('android')) {
      return 2; // Android
    } else if (platform.includes('mac')) {
      return 3; // Mac
    } else if (platform.includes('linux')) {
      return 4; // Linux
    } else {
      return 5; // Other or unknown
    }
  }
}
