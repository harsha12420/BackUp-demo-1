import { Component, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import * as moment from 'moment';
import { Constants } from 'src/app/Constants/constants';
import { ApiService } from 'src/app/services/api.service';
import { ExportService } from 'src/app/services/export-service.service';
import { UtilityService } from 'src/app/services/utility.service';
import { NoSpace } from 'src/app/shared/validations/no-space.validator';

@Component({
  selector: 'app-add-sub-group',
  templateUrl: './add-sub-group.component.html',
  styleUrls: ['./add-sub-group.component.scss'],
})
export class AddSubGroupComponent implements OnInit {
  pageLimit = Constants.PAGE_LIMIT;
  currentPage = Constants.STARTING_PAGE;
  totalItems: number;
  subGroupList: any = [];
  subGroupForm: FormGroup;
  isSubmitted = false;
  subGroupId = null;
  @ViewChild('subGroup', { static: false }) subGroup: TemplateRef<any>;
  config = {
    backdrop: true,
    ignoreBackdropClick: true,
    class: 'modal-md',
    centered: true,
    modalDialogClass: 'modal-xl',
  };
  modalReference: NgbModalRef;
  groupList: any = [];
  searchString = '';
  orderBy: any = 'created_at';
  sort = 'DESC'
  isAscending = false
  constructor(
    private formBuilder: FormBuilder,
    private modalService: NgbModal,
    private apiService: ApiService,
    private exportService:ExportService,
    private utils: UtilityService
  ) { }

  async ngOnInit() {
    await this.getSubGroupList();
    this.formInit();
    this.getGroupList();
  }
  formInit() {
    this.subGroupForm = this.formBuilder.group({
      sub_group_name: ['', [Validators.required, NoSpace()]],
      parent_group_id: [null, Validators.required],
    });
  }

  get form() {
    return this.subGroupForm.controls;
  }

  onPageChange = async (page: any) => {
    this.currentPage = page;
    this.getSubGroupList();
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
  async getSubGroupList(isExport=false) {
    this.utils.showLoading();
    let queryList = `?page=${this.currentPage}&limit=${this.pageLimit}&search=${this.searchString}&sort=${this.sort}&orderby=${this.orderBy}`;
    if (isExport) {
      queryList += `&skip_pagination=true`;
    } 
    const response: any = await this.apiService.getSubGroupList(queryList);
    if (!isExport && response.statusCode === 200) {
      this.subGroupList = response.data.result;
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

  onModalOpen() {
    this.modalReference = this.modalService.open(this.subGroup, this.config);
    this.modalReference.hidden.subscribe(() => {
      this.onModalClose();
    });
  }

  async onEdit(id: any) {
    this.subGroupId = id;
    const queryList = `?sub_group_id=${this.subGroupId}`;
    const response: any = await this.apiService.getSubGroupList(queryList);
    if (response.statusCode === 200) {
      const data = response.data.result[0];
      this.subGroupForm.patchValue({
        sub_group_name: data.name,
        parent_group_id: data.group_id,
      });
    }
    this.onModalOpen();
  }

  async onSubmit() {
    this.isSubmitted = true;
    if (this.subGroupForm.valid) {
      this.utils.showLoading();
      const obj = {
        sub_group_name: this.subGroupForm.value.sub_group_name,
        parent_group_id: +this.subGroupForm.value.parent_group_id,
      };
      this.subGroupId ? (obj['sub_group_id'] = this.subGroupId) : '';
      const response: any = await this.apiService.subGroup(obj);
      if (response.statusCode === 200) {
        this.utils.hideLoading();
        this.utils.showSuccessToast(response.message);
        this.onModalClose();
        this.getSubGroupList();
      }
    }
  }

  onModalClose() {
    this.isSubmitted = false;
    this.subGroupId = null;
    this.modalReference.close();
    this.subGroupForm.reset();
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
    this.getSubGroupList();
  }
  async exportAll(exportType ){
    const data: any = [];
    const headerRow = [ 
      "Sub Group Name",
      "Group Name",
   ]
    if (exportType != "pdf") {
      data.push(headerRow);
    }
    const arr: any = await this.getSubGroupList(true);
    for (const item of arr) {
      const rowData = [
        item.name||"-",
        item.group_name||"-",
      ]
      data.push(rowData);
    }
    this.exportService.exportData(
      exportType,
      headerRow,
      data,
      `Exported Sub Group List${ moment().format("YYYY-MM-DD")}`
    );
  }
}
