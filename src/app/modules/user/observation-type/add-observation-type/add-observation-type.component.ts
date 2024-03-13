import { Component, TemplateRef, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import {
  NgbDateStruct,
  NgbModal,
  NgbModalRef,
} from '@ng-bootstrap/ng-bootstrap';
import * as moment from 'moment';
import { Constants } from 'src/app/Constants/constants';
import { ApiService } from 'src/app/services/api.service';
import { ExportService } from 'src/app/services/export-service.service';
import { UtilityService } from 'src/app/services/utility.service';
import { NoSpace } from 'src/app/shared/validations/no-space.validator';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-add-observation-type',
  templateUrl: './add-observation-type.component.html',
  styleUrls: ['./add-observation-type.component.scss'],
})
export class AddObservationTypeComponent {
  addObservationTypeForm: FormGroup;
  modalReference: NgbModalRef;
  pageLimit = Constants.PAGE_LIMIT;
  currentPage = Constants.STARTING_PAGE;
  totalItems: number;
  ObservationTypeList: any = [];
  @ViewChild('ObservationType', { static: false })
  ObservationType: TemplateRef<any>;
  isSubmitted = false;
  EditId: any;
  searchString = '';
  orderBy: any = 'created_at';
  sort = 'DESC';
  isAscending = false;
  config = {
    backdrop: true,
    ignoreBackdropClick: true,
    class: 'modal-md',
    centered: true,
    modalDialogClass: 'modal-xl',
  };
  subGroupList: any;
  roleList: any;
  subGroupId: any;
  roleId: any;
  groupList: any;
  GroupId: any;
  constructor(
    private modalService: NgbModal,
    private formBuilder: FormBuilder,
    private apiService: ApiService,
    private utils: UtilityService,
    private exportService:ExportService,
  ) { }

  async ngOnInit() {
    await this.getObservationTypeList();
  }

  async getObservationTypeList(isExport=false) {
    this.utils.showLoading();
    let queryList = `?search=${this.searchString}&page=${this.currentPage}&limit=${this.pageLimit}&sort=${this.sort}&orderby=${this.orderBy}`;
    if (isExport) {
      queryList += `&skip_pagination=true`;
    }
    const response: any = await this.apiService.getObservationTypeList(
      queryList
    );
    if (!isExport&&response.statusCode === 200) {
      this.ObservationTypeList = response.data.result;
      this.totalItems = response.data.totalCount;
    }
    else if (isExport&&response.statusCode === 200) {
      this.utils.hideLoading();
      return response.data.result;
    }
    this.utils.hideLoading();
  }

  onPageChange = async (page: any) => {
    this.currentPage = page;
    this.getObservationTypeList();
  };
  async onModalOpen() {
    this.formInit();
    this.modalReference = this.modalService.open(
      this.ObservationType,
      this.config
    );
    await this.getGroupList();

    this.modalReference.hidden.subscribe(() => {
      this.onModalClose();
    });
  }
  formInit() {
    this.addObservationTypeForm = this.formBuilder.group({
      name: ['', [Validators.required, NoSpace()]],
      Status: ['true', Validators.required],
      SubGroup: [null, Validators.required],
      Group: [null, Validators.required],
      Role: [null, Validators.required],
      short_code: ['', [Validators.required, NoSpace()]],
    });
  }
  get form() {
    return this.addObservationTypeForm.controls;
  }
  async onSubmit() {
    try {
      this.isSubmitted = true;
      if (this.addObservationTypeForm.invalid) {
        return;
      }
      this.utils.showLoading();

      const obj = {
        name: this.addObservationTypeForm.controls['name'].value,
        short_code: this.addObservationTypeForm.controls['short_code'].value,
        isActive:
          this.addObservationTypeForm.controls['Status'].value == 'true'
            ? true
            : false,
        admin_group_id: this.GroupId,
        admin_sub_group_id: this.subGroupId,
        role_id: this.roleId,
      };
      this.EditId ? (obj['id'] = this.EditId) : '';
      const response: any = await this.apiService.addObservationType(obj);
      this.utils.hideLoading();
      if (response.statusCode === 200) {
        this.utils.showSuccessToast(response.message);
        this.onModalClose();
        this.getObservationTypeList();
      }
    } catch (error) {
      this.utils.hideLoading();
    }
  }
  onModalClose() {
    this.isSubmitted = false;
    this.EditId = null;
    this.modalReference.close();
  }
  async editObservationType(listId) {
    this.EditId = listId;

    const queryList = `?id=${listId}`;

    this.onModalOpen();
    const response: any = await this.apiService.getObservationTypeList(
      queryList
    );

    if ((response.statusCode = 200)) {
      this.addObservationTypeForm.controls['name'].setValue(
        response.data[0].name
      );
      this.addObservationTypeForm.controls['short_code'].setValue(
        response.data[0].short_code
      );

      this.addObservationTypeForm.controls['Group'].setValue(
        response.data[0].admin_group_name
      );
      this.GroupId = response.data[0].admin_group_id;
      this.addObservationTypeForm.controls['SubGroup'].setValue(
        response.data[0].admin_sub_group_name
      );
      this.subGroupId = response.data[0].admin_sub_group_id;
      this.addObservationTypeForm.controls['Role'].setValue(
        response.data[0].admin_role_name
      );
      this.addObservationTypeForm.controls['Status'].setValue(
        response.data[0].is_active.toString()
      );
      this.roleId = response.data[0].role_id;
    }
    this.getSubGroupList();
    this.getroleList();
  }

