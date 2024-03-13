import { Component, TemplateRef, ViewChild } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import {
  NgbDateStruct,
  NgbModal,
  NgbModalRef,
} from '@ng-bootstrap/ng-bootstrap';
import { Constants } from 'src/app/Constants/constants';
import { ApiService } from 'src/app/services/api.service';
import { UtilityService } from 'src/app/services/utility.service';
import { NoSpace } from 'src/app/shared/validations/no-space.validator';
import Swal from 'sweetalert2';
import * as moment from 'moment';
import { ExportService } from 'src/app/services/export-service.service';
@Component({
  selector: 'app-add-school-group-master',
  templateUrl: './add-school-group-master.component.html',
  styleUrls: ['./add-school-group-master.component.scss'],
})
export class AddSchoolGroupMasterComponent {
  schoolGroupForm: FormGroup;
  modalReference: NgbModalRef;
  pageLimit = Constants.PAGE_LIMIT;
  currentPage = Constants.STARTING_PAGE;
  find = '';
  totalItems: number;
  reportingList: any = [];
  @ViewChild('schoolGroup', { static: false })
  schoolGroup: TemplateRef<any>;
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
    modalDialogClass: 'modal-xl',
  };
  subGroupList: any;
  roleList: any;
  subGroupId: any;
  roleId: any;
  groupList: any;
  GroupId: any;
  staffList: any;
  viewList: any;
  selectedExportOption: string = 'pdf';
  currentDate = new Date();
  formattedDate: any;

  constructor(
    private modalService: NgbModal,
    private formBuilder: FormBuilder,
    private apiService: ApiService,
    private utils: UtilityService,
    private exportService: ExportService
  ) {}

  async ngOnInit() {
    this.formattedDate = this.currentDate.toISOString().slice(0, 10);
    this.getSchoolGroupList();
  }

  async getSubGroupList() {
    const queryList = `?skip_pagination=true&group_id=${this.GroupId}`;
    const response: any = await this.apiService.getSubGroupList(queryList);
    if (response.statusCode === 200) {
      this.subGroupList = response.data.result;
    }
  }
  async getGroupList() {
    const response: any = await this.apiService.getGroupList();
    if (response.statusCode === 200) {
      this.groupList = response.data.group_master_data;
    }
  }
  async getroleList() {
    const queryList = `?skip_pagination=true&sub_group_id=${this.subGroupId}`;
    const response: any = await this.apiService.getRoleList(queryList);
    if (response.statusCode === 200) {
      this.roleList = response.data.result;
    }
  }
  async getSchoolGroupList() {
    this.utils.showLoading();
    const queryList = `?search=${this.searchString}&page=${this.currentPage}&limit=${this.pageLimit}&sort=${this.sort}&orderby=${this.orderBy}`;
    const response: any = await this.apiService.schoolGroupMasterList(
      queryList
    );
    if (response.statusCode === 200) {
      this.reportingList = response.data.result;
      this.totalItems = response.data.totalCount;
    }
    this.utils.hideLoading();
  }

  onPageChange = async (page: any) => {
    this.currentPage = page;
    this.getSchoolGroupList();
  };
  async onModalOpen() {
    this.formInit();
    this.modalReference = this.modalService.open(this.schoolGroup, this.config);
    await this.getGroupList();
    await this.getStaffList();

    this.modalReference.hidden.subscribe(() => {
      this.onModalClose();
    });
  }
  formInit() {
    this.schoolGroupForm = this.formBuilder.group({
      name: ['', [Validators.required, NoSpace()]],
      description: ['', [Validators.required, NoSpace()]],
      SubGroup: [null, Validators.required],
      Group: [null, Validators.required],
      Role: [null, Validators.required],
      user_ids: this.formBuilder.array([
        this.formBuilder.group({ user_id: [null, Validators.required] }),
      ]),
    });
  }
  get form() {
    return this.schoolGroupForm.controls;
  }
  async onSubmit() {
    try {
      this.isSubmitted = true;
      if (this.schoolGroupForm.invalid) {
        return;
      }
      this.utils.showLoading();

      const obj = {
        name: this.schoolGroupForm.controls['name'].value,
        description: this.schoolGroupForm.controls['description'].value,
        admin_group_id: this.GroupId,
        admin_sub_group_id: this.subGroupId,
        role_id: this.roleId,
        user_ids: this.schoolGroupForm.value.user_ids[0].user_id,
      };
      this.EditId ? (obj['id'] = this.EditId) : '';
      const response: any = await this.apiService.addSchoolGroupMaster(obj);
      this.utils.hideLoading();
      if (response.statusCode === 200) {
        this.utils.showSuccessToast(response.message);
        this.onModalClose();
        this.getSchoolGroupList();
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
  async editSchoolGroup(listId) {
    this.EditId = listId;
    const queryList = `?id=${listId}`;
    this.onModalOpen();
    const response: any = await this.apiService.schoolGroupMasterList(
      queryList
    );
    if (response.statusCode == 200) {
      this.schoolGroupForm.controls['name'].setValue(response.data[0].name);
      this.schoolGroupForm.controls['description'].setValue(
        response.data[0].description
      );
      this.schoolGroupForm.controls['Group'].setValue(
        response.data[0].admin_group_name
      );
      this.GroupId = response.data[0].admin_group_id;
      this.schoolGroupForm.controls['SubGroup'].setValue(
        response.data[0].admin_sub_group_name
      );
      this.subGroupId = response.data[0].admin_sub_group_id;
      this.schoolGroupForm.controls['Role'].setValue(
        response.data[0].admin_role_name
      );
      this.roleId = response.data[0].role_id;
      let staffArr: any = [];
      const staffId: any = [];
      let staffIds = response.data[0].user_list;
      staffIds?.forEach((userId: any) => {
        staffId.push(userId.user_id);
      });
      (this.schoolGroupForm.controls['user_ids'] as any).controls[0].patchValue(
        {
          user_id: staffId,
        }
      );
    }
  }

  deleteSchoolGroup(id) {
    Swal.fire({
      icon: 'warning',
      title: 'Are you sure?',
      text: 'You will not be able to recover  Department !',
      showCancelButton: true,
      confirmButtonText: 'Yes, delete it!',
      confirmButtonColor: '#6259ca',
      cancelButtonText: 'No, cancel it!',
      cancelButtonColor: '#6259ca',
      reverseButtons: true,
    }).then(async (result: any) => {
      if (result.isConfirmed) {
        const response: any = await this.apiService.deleteSchoolGroupMaster(id);
        if ((response.statusCode = 200)) {
          Swal.fire({
            title: 'Deleted!',
            text: 'Your Department been deleted.',
            icon: 'success',
            confirmButtonColor: '#6259ca',
          });
          await this.getSchoolGroupList();
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
    this.getSchoolGroupList();
  }
  subGroup(event) {
    if (event) {
      this.schoolGroupForm.controls['Role'].setValue(null);
      this.subGroupId = +event;
      this.getroleList();
    }
  }
  Group(event) {
    if (event) {
      this.schoolGroupForm.controls['SubGroup'].setValue(null);
      this.schoolGroupForm.controls['Role'].setValue(null);

      this.GroupId = +event;
      this.getSubGroupList();
    }
  }
  getRoleId(event) {
    this.roleId = +event;
  }
  get user_ids(): FormArray {
    return this.schoolGroupForm.get('user_ids') as FormArray;
  }

  onSelectAll() {
    const selected = this.staffList.map((item) => item.id);
    (this.schoolGroupForm.controls['user_ids'] as any).controls[0].patchValue({
      user_id: selected,
    });
  }
  onClearAll() {
    (this.schoolGroupForm.controls['user_ids'] as any).controls[0].patchValue({
      user_id: null,
    });
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
  async onView(listId) {
    this.modalReference = this.modalService.open(this.view, this.config);
    const queryList = `?id=${listId}`;

    const response: any = await this.apiService.schoolGroupMasterList(
      queryList
    );
    this.viewList = response.data;
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
  exportToPDF() {
    const pdfData: any = [];
    const headerRow = [
      'name',
      'description',
      'Group Name',
      'Sub Group Name',
      'Sub Group Role',
      'User count',
      'Created At',
    ];

    for (const item of this.reportingList) {
      const rowData = [
        item.name || '-',
        item.description || '-',
        item.admin_group_name || '-',
        item.admin_sub_group_name || '-',
        item.admin_role_name || '-',
        item.user_count || '-',
        moment(item.created_at).format('YYYY-MM-DD hh:mm A'),
      ];
      pdfData.push(rowData);
    }

    this.exportService.exportToPDF(
      headerRow,
      pdfData,
      `Exported Group Master${this.formattedDate}`
    );
  }

  exportToCSV() {
    const csvData: any = [];

    const headerRow = [
      'name',
      'description',
      'Group Name',
      'Sub Group Name',
      'Sub Group Role',
      'User count',
      'Created At',
    ];
    csvData.push(headerRow);

    for (const item of this.reportingList) {
      const rowData = [
        item.name || '-',
        item.description || '-',
        item.admin_group_name || '-',
        item.admin_sub_group_name || '-',
        item.admin_role_name || '-',
        item.user_count || '-',
        moment(item.created_at).format('YYYY-MM-DD hh:mm A'),
      ];
      csvData.push(rowData);
    }
    this.exportService.exportToCSV(
      csvData,
      `Exported Group Master${this.formattedDate}`
    );
  }

  exportToExcel() {
    const excelData: any = [];
    const currentDate = new Date();
    const formattedDate = currentDate.toISOString().slice(0, 10);

    const headerRow = [
      'name',
      'description',
      'Group Name',
      'Sub Group Name',
      'Sub Group Role',
      'User count',
      'Created At',
    ];
    excelData.push(headerRow);

    for (const item of this.reportingList) {
      const rowData = [
        item.name || '-',
        item.description || '-',
        item.admin_group_name || '-',
        item.admin_sub_group_name || '-',
        item.admin_role_name || '-',
        item.user_count || '-',
        moment(item.created_at).format('YYYY-MM-DD hh:mm A'),
      ];
      excelData.push(rowData);
    }
    this.exportService.exportToExcel(
      excelData,
      `Exported Group Master${this.formattedDate}`
    );
  }
}
