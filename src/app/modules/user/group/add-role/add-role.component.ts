import { Component, TemplateRef, ViewChild } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { NgbModalRef, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import * as moment from 'moment';
import { Constants } from 'src/app/Constants/constants';
import { ApiService } from 'src/app/services/api.service';
import { ExportService } from 'src/app/services/export-service.service';
import { UtilityService } from 'src/app/services/utility.service';
import { NoSpace } from 'src/app/shared/validations/no-space.validator';

@Component({
  selector: 'app-add-role',
  templateUrl: './add-role.component.html',
  styleUrls: ['./add-role.component.scss'],
})
export class AddRoleComponent {
  pageLimit = Constants.PAGE_LIMIT;
  currentPage = Constants.STARTING_PAGE;
  totalItems: number;
  roleList: any = [];
  roleForm: FormGroup;
  isSubmitted = false;
  roleId = null;
  @ViewChild('role', { static: false }) role: TemplateRef<any>;
  config = {
    backdrop: true,
    ignoreBackdropClick: true,
    class: 'modal-md',
    centered: true,
    modalDialogClass: 'modal-xl',
  };
  modalReference: NgbModalRef;
  groupList: any = [];
  subGroupList: any = [];
  filterSubGroupList: any = [];
  searchString = '';
  orderBy: any = 'created_at';
  sort = 'DESC'
  isAscending = false
  constructor(
    private formBuilder: FormBuilder,
    private exportService:ExportService,
    private modalService: NgbModal,
    private apiService: ApiService,
    private utils: UtilityService
  ) { }

  async ngOnInit() {
    await this.getSubGroupList();
    await this.getroleList();
    this.formInit();
    this.getGroupList();
  }
  formInit() {
    this.roleForm = this.formBuilder.group({
      name: ['', [Validators.required, NoSpace()]],
      sub_group_id: [null],
      group_id: [null, Validators.required],
    });
  }

  get form() {
    return this.roleForm.controls;
  }

  onPageChange = async (page: any) => {
    this.currentPage = page;
    this.getroleList();
  };

  onSearch() {
    if (this.searchString.trim() !== '') {
      this.onPageChange(1);
    }
  }

  onClear() {
    if (this.searchString) {
      this.searchString = '';
      this.onPageChange(1);
    }
  }
  async getroleList(isExport=false) {
    this.utils.showLoading();
    let queryList = `?page=${this.currentPage}&limit=${this.pageLimit}&search=${this.searchString}&sort=${this.sort}&orderby=${this.orderBy}`;
    if (isExport) {
      queryList += `&skip_pagination=true`;
    } 
    const response: any = await this.apiService.getRoleList(queryList);
    if (!isExport && response.statusCode === 200) {
      this.roleList = response.data.result;
      this.totalItems = response.data.totalCount;
    }
    else if (isExport && response.statusCode === 200) {
      this.utils.hideLoading();
      return response.data.result;
    }
    this.utils.hideLoading();
  }

  async getGroupList() {
    const response: any = await this.apiService.getGroupList();
    if (response.statusCode === 200) {
      this.groupList = response.data.group_master_data;
    }
  }

  async getSubGroupList() {
    const queryList = `?skip_pagination=true`;
    const response: any = await this.apiService.getSubGroupList(queryList);
    if (response.statusCode === 200) {
      this.subGroupList = response.data.result;
    }
  }

  groupNameChange(id) {
    const groupId = id;
    this.roleForm.patchValue({ sub_group_id: null });
    this.filterSubGroupList = this.subGroupList.filter(
      (item) => item.group_id == groupId
    );
  }

  onModalOpen() {
    this.getSubGroupList();
    this.modalReference = this.modalService.open(this.role, this.config);
    this.modalReference.hidden.subscribe(() => {
      this.onModalClose();
    });
  }

  async onEdit(id: any) {
    this.roleId = id;
    const queryList = `?role_id=${this.roleId}`;
    const response: any = await this.apiService.getRoleList(queryList);
    if (response.statusCode === 200) {
      const data = response.data.result[0];
      this.groupNameChange(data.group_id);
      this.roleForm.patchValue({
        name: data.name,
        sub_group_id: data.sub_group_id,
        group_id: data.group_id,
      });
    }
    this.onModalOpen();
  }

  async onSubmit() {
    this.isSubmitted = true;
    if (this.roleForm.valid) {
      this.utils.showLoading();
      const obj = {
        name: this.roleForm.value.name,
        sub_group_id: this.roleForm.value.sub_group_id
          ? +this.roleForm.value.sub_group_id
          : 0,
        group_id: +this.roleForm.value.group_id,
      };
      this.roleId ? (obj['role_id'] = this.roleId) : '';
      const response: any = await this.apiService.role(obj);
      if (response.statusCode === 200) {
        this.utils.hideLoading();
        this.utils.showSuccessToast(response.message);
        this.onModalClose();
        this.getroleList();
      }
    }
  }

  onModalClose() {
    this.isSubmitted = false;
    this.roleId = null;
    this.modalReference.close();
    this.roleForm.reset();
    this.filterSubGroupList = [];
  }

  sortData(columnName) {
    if (this.orderBy === columnName) {
      this.isAscending = !this.isAscending;
      this.sort = this.isAscending ? 'ASC' : 'DESC'
    } else {
      this.isAscending = true;
      this.sort = 'ASC'
    }
    this.orderBy = columnName;
    this.getroleList();
  }
  async exportAll(exportType ){
    const data: any = [];
    const headerRow = [ 
      "Role Name",
      "Group Name",
      "Sub Group Name",
   ]
    if (exportType != "pdf") {
      data.push(headerRow);
    }
    const arr: any = await this.getroleList(true);
    for (const item of arr) {
      const rowData = [
        item.name||"-",
        item.group_name||"-",
        item.sub_group_name||"-",
      ]
      data.push(rowData);
    }
    this.exportService.exportData(
      exportType,
      headerRow,
      data,
      `Exported Role List${ moment().format("YYYY-MM-DD")}`
    );
  }
}
