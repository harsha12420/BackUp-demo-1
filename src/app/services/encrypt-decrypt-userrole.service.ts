import { Injectable } from '@angular/core';
import * as CryptoJS from 'crypto-js';
import { LocalStorageService } from './local-storage.service';
import { LOCAL_STORAGE_KEYS } from '../Constants/constants';

@Injectable({
  providedIn: 'root'
})
export class EncryptDecryptUserroleService {
  private encryptionKey: string = 'your-strong-encryption-key';

  constructor(private localstorageService: LocalStorageService) {
  }

  async setAndEncryptData(data: any) {
    const encryptedData = CryptoJS.AES.encrypt(data.toString(), this.encryptionKey).toString();
    this.localstorageService.setLocalStore(LOCAL_STORAGE_KEYS.USER_ROLE, encryptedData);
  }

  async getAndDecryptData() {
    const encryptedData = this.localstorageService.getLocalStore(LOCAL_STORAGE_KEYS.USER_ROLE);
    if (encryptedData) {
      const decryptedBytes = await CryptoJS.AES.decrypt(encryptedData, this.encryptionKey);
      const decryptedData = await decryptedBytes.toString(CryptoJS.enc.Utf8);
      return decryptedData;
    }
    return null;
  }
}
