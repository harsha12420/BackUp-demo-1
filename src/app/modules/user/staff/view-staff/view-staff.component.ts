import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ApiService } from 'src/app/services/api.service';
import { UtilityService } from 'src/app/services/utility.service';

@Component({
  selector: 'app-view-staff',
  templateUrl: './view-staff.component.html',
  styleUrls: ['./view-staff.component.scss'],
})
export class ViewStaffComponent implements OnInit {
  userId;
  userDetails: any = {};
  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private apiService: ApiService,
    private utils: UtilityService
  ) {
    this.userId = this.route.snapshot.params['id'];
    if (isNaN(this.userId)) {
      this.router.navigate(['/admin/staff']);
    }
  }

  ngOnInit() {
    this.getStaffDetailsById();
  }

  async getStaffDetailsById() {
    this.utils.showLoading();
    const queryList = `?user_id=${this.userId}`;
    const response: any = await this.apiService.getStaffList(queryList);
    if (response.data) {
      this.userDetails = response.data;
      this.userDetails.primary_role = this.userDetails.user_role
      this.userDetails.user_role = this.userDetails.user_role.filter(item => !item.is_primary)
      this.utils.hideLoading();
    } else {
      this.utils.hideLoading();
      this.router.navigate(['/admin/staff']);
    }
  }

  async onEdit() {
    this.router.navigate(['/admin/staff/add-staff'], {
      queryParams: { userId: this.userId },
    });
  }

  getFileExtension(url) {
    if (url && url.split('.').pop() == 'pdf') {
      return 'pdf';
    }
    return 'img';
  }

  previewDoc(url) {
    let a = document.createElement('a');
    a.href = url;
    a.target = '_blank';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  }
}
