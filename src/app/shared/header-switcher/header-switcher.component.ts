import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ROUTE_PATH } from 'src/app/Constants/constants';
import { LocalStorageService } from 'src/app/services/local-storage.service';
import { LayoutService } from 'src/app/shared/services/layout.service';
import { NavService } from 'src/app/shared/services/nav.service';
import { SwitcherService } from 'src/app/shared/services/switcher.service';
import { CookieService } from 'ngx-cookie-service';

@Component({
  selector: 'app-header-switcher',
  templateUrl: './header-switcher.component.html',
  styleUrls: ['./header-switcher.component.scss'],
})
export class HeaderSwitcherComponent {
  private body: HTMLBodyElement | any = document.querySelector('body');
  public isCollapsed = true;
  activated: boolean = false;
  userRole: any;

  constructor(
    private layoutService: LayoutService,
    public SwitcherService: SwitcherService,
    public navServices: NavService,
    private router: Router,
    private modalService: NgbModal,
    private localstorage: LocalStorageService,
    private cookieService: CookieService
  ) {}

  ngOnInit(): void {}
  toggleSwitcher() {
    this.SwitcherService.emitChange(true);
  }

  toggleSidebarNotification() {
    this.layoutService.emitSidebarNotifyChange(true);
  }

  signout() {
  

    localStorage.clear();
    this.router.navigate([ROUTE_PATH.AUTH, ROUTE_PATH.LOGIN]);
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
}
