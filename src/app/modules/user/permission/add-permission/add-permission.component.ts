import { Component, ElementRef } from '@angular/core';
import { ApiService } from 'src/app/services/api.service';
import { UtilityService } from 'src/app/services/utility.service';

@Component({
  selector: 'app-add-permission',
  templateUrl: './add-permission.component.html',
  styleUrls: ['./add-permission.component.scss'],
})
export class AddPermissionComponent {
  roleList: any = [];
  parentList: any = [];
  childList: any = [];
  roleId: any = null;
  parentId: any = null;
  isSubmitted = false;
  constructor(private apiService: ApiService, private utils: UtilityService, private elementRef: ElementRef) { }

  async ngOnInit() {
    await this.getroleList();
  }

  async getroleList() {
    const queryList = `?skip_pagination=true`;
    const response: any = await this.apiService.getRoleList(queryList);
    if (response.statusCode === 200) {
      this.roleList = response.data.result;
    }
  }

  async getMenuByRoleId() {
    this.parentId = null;
    this.utils.showLoading();
    await this.getMenuList();
    const queryList = `?roleId=${this.roleId}`;
    const res: any = await this.apiService.getMenuByRoleId(queryList);
    if (res.statusCode === 200) {
      for (const menu of res.data.menu_master_data) {
        for (let childMenu of this.childList) {
          if (childMenu.id == menu.menu_id) {
            childMenu.read = menu.read;
            childMenu.write = menu.write;
            childMenu.delete = menu.delete;
            break;
          }
        }
        for (let parentMenu of this.parentList) {
          if (parentMenu.id == menu.menu_id) {
            parentMenu.isEnable = true;
            break;
          }
        }
      }
    }
    this.utils.hideLoading();
  }

  async getMenuList() {
    const response: any = await this.apiService.getMenuList();
    if (response.statusCode === 200) {
      this.parentList = response.data.menu_master_data
        .filter((item: any) => item.parent_id === 0)
        .map((item: any) => {
          item.route_name = this.transformRouteText(item.route_name);
          item.isEnable = false;
          item.menuId = item.id;
          return item;
        });
      this.childList = response.data.menu_master_data
        .filter((item: any) => item.parent_id !== 0)
        .map((item: any) => {
          item.route_name = this.transformRouteText(item.route_name);
          item.read = false;
          item.write = false;
          item.delete = false;
          item.menuId = item.id;
          return item;
        });
    }
  }

  transformRouteText(value: string) {
    let arr = value.split('_');
    let str = '';
    for (const item of arr) {
      str = str + item.charAt(0).toUpperCase() + item.slice(1) + ' ';
    }
    return str;
  }

  onChildSideMenuSelect(
    parentId: number,
    isChecked: boolean,
    item: any,
    isRead = false
  ) {
    const index = this.parentList.findIndex(
      (item: any) => item.id === parentId
    );
    if (isChecked) {
      this.parentList[index].isEnable = true;
      item.read = true;
    } else {
      if (isRead && (item.write || item.delete))
        setTimeout(() => {
          item.read = true;
        }, 100);
      const arr = this.childList.find(
        (item: any) =>
          item.parent_id === parentId &&
          (item.read == true || item.write == true || item.delete == true)
      );
      if (!arr) this.parentList[index].isEnable = false;
    }
  }

  onParentSideMenuSelect(id: number, isChecked: boolean) {
    if (isChecked) {
      this.parentId = id;
      this.scrollToSubSideMenuDiv();
    } else {
      this.childList = this.childList.map((item: any) => {
        if (item.parent_id === id) {
          item.read = false;
          item.write = false;
          item.delete = false;
        }
        return item;
      });
    }
  }

  onParentSelect(id: number) {
    this.parentId = id;
    this.scrollToSubSideMenuDiv();
  }

  async submit() {
    this.isSubmitted = true;
    if (!this.roleId) return
    this.utils.showLoading();
    let parentArr = this.parentList.filter(
      (item: any) => item.isEnable == true
    );
    let childArr = this.childList.filter(
      (item: any) =>
        item.read == true || item.write == true || item.delete == true
    );
    let arr: any = [];
    for (let [index, parent] of parentArr.entries()) {
      let count = 0;
      for (const child of childArr) {
        if (parent.id == child.parent_id) {
          count++;
          break;
        }
      }
      if (count == 0) arr.push(index);
    }
    parentArr = parentArr.filter((item, index) => {
      if (!arr.includes(index)) {
        return item;
      }
    });
    const data = { roleId: +this.roleId, menuIds: [...parentArr, ...childArr] };
    const res: any = await this.apiService.addMenuByRoleId(data);
    window.scrollTo(0, 0)
    this.isSubmitted = false
    if (res.statusCode === 200) {
      this.utils.showSuccessToast(res.message)
    }
    this.roleId = null;
    this.parentId = null;
    this.utils.hideLoading();
  }
  scrollToSubSideMenuDiv() {
    setTimeout(() => {
      const element = this.elementRef.nativeElement.querySelector('#subSideMenuDiv');
      const offset = 100; // Adjust this value to set the offset in pixels
      const elementPosition = element.getBoundingClientRect().top + window.pageYOffset;
      window.scrollTo({
        top: elementPosition - offset,
        behavior: 'smooth'
      });
    }, 100);
  }
}