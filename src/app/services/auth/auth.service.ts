import { Injectable } from '@angular/core';
import { LocalStorageService } from '../local-storage.service';
import { API_PATH, LOCAL_STORAGE_KEYS } from 'src/app/Constants/constants';
import { BehaviorSubject, Observable } from 'rxjs';
import { HttpRequestsService } from '../http-requests.service';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  public currentUserSubject: BehaviorSubject<any>;
  public currentUser: Observable<any>;
  constructor(
    private localstorage: LocalStorageService,
    private http: HttpRequestsService
  ) {
    this.currentUserSubject = new BehaviorSubject<boolean>(
      !!this.localstorage.getLocalStore(LOCAL_STORAGE_KEYS.TOKEN)
    );
    this.currentUser = this.currentUserSubject.asObservable();
  }

  public isAuthenticated(): boolean {
    return !!this.localstorage.getLocalStore(LOCAL_STORAGE_KEYS.TOKEN);
  }
  public get currentUserValue() {
    return this.currentUserSubject.asObservable();
  }
  login = async (data: any) => {
    return this.http.post(API_PATH.AUTHENTICATION.LOGIN, data, true);
  };

  forgotPassword = async (data) => {
    return this.http.post(API_PATH.AUTHENTICATION.FORGOT_PASS, data, true);
  };
  verifyResetToken = async (data) => {
    return this.http.post(
      API_PATH.AUTHENTICATION.VERIFY_RESET_TOKEN,
      data,
      true
    );
  };

  resetPassword = async (data) => {
    return this.http.post(API_PATH.AUTHENTICATION.RESET_PASSWORD, data, true);
  };
  fcmToken = async (data) => {
    return this.http.post(API_PATH.AUTHENTICATION.FCM_TOKEN, data);
  };
  Logout = async (data) => {
    return this.http.post(API_PATH.AUTHENTICATION.LOGOUT, data);
  };
  changePassword = async (data: any) => {
    return this.http.post(API_PATH.AUTHENTICATION.CHANGE_PASSWORD, data);
  };
}
