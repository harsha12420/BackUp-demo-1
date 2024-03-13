import { Component } from '@angular/core';
import { ApiService } from 'src/app/services/api.service';
import { UtilityService } from 'src/app/services/utility.service';

@Component({
  selector: 'app-user',
  templateUrl: './user.component.html',
  styleUrls: ['./user.component.scss'],
})
export class UserComponent {
  constructor(private apiService: ApiService, private utils: UtilityService) { }

  async ngOnInit() {
    await this.getUserProfile();
  }

  async getUserProfile() {
    this.utils.showLoading();
    const response: any = await this.apiService.userProfile()
    if (response.statusCode === 200) {
      this.utils.setUserData(response.data)
    }
    this.utils.hideLoading();
  }
}