  deleteObservationType(id) {
    Swal.fire({
      icon: 'warning',
      title: 'Are you sure?',
      text: 'You will not be able to recover this observation type!',
      showCancelButton: true,
      confirmButtonText: 'Yes, delete it!',
      confirmButtonColor: '#6259ca',
      cancelButtonText: 'No, cancel it!',
      cancelButtonColor: '#6259ca',
      reverseButtons: true,
    }).then(async (result: any) => {
      if (result.isConfirmed) {
        const response: any = await this.apiService.ObservationTypeDelete(id);
        if ((response.statusCode = 200)) {
          Swal.fire({
            title: 'Deleted!',
            text: 'Your observation type has been deleted.',
            icon: 'success',
            confirmButtonColor: '#6259ca',
          });
          await this.getObservationTypeList();
        }
      } else if (result.dismiss === Swal.DismissReason.cancel) {
        Swal.fire({
          title: 'Cancelled!',
          text: 'Your observation type is safe :)',
          icon: 'error',
          confirmButtonColor: '#6259ca',
        });
      }
    });
  }
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

  sortData(columnName) {
    if (this.orderBy === columnName) {
      this.isAscending = !this.isAscending;
      this.sort = this.isAscending ? 'ASC' : 'DESC';
    } else {
      this.isAscending = true;
      this.sort = 'ASC';
    }
    this.orderBy = columnName;
    this.getObservationTypeList();
  }

  async getGroupList() {
    const response: any = await this.apiService.getGroupList();
    if (response.statusCode === 200) {
      this.groupList = response.data.group_master_data;
    }
  }
  Group(event) {
    if (event) {
      this.addObservationTypeForm.controls['SubGroup'].setValue(null);
      this.addObservationTypeForm.controls['Role'].setValue(null);

      this.GroupId = +event;
      this.getSubGroupList();
    }
  }
  async getSubGroupList() {
    const queryList = `?skip_pagination=true&group_id=${this.GroupId}`;
    const response: any = await this.apiService.getSubGroupList(queryList);
    if (response.statusCode === 200) {
      this.subGroupList = response.data.result;
    }
  }
  getRoleId(event) {
    this.roleId = +event;
  }
  subGroup(event) {
    if (event) {
      this.addObservationTypeForm.controls['Role'].setValue(null);
      this.subGroupId = +event;
      this.getroleList();
    }
  }
  async getroleList() {
    const queryList = `?skip_pagination=true&sub_group_id=${this.subGroupId}`;
    const response: any = await this.apiService.getRoleList(queryList);
    if (response.statusCode === 200) {
      this.roleList = response.data.result;
    }
  }
  async exportAll(exportType ){
    const data: any = [];
    const headerRow = [ 
      "Observation Type",
      "Observation Short Code",
      "Group",
      "Sub Group",
      "Role",
      "Observation Status",
      "Date & Time"
   ]
    if (exportType != "pdf") {
      data.push(headerRow);
    }
    const arr: any = await this.getObservationTypeList(true);
    for (const item of arr) {
      const rowData = [
        item.name||"-",
        item.short_code||"-",
        item.admin_group_name||"-",
        item.admin_sub_group_name||"-",
        item.admin_role_name||"-",
        item.is_active ? "Active" : "In Active"||"-",
        moment(item.created_at).format("YYYY-MM-DD hh:mm A")||"-",
      ]
      data.push(rowData);
    }
    this.exportService.exportData(
      exportType,
      headerRow,
      data,
      `Exported Observation Type List${ moment().format("YYYY-MM-DD")}`
    );
  }
}
