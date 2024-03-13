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
  selector: 'app-add-observation-related-to',
  templateUrl: './add-observation-related-to.component.html',
  styleUrls: ['./add-observation-related-to.component.scss'],
})
export class AddObservationRelatedToComponent {
  observationRelatedToForm: FormGroup;
  modalReference: NgbModalRef;
  pageLimit = Constants.PAGE_LIMIT;
  currentPage = Constants.STARTING_PAGE;
  totalItems: number;
  ObservationTypeList: any = [];
  getObservationSubWorkingList: any = [];
  ObservationRelatedList: any = [];
  @ViewChild('ObservationRelatedTo', { static: false })
  ObservationRelatedTo: TemplateRef<any>;
  isSubmitted = false;
  model1!: NgbDateStruct;
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
  observation: any;
  observationSubWorkingAreaId: any;

  constructor(
    private modalService: NgbModal,
    private formBuilder: FormBuilder,
    private apiService: ApiService,
    private utils: UtilityService,
    private exportService: ExportService
  ) { }

  async ngOnInit() {
    this.getObservationRelatedToList();
  }

  async getObservationRelatedToList(isExport = false) {
    this.utils.showLoading();
    let queryList = `?search=${this.searchString}&page=${this.currentPage}&limit=${this.pageLimit}&sort=${this.sort}&orderby=${this.orderBy}`;
    if (isExport) queryList += `&skip_pagination=true`;

    const response: any = await this.apiService.observationRelatedToList(
      queryList
    );
    if (isExport && response.statusCode === 200) {
      this.utils.hideLoading();
      return response.data.result;
    }
    if (response.statusCode === 200) {
      this.ObservationRelatedList = response.data.result;
      this.totalItems = response.data.totalCount;
    }
    this.utils.hideLoading();
  }

  async getObservationSubworkingList() {
    this.utils.showLoading();
    const queryList = `?observation_type_id=${this.observation}&skip_pagination=true`;
    const response: any = await this.apiService.ObservationSubworkingList(
      queryList
    );
    if (response.statusCode === 200) {
      this.getObservationSubWorkingList = response.data.result;
    }
    this.utils.hideLoading();
  }

  async getObservationTypeList() {
    this.utils.showLoading();
    const queryList = `?skip_pagination=true&role_id=${this.roleId}`;
    const response: any = await this.apiService.getObservationTypeList(
      queryList
    );
    if (response.statusCode === 200) {
      this.ObservationTypeList = response.data.result;
    }
    this.utils.hideLoading();
  }

