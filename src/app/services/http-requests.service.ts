import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from '../../environments/environment';
import { map } from 'rxjs/operators';
import { Router } from '@angular/router';
import { LocalStorageService } from './local-storage.service';
import {
  API_PATH,
  LOCAL_STORAGE_KEYS,
} from '../Constants/constants';
import { UtilityService } from './utility.service';

@Injectable({
  providedIn: 'root',
})
export class HttpRequestsService {
  private hostUrl = environment.API_URL;
  private uploadUrl = environment.UPLOAD_URL;
  constructor(
    public http: HttpClient,
    private router: Router,
    public utilityService: UtilityService,
    private localstorege: LocalStorageService
  ) { }

  /**
   * getHeader(headerOptions, doNotSendAuthorizationParam) => set header option with authorization token base on param
   * @param headerOptions in headeroption
   * @param doNotSendAuthorizationParam in authorization sent or not
   */
  getHeader(headerOptions, doNotSendAuthorizationParam) {
    const headerParams = {};

    headerParams['Accept-Language'] = 'en';
    headerParams['accept-version'] = 'v1';

    if (doNotSendAuthorizationParam !== true) {
      // tslint:disable-next-line: no-string-literal
      headerParams['Authorization'] = `Bearer ${this.localstorege.getLocalStore(
        LOCAL_STORAGE_KEYS.TOKEN
      )}`;
    }
    if (headerOptions) {
      Object.assign(headerParams, headerOptions);
    }
    const headers = new HttpHeaders(headerParams);
    return { headers };
  }

  /**
   * post(url, body, doNotSendAuthorizationParam?, headerOptions?) => post method base on params
   * @param url in url
   * @param body in body param
   * @param doNotSendAuthorizationParam in authorization sent or not
   * @param headerOptions in header option
   */
  post(
    url: string,
    body: any,
    doNotSendAuthorizationParam: boolean = false,
    headerOptions: any = {}
  ) {
    return new Promise((resolve, reject) => {
      const options = this.getHeader(
        headerOptions,
        doNotSendAuthorizationParam
      );
      this.http
        .post(`${this.hostUrl}${url}`, body, options)
        .pipe(map((res) => res))
        .subscribe(
          (res) => {
            resolve(res);
          },
          (err) => {
            this.handleError(err);
            reject(err);
          }
        );
    });
  }
  patch(
    url: string,
    body: any,
    doNotSendAuthorizationParam: boolean = false,
    headerOptions: any = {}
  ) {
    return new Promise((resolve, reject) => {
      const options = this.getHeader(
        headerOptions,
        doNotSendAuthorizationParam
      );
      this.http
        .patch(`${this.hostUrl}${url}`, body, options)
        .pipe(map((res) => res))
        .subscribe(
          (res) => {
            resolve(res);
          },
          (err) => {
            this.handleError(err);
            reject(err);
          }
        );
    });
  }
  /**
   * get(url, doNotSendAuthorizationParam?, headerOptions?) => get method base on params
   * @param url in url
   * @param doNotSendAuthorizationParam in authorization sent or not
   * @param headerOptions in header option
   */
  get(
    url: string,
    doNotSendAuthorizationParam: boolean = false,
    headerOptions: any = {}
  ) {
    return new Promise((resolve, reject) => {
      const options = this.getHeader(
        headerOptions,
        doNotSendAuthorizationParam
      );
      this.http
        .get(`${this.hostUrl}${url}`, options)
        .pipe(map((res) => res))
        .subscribe(
          (res) => {
            resolve(res);
          },
          (err) => {
            this.handleError(err);
            reject(err);
          }
        );
    });
  }

  /**
   * get(url, doNotSendAuthorizationParam?, headerOptions?) => get method base on params
   * @param url in url
   * @param doNotSendAuthorizationParam in authorization sent or not
   * @param headerOptions in header option
   */
  getNoURL(
    url: string,
    doNotSendAuthorizationParam: boolean = false,
    headerOptions: any = {}
  ) {
    return new Promise((resolve, reject) => {
      this.http
        .get(`${url}`)
        .pipe(map((res) => res))
        .subscribe(
          (res) => {
            resolve(res);
          },
          (err) => {
            this.handleError(err);
            reject(err);
          }
        );
    });
  }

  /**
   * put(url, body, doNotSendAuthorizationParam?, headerOptions?) => put method base on params
   * @param url in url
   * @param body in body param
   * @param doNotSendAuthorizationParam in authorization sent or not
   * @param headerOptions in header option
   */
  put(
    url,
    body: any,
    headerOptions: any = {},
    doNotSendAuthorizationParam: boolean = false
  ) {
    return new Promise((resolve, reject) => {
      const options = this.getHeader(
        headerOptions,
        doNotSendAuthorizationParam
      );
      this.http
        .put(`${this.hostUrl}${url}`, body, options)
        .pipe(map((res) => res))
        .subscribe(
          (res) => {
            resolve(res);
          },
          (err) => {
            this.handleError(err);
            reject(err);
          }
        );
    });
  }

  /**
   * delete(url, doNotSendAuthorizationParam?, headerOptions?) => delete method base on params
   * @param url in url
   * @param doNotSendAuthorizationParam in authorization sent or not
   * @param headerOptions in header option
   */
  delete(
    url,
    headerOptions: any = {},
    doNotSendAuthorizationParam: boolean = false
  ) {
    return new Promise((resolve, reject) => {
      const options = this.getHeader(
        headerOptions,
        doNotSendAuthorizationParam
      );
      this.http
        .delete(`${this.hostUrl}${url}`, options)
        .pipe(
          map((res) => {
            return res;
          })
        )
        .subscribe(
          (res) => {
            resolve(res);
          },
          (err) => {
            this.handleError(err);
            reject(err);
          }
        );
    });
  }

  /**
   * handleError(err) => handle error message
   * @param err in arr object
   */
  handleError = async (err) => {
    const error =
      err.error.error || err.error.message
        ? err.error.error || err.error.message
        : 'Internal server error!';
    if (err.status === 400 || err.status === 409) {
      this.utilityService.showErrorToast(err.error.message);
    } else if (err.status === 405) { // to handle error in generating refresh token 
      this.utilityService.showErrorToast(err.error.message);
      this.localstorege.clearStorage();
      this.router.navigate(['/auth/login']);
    } else if (err.status === 500) {
      this.utilityService.showErrorToast(error);
    }
    this.utilityService.hideLoading();
  };

  uploadFile(
    url: string,
    body: any,
    doNotSendAuthorizationParam: boolean = false,
    headerOptions: any = {}
  ) {
    return new Promise((resolve, reject) => {
      const options = this.getHeader(
        headerOptions,
        doNotSendAuthorizationParam
      );
      this.http
        .post(`${this.uploadUrl}${url}`, body, options)
        .pipe(map((res) => res))
        .subscribe(
          (res) => {
            resolve(res);
          },
          (err) => {
            this.handleError(err);
            reject(err);
          }
        );
    });
  }
  generateToken = () => {
    const data = {
      refresh_token: this.localstorege.getLocalStore(
        LOCAL_STORAGE_KEYS.REFRESH_TOKEN
      ) || 'null',
    };
    return this.post(API_PATH.AUTHENTICATION.REGENERATE_TOKEN, data, true);
  };
}
