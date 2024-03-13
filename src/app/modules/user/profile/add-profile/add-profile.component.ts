import { HttpClient } from '@angular/common/http';
import { Component } from '@angular/core';
import { USER_ROLE_TYPE } from 'src/app/Constants/constants';
import { ApiService } from 'src/app/services/api.service';
import { EncryptDecryptUserroleService } from 'src/app/services/encrypt-decrypt-userrole.service';
import { LocalStorageService } from 'src/app/services/local-storage.service';
import { UtilityService } from 'src/app/services/utility.service';
import { LOCAL_STORAGE_KEYS } from 'src/app/Constants/constants';

@Component({
  selector: 'app-add-profile',
  templateUrl: './add-profile.component.html',
  styleUrls: ['./add-profile.component.scss'],
})
export class AddProfileComponent {
  userProfile: any;
  userRoleType = USER_ROLE_TYPE;
  userRole;
  isEdit = false;
  constructor(
    private apiService: ApiService,
    private encryptDataService: EncryptDecryptUserroleService,
    public http: HttpClient,
    private utils: UtilityService,
    private localstorage: LocalStorageService
  ) { }

  async ngOnInit() {
    this.userRole = await this.encryptDataService.getAndDecryptData();
    await this.getUserProfile();
  }
  async getUserProfile() {
    this.utils.showLoading();
    const response: any = await this.apiService.userProfile();
    if (response.statusCode === 200) {
      this.userProfile = response.data;
      this.utils.setUserData(response.data)
    }
    this.utils.hideLoading();
  }

  async onEdit() {
    this.isEdit = !this.isEdit;
  }

  async onEditEmitter() {
    this.isEdit = false;
    this.getUserProfile();
  }
}