  onPageChange = async (page: any) => {
    this.currentPage = page;
    this.getObservationRelatedToList();
  };
  async onModalOpen() {
    this.formInit();
    this.modalReference = this.modalService.open(
      this.ObservationRelatedTo,
      this.config
    );
    await this.getGroupList();

    this.modalReference.hidden.subscribe(() => {
      this.onModalClose();
    });
  }
  formInit() {
    this.observationRelatedToForm = this.formBuilder.group({
      name: ['', [Validators.required, NoSpace()]],
      observationType: [null, Validators.required],
      observationSubWorkingArea: [null, Validators.required],
      SubGroup: [null, Validators.required],
      Group: [null, Validators.required],
      Role: [null, Validators.required],
      short_code: ['', [Validators.required, NoSpace()]],
      Status: ['true', Validators.required],
    });
  }
  get form() {
    return this.observationRelatedToForm.controls;
  }
  async onSubmit() {
    try {
      this.isSubmitted = true;
      if (this.observationRelatedToForm.invalid) {
        return;
      }
      this.utils.showLoading();

      const obj = {
        name: this.observationRelatedToForm.controls['name'].value,
        short_code: this.observationRelatedToForm.controls['short_code'].value,
        admin_group_id: this.GroupId,
        admin_sub_group_id: this.subGroupId,
        role_id: this.roleId,
        observation_type_id: this.observation,
        sub_working_area_id: this.observationSubWorkingAreaId,
        isActive:
          this.observationRelatedToForm.controls['Status'].value == 'true'
            ? true
            : false,
      };
      this.EditId ? (obj['id'] = this.EditId) : '';
      const response: any = await this.apiService.addObservationRelatedTo(obj);
      this.utils.hideLoading();
      if (response.statusCode === 200) {
        this.utils.showSuccessToast(response.message);
        this.onModalClose();
        this.getObservationRelatedToList();
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
  async editObservationRelatedTo(listId) {
    this.EditId = listId;
    const queryList = `?id=${listId}`;

    this.onModalOpen();
    const response: any = await this.apiService.observationRelatedToList(
      queryList
    );

    if ((response.statusCode = 200)) {
      this.observationRelatedToForm.controls['name'].setValue(
        response.data[0].name
      );
      this.observationRelatedToForm.controls['short_code'].setValue(
        response.data[0].short_code
      );
      this.observationRelatedToForm.controls['Group'].setValue(
        response.data[0].admin_group_name
      );
      this.GroupId = response.data[0].admin_group_id;
      this.observationRelatedToForm.controls['SubGroup'].setValue(
        response.data[0].admin_sub_group_name
      );
      this.subGroupId = response.data[0].admin_sub_group_id;
      this.observationRelatedToForm.controls['Role'].setValue(
        response.data[0].admin_role_name
      );
      this.roleId = response.data[0].role_id;
      this.observationRelatedToForm.controls['observationType'].setValue(
        response.data[0].observation_type_name
      );
      this.observation = response.data[0].observation_type_id;

      this.observationRelatedToForm.controls[
        'observationSubWorkingArea'
      ].setValue(response.data[0].sub_working_area_name);
      this.observationSubWorkingAreaId = response.data[0].sub_working_area_id;
      this.observationRelatedToForm.controls['Status'].setValue(
        response.data[0].is_active.toString()
      );
    }
    this.getroleList();
  }

  deleteObservationRelatedTo(id) {
    Swal.fire({
      icon: 'warning',
      title: 'Are you sure?',
      text: 'You will not be able to recover this related to!',
      showCancelButton: true,
      confirmButtonText: 'Yes, delete it!',
      confirmButtonColor: '#6259ca',
      cancelButtonText: 'No, cancel it!',
      cancelButtonColor: '#6259ca',
      reverseButtons: true,
    }).then(async (result: any) => {
      if (result.isConfirmed) {
        const response: any = await this.apiService.deleteObservationRelatedTo(
          id
        );
        if ((response.statusCode = 200)) {
          Swal.fire({
            title: 'Deleted!',
            text: 'Your related to has been deleted.',
            icon: 'success',
            confirmButtonColor: '#6259ca',
          });
          await this.getObservationRelatedToList();
        }
      } else if (result.dismiss === Swal.DismissReason.cancel) {
        Swal.fire({
          title: 'Cancelled!',
          text: 'Yourrelated to is safe :)',
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
    this.getObservationRelatedToList();
  }

  async getGroupList() {
    const response: any = await this.apiService.getGroupList();
    if (response.statusCode === 200) {
      this.groupList = response.data.group_master_data;
    }
  }
  Group(event) {
    if (event) {
      this.observationRelatedToForm.controls['SubGroup'].setValue(null);
      this.observationRelatedToForm.controls['Role'].setValue(null);
      this.observationRelatedToForm.controls['observationType'].setValue(null);

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
    this.observationRelatedToForm.controls['observationType'].setValue(null);

    this.roleId = +event;
    this.getObservationTypeList();
  }
  subGroup(event) {
    if (event) {
      this.observationRelatedToForm.controls['Role'].setValue(null);
      this.observationRelatedToForm.controls['observationType'].setValue(null);

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
  getObservationId(event) {
    this.observation = +event;
    this.observationRelatedToForm.controls[
      'observationSubWorkingArea'
    ].setValue(null);

    this.getObservationSubworkingList();
  }
  getObservationSubWorkingAreaId(event) {
    this.observationSubWorkingAreaId = +event;
  }

  async exportAllObservationRelated(exportType: string) {
    const data: any = [];

    const headerRow = [
      'Id',
      'Observation Memo',
      'Observation Short Code',
      'Observation Status',
      ' Date & Time',
    ];

    if (exportType != 'pdf') {
      data.push(headerRow);
    }
    const arr: any = await this.getObservationRelatedToList(true);

    for (const item of arr) {
      const rowData = [
        item.id,
        item.name,
        item.short_code,
        item.is_active,
        moment(item.created_at).format('YYYY-MM-DD hh:mm A'),
      ];
      data.push(rowData);
    }
    this.exportService.exportData(
      exportType,
      headerRow,
      data,
      ` Observation Realated To`
    );
  }
  async exportAll(exportType ){
    const data: any = [];
    const headerRow = [ 
      "Observation Related To",
      "Group",
      "Sub Group",
      "Role",
      "Observation Type",
      "Sub Working Area",
      "related Short Code",
      "Observation Status",
      "Date & Time"
   ]
    if (exportType != "pdf") {
      data.push(headerRow);
    }
    const arr: any = await this.getObservationRelatedToList(true);
    for (const item of arr) {
      const rowData = [
        item.name||"-",
        item.admin_group_name||"-",
        item.admin_sub_group_name||"-",
        item.admin_role_name||"-",
        item.observation_type_name||"-",
        item.sub_working_area_name||"-",
        item.short_code||"-",
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
