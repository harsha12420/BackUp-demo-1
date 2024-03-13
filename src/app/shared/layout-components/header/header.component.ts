import { Component, HostListener, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { LayoutService } from '../../services/layout.service';
import { NavService } from '../../services/nav.service';
import { SwitcherService } from '../../services/switcher.service';
import { ROUTE_PATH, USER_ROLE_TYPE } from 'src/app/Constants/constants';
import { CookieService } from 'ngx-cookie-service';
import { AuthService } from 'src/app/services/auth/auth.service';
import { UtilityService } from '../../../services/utility.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss'],
})
export class HeaderComponent implements OnInit {
  private body: HTMLBodyElement | any = document.querySelector('body');
  public isCollapsed = true;
  activated: boolean = false;

  scrolled: boolean = false;
  userRole: any;
  userDetails: any;
  @HostListener('window:scroll', [])
  onWindowScroll() {
    this.scrolled = window.scrollY > 70;
  }

  constructor(
    private layoutService: LayoutService,
    public SwitcherService: SwitcherService,
    public navServices: NavService,
    private router: Router,
    private modalService: NgbModal,
    private cookieService: CookieService,
    private authService: AuthService,
    private utils: UtilityService
  ) { }

  ngOnInit(): void {
    this.utils.getUserData().subscribe((res) => {
      if (res) {
        this.userDetails = res;
      }
    });
  }
  toggleSwitcher() {
    this.SwitcherService.emitChange(true);
  }

  toggleSidebarNotification() {
    this.layoutService.emitSidebarNotifyChange(true);
  }

  async signout() {
    const device_type = this.cookieService.get('device_type');
    const fcm_token = this.cookieService.get('fcm_token');

    const obj = {
      fcm_token: fcm_token,
      device_type: device_type,
    };
    const response: any = await this.authService.Logout(obj);
    if (response.statusCode === 200) {
      localStorage.clear();
      this.utils.showSuccessToast(response.message);
      this.router.navigate([ROUTE_PATH.AUTH, ROUTE_PATH.LOGIN]);
    }
  }

  onSignOut() {
    Swal.fire({
      icon: 'warning',
      title: 'Are you sure you want to logout?',
      showCancelButton: true,
      confirmButtonText: 'Yes',
      confirmButtonColor: '#6259ca',
      cancelButtonText: 'No',
      cancelButtonColor: '#6259ca',
      reverseButtons: true,
    }).then(async (result: any) => {
      if (result.isConfirmed) {
        this.signout();
      }
    });
  }

  open(content: any) {
    this.modalService.open(content, {
      backdrop: 'static',
      windowClass: 'modalCusSty',
    });
  }

  searchToggle() {
    if (this.body.classList.contains('search-open')) {
      this.activated = false;
      this.body.classList.remove('search-open');
    } else {
      this.activated = true;
      this.body.classList.add('search-open');
    }
  }
  closeToggle() {
    this.activated = false;
    this.body.classList.remove('search-open');
  }

  getLogo() {
    switch (this.userDetails?.userRole) {
      case USER_ROLE_TYPE.superAdmin:
        return this.userDetails?.image
      case USER_ROLE_TYPE.organization:
        return this.userDetails?.image;
      case USER_ROLE_TYPE.schoolAdmin:
        return this.userDetails?.organization_image
      default:
        return null;
    }
  }
}
