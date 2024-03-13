import { Component, TemplateRef, ViewChild } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import {
  NgbDateStruct,
  NgbModal,
  NgbModalRef,
} from '@ng-bootstrap/ng-bootstrap';
import { Constants } from 'src/app/Constants/constants';
import { ApiService } from 'src/app/services/api.service';
import { ExportService } from 'src/app/services/export-service.service';
import { UtilityService } from 'src/app/services/utility.service';
import Swal from 'sweetalert2';
import * as moment from 'moment';

@Component({
  selector: 'app-add-export-reporting-framework',
  templateUrl: './add-export-reporting-framework.component.html',
  styleUrls: ['./add-export-reporting-framework.component.scss'],
})
export class AddExportReportingFrameworkComponent {
  exportReportingForm: FormGroup;
  modalReference: NgbModalRef;
  pageLimit = Constants.PAGE_LIMIT;
  currentPage = Constants.STARTING_PAGE;
  find = '';
  totalItems: number;
  exportReportingList: any = [];
  @ViewChild('exportReporting', { static: false })
  exportReporting: TemplateRef<any>;
  @ViewChild('view', { static: false })
  view: TemplateRef<any>;
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
    scrollable: true,
    modalDialogClass: 'modal-xl',
  };
  subGroupList: any;
  roleList: any;
  subGroupId: any;
  subGroupToId: any;
  roleId: any;
  groupList: any;
  GroupId: any;
  staffList: any;
  toStaffList: any = [];
  viewList: any;
  showRole = false;
  showEmployee = false;
  toSubGroupList: any = [];
  roleToId: any = [];
  roleToList: any;
  toRoleList: any = [];
  selectedExportOption: string = 'null';
  currentDate = new Date();
  formattedDate: any;
  viewReportingType = null;
  constructor(
    private modalService: NgbModal,
    private formBuilder: FormBuilder,
    private apiService: ApiService,
    private utils: UtilityService,
    private exportService: ExportService
  ) { }

  async ngOnInit() {
    this.formattedDate = this.currentDate.toISOString().slice(0, 10);

    this.getReportingFrameworkList();
  }

  async getSubGroupList() {
    const queryList = `?skip_pagination=true`;
    const response: any = await this.apiService.getSubGroupList(queryList);
    if (response.statusCode === 200) {
      this.subGroupList = response.data.result;
    }
  }
  onReportingTypeChange() {
    const selectedReportingType =
      this.exportReportingForm.get('ReportingType')?.value;
    if (selectedReportingType === '1') {
      this.exportReportingForm.controls['to_employee_user_ids'].disable();
      this.exportReportingForm.controls['employee_user_ids'].disable();
      this.exportReportingForm.controls['SubGroup'].enable();
      this.exportReportingForm.controls['Role'].enable();
      this.exportReportingForm.controls['SubGroupTo'].enable();
      this.exportReportingForm.controls['RoleTo'].enable();
      this.showRole = true;
      this.showEmployee = false;

      this.getSubGroupList();
    } else if (selectedReportingType === '2') {
      this.exportReportingForm.controls['SubGroup'].disable();
      this.exportReportingForm.controls['Role'].disable();
      this.exportReportingForm.controls['SubGroupTo'].disable();
      this.exportReportingForm.controls['RoleTo'].disable();

      this.exportReportingForm.controls['to_employee_user_ids'].enable();
      this.exportReportingForm.controls['employee_user_ids'].enable();
      this.getStaffList();
      this.showRole = false;
      this.showEmployee = true;
    }
  }

  async getroleList() {
    const queryList = `?skip_pagination=true&sub_group_id=${this.subGroupId}`;
    const response: any = await this.apiService.getRoleList(queryList);
    if (response.statusCode === 200) {
      this.roleList = response.data.result;
    }
  }
  async getroleTOList() {
    const queryList = `?skip_pagination=true&sub_group_id=${this.subGroupToId}`;
    const response: any = await this.apiService.getRoleList(queryList);
    if (response.statusCode === 200) {
      this.roleToList = response.data.result;

      this.roleToList = this.roleToList.filter(
        (role) => role.id !== this.roleId
      );
    }
  }
  async getReportingFrameworkList() {
    this.utils.showLoading();
    const queryList = `?search=${this.searchString}&page=${this.currentPage}&limit=${this.pageLimit}&sort=${this.sort}&orderby=${this.orderBy}`;
    const response: any = await this.apiService.reportingFrameworkList(
      queryList
    );
    if (response.statusCode === 200) {
      this.exportReportingList = response.data.result;
      this.totalItems = response.data.totalCount;
    }
    this.utils.hideLoading();
  }

  onPageChange = async (page: any) => {
    this.currentPage = page;
    this.getReportingFrameworkList();
  };
  async onModalOpen() {
    this.showRole = false;
    this.showEmployee = false;
    this.formInit();
    this.modalReference = this.modalService.open(
      this.exportReporting,
      this.config
    );
    this.toSubGroupList = [];
    await this.getStaffList();
    this.modalReference.hidden.subscribe(() => {
      this.onModalClose();
    });
  }
  formInit() {
    this.exportReportingForm = this.formBuilder.group({
      ReportingType: [null, Validators.required],
      SubGroup: [null, Validators.required],
      Role: [null, Validators.required],
      RoleTo: [[], Validators.required],
      SubGroupTo: [null, Validators.required],

      employee_user_ids: this.formBuilder.array([
        this.formBuilder.group({
          employee_user_id: [null, Validators.required],
        }),
      ]),
      to_employee_user_ids: this.formBuilder.array([
        this.formBuilder.group({
          to_employee_user_id: [[], Validators.required],
        }),
      ]),
    });

    (this.exportReportingForm.get('employee_user_ids') as FormArray)
      .at(0)
      ?.valueChanges.subscribe((value) => {
        if (!value.employee_user_id) {
          this.toStaffList = [];
        } else {
          this.toStaffList = this.staffList.filter(
            (user) => user.id != value.employee_user_id
          );
        }
        (this.exportReportingForm.get('to_employee_user_ids') as FormArray)
          .at(0)
          .patchValue({ to_employee_user_id: [] });
      });
  }
  get form() {
    return this.exportReportingForm.controls;
  }
  async onSubmit() {
    try {
      this.isSubmitted = true;
      if (this.exportReportingForm.invalid) {
        return;
      }

      this.utils.showLoading();
      const formValue = this.exportReportingForm.getRawValue();
      const obj = {
        reporting_type:
          this.exportReportingForm.controls['ReportingType'].value,
        user_id: formValue.employee_user_ids?.[0].employee_user_id,

        user_ids:
          formValue['ReportingType'] == '1'
            ? this.roleToId
            : formValue?.to_employee_user_ids?.[0]?.to_employee_user_id || null,

        admin_sub_group_id: this.subGroupId,
        role_id: this.roleId,
        admin_sub_group_id_to: this.subGroupToId,
      };

      const response: any = await this.apiService.addReportingFramework(obj);
      this.utils.hideLoading();
      if (response.statusCode === 200) {
        this.utils.showSuccessToast(response.message);
        this.onModalClose();
        this.getReportingFrameworkList();
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
  async editExport(listId) {
    this.EditId = listId;
    const queryList = `?id=${listId}`;
    this.onModalOpen();
    const response: any = await this.apiService.reportingFrameworkList(
      queryList
    );

    if (response.statusCode == 200) {
      this.exportReportingForm.controls['ReportingType'].setValue(
        response.data[0].reporting_type.toString()
      );
      this.exportReportingForm.controls['ReportingType'].disable();

      this.onReportingTypeChange();

      (
        this.exportReportingForm.controls['employee_user_ids'] as any
      ).controls[0].patchValue({
        employee_user_id: response.data[0].user_id,
      });

      const staffToId: any = [];
      const staffToIds = response.data[0].user_list;
      staffToIds?.forEach((id: any) => {
        staffToId.push(id.to_id);
      });
      (
        this.exportReportingForm.controls['to_employee_user_ids'] as any
      ).controls[0].patchValue({
        to_employee_user_id: staffToId,
      });

      this.exportReportingForm.controls['SubGroup'].setValue(
        response.data[0].admin_sub_group_name?.toString()
      );
      this.subGroupId = response.data[0].admin_sub_group_id;

      this.exportReportingForm.controls['Role'].setValue(
        response.data[0].role_id?.toString()
      );
      this.roleId = response.data[0].role_id;
      this.exportReportingForm.controls['SubGroupTo'].setValue(
        response.data[0]?.user_list[0]?.admin_sub_group_name?.toString()
      );
      this.subGroupToId = response.data[0].user_list[0].admin_sub_group_id_to;

      const roleNames = response.data[0].user_list.map((items) =>
        items.to_id.toString()
      );

      this.exportReportingForm.controls['RoleTo'].setValue(roleNames);
      this.roleToId = response.data[0].user_list.map((items) => items.to_id);

      this.getroleList();
      this.getroleTOList();
    }
  }

  deleteExport(id) {
    Swal.fire({
      icon: 'warning',
      title: 'Are you sure?',
      text: 'You will not be able to recover  Export Reporting !',
      showCancelButton: true,
      confirmButtonText: 'Yes, delete it!',
      confirmButtonColor: '#6259ca',
      cancelButtonText: 'No, cancel it!',
      cancelButtonColor: '#6259ca',
      reverseButtons: true,
    }).then(async (result: any) => {
      if (result.isConfirmed) {
        const response: any = await this.apiService.deleteReportingFramework(
          id
        );
        if ((response.statusCode = 200)) {
          Swal.fire({
            title: 'Deleted!',
            text: 'Your  Export Reporting been deleted.',
            icon: 'success',
            confirmButtonColor: '#6259ca',
          });
          await this.getReportingFrameworkList();
        }
      } else if (result.dismiss === Swal.DismissReason.cancel) {
        Swal.fire({
          title: 'Cancelled!',
          text: 'Your Department  is safe :)',
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
    this.getReportingFrameworkList();
  }
  subGroup(event) {
    if (event) {
      this.exportReportingForm.controls['Role'].setValue(null);
      this.exportReportingForm.controls['SubGroupTo'].setValue(null);
      this.exportReportingForm.controls['RoleTo'].setValue(null);
      this.subGroupId = +event;
      this.getroleList();
    }
  }
  subGroupTo(event) {
    if (event) {
      this.exportReportingForm.controls['RoleTo'].setValue(null);
      this.subGroupToId = +event;
      this.getroleTOList();
    }
  }

  getRoleId(event) {
    this.exportReportingForm.controls['SubGroupTo'].setValue(null);
    this.exportReportingForm.controls['RoleTo'].setValue(null);
    this.roleId = +event;
  }
  getRoleToId(event) {
    this.roleToId = event;
  }

  get employee_user_ids(): FormArray {
    return this.exportReportingForm.get('employee_user_ids') as FormArray;
  }
  get to_employee_user_ids(): FormArray {
    return this.exportReportingForm.get('to_employee_user_ids') as FormArray;
  }

  async getStaffList() {
    this.utils.showLoading();
    const queryList = `?sort=DESC&skip_pagination=true`;
    const response: any = await this.apiService.getStaffList(queryList);
    if (response.statusCode === 200) {
      this.staffList = response.data.result;
    }
    this.utils.hideLoading();
  }

  onSelectAll() {
    const selected = this.toStaffList.map((item) => item.id);
    (
      this.exportReportingForm.controls['to_employee_user_ids'] as any
    ).controls[0].patchValue({
      to_employee_user_id: selected,
    });
  }
  onClearAll() {
    (
      this.exportReportingForm.controls['to_employee_user_ids'] as any
    ).controls[0].patchValue({
      to_employee_user_id: [],
    });
  }
  roleToSelectAll() {
    const selected = this.roleToList.map((item) => item.id.toString());
    this.roleToId = selected;
    this.exportReportingForm.controls['RoleTo'].patchValue(selected);
  }
  roleToClearAll() {
    (this.exportReportingForm.controls['RoleTo'] as any).patchValue([]);
    this.roleToId = [];
  }

  async onView(listId, reportingType) {
    this.viewReportingType = reportingType;
    this.modalReference = this.modalService.open(this.view, this.config);
    const queryList = `?id=${listId}`;

    const response: any = await this.apiService.reportingFrameworkList(
      queryList
    );
    this.viewList = response.data;
  }
  exportToPDF() {
    const pdfData: any = [];

    const headerRow = [
      'Sub Group Name',
      'Sub Group Role',
      'User count',
      'Created At',
    ];

    for (const item of this.exportReportingList) {
      const rowData = [
        item.admin_sub_group_name ||
        item.first_name + ' ' + item.middle_name + ' ' + item.last_name ||
        '-',
        item.admin_role_name || '-',
        item.user_count || '-',
        moment(item.created_at).format('YYYY-MM-DD hh:mm A'),
      ];
      pdfData.push(rowData);
    }

    this.exportService.exportToPDF(
      headerRow,
      pdfData,
      `Exported Reporting${this.formattedDate}`
    );
  }

  exportToCSV() {
    const csvData: any = [];

    const headerRow = [
      'Sub Group Name',
      'Sub Group Role',
      'User count',
      'Created At',
    ];
    csvData.push(headerRow);

    for (const item of this.exportReportingList) {
      const rowData = [
        item.admin_sub_group_name ||
        item.first_name + ' ' + item.middle_name + ' ' + item.last_name ||
        '-',
        item.admin_role_name || '-',
        item.user_count || '-',
        moment(item.created_at).format('YYYY-MM-DD hh:mm A'),
      ];
      csvData.push(rowData);
    }
    this.exportService.exportToCSV(
      csvData,
      `Exported Reporting${this.formattedDate}`
    );
  }

  exportToExcel() {
    const excelData: any = [];

    const headerRow = [
      'Sub Group Name',
      'Sub Group Role',
      'User count',
      'Created At',
    ];
    excelData.push(headerRow);

    for (const item of this.exportReportingList) {
      const rowData = [
        item.admin_sub_group_name ||
        item.first_name + ' ' + item.middle_name + ' ' + item.last_name ||
        '-',
        item.admin_role_name || '-',
        item.user_count || '-',
        moment(item.created_at).format('YYYY-MM-DD hh:mm A'),
      ];
      excelData.push(rowData);
    }
    this.exportService.exportToExcel(
      excelData,
      `Exported Reporting${this.formattedDate}`
    );
  }

  exportSelected(type) {
    switch (type) {
      case 'pdf':
        this.exportToPDF();
        break;
      case 'excel':
        this.exportToExcel();
        break;
      case 'csv':
        this.exportToCSV();
        break;
      default:
    }
  }
}
