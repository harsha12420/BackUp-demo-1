import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class LocalStorageService {
  setLocalStore = (key, data) => {
    return localStorage.setItem(key, data);
  };

  getLocalStore = (key) => {
    return localStorage.getItem(key);
  };

  clearStorageFor = (key) => {
    return localStorage.removeItem(key);
  };

  clearStorage = () => {
    return localStorage.clear();
  };
}
