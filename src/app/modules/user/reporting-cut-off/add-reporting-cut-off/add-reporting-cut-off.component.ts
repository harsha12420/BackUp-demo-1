import { Component, TemplateRef, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
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
  selector: 'app-add-reporting-cut-off',
  templateUrl: './add-reporting-cut-off.component.html',
  styleUrls: ['./add-reporting-cut-off.component.scss'],
})
export class AddReportingCutOffComponent {
  resportingCutOff: FormGroup;
  modalReference: NgbModalRef;
  pageLimit = Constants.PAGE_LIMIT;
  currentPage = Constants.STARTING_PAGE;
  find = '';
  totalItems: number;
  reportingList: any = [];
  @ViewChild('ReportingCutOff', { static: false })
  ReportingCutOff: TemplateRef<any>;
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
  selectedExportOption: string = 'null';
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

    this.getSubGroupList();
    this.getReportingList();
  }

  async getSubGroupList() {
    const queryList = `?skip_pagination=true`;
    const response: any = await this.apiService.getSubGroupList(queryList);
    if (response.statusCode === 200) {
      this.subGroupList = response.data.result;
    }
  }
  async getroleList() {
    const queryList = `?skip_pagination=true&sub_group_id=${this.subGroupId}`;
    const response: any = await this.apiService.getRoleList(queryList);
    if (response.statusCode === 200) {
      this.roleList = response.data.result;
    }
  }
  async getReportingList() {
    this.utils.showLoading();
    const queryList = `?search=${this.searchString}&page=${this.currentPage}&limit=${this.pageLimit}&sort=${this.sort}&orderby=${this.orderBy}`;
    const response: any = await this.apiService.getRepotingCutOffList(
      queryList
    );
    if (response.statusCode === 200) {
      this.reportingList = response.data.result.map((item) => {
        const formattedCutOffTime = moment(
          item.cut_off_time,
          'HH:mm:ss'
        ).format('hh:mm A');

        const formattedDeadlineTime = moment(item.deadline, 'HH:mm:ss').format(
          'hh:mm A'
        );

        return {
          ...item,
          cut_off_time: formattedCutOffTime,
          deadline: formattedDeadlineTime,
        };
      });

      this.totalItems = response.data.totalCount;
    }
    this.utils.hideLoading();
  }

  onPageChange = async (page: any) => {
    this.currentPage = page;
    this.getReportingList();
  };
  onModalOpen() {
    this.formInit();
    this.modalReference = this.modalService.open(
      this.ReportingCutOff,
      this.config
    );
    this.modalReference.hidden.subscribe(() => {
      this.onModalClose();
    });
  }
  formInit() {
    this.resportingCutOff = this.formBuilder.group({
      // name: ['', [Validators.required, NoSpace()]],
      SubGroup: [null, Validators.required],
      Role: [null, Validators.required],
      cut_off_time: [null, Validators.required],
      deadline: [null, Validators.required],
    });
  }
  get form() {
    return this.resportingCutOff.controls;
  }
  async onSubmit() {
    try {
      this.isSubmitted = true;
      if (this.resportingCutOff.invalid) {
        return;
      }
      this.utils.showLoading();
      const cut_off_time = moment(
        this.resportingCutOff.value.cut_off_time
      ).format('HH:mm:ss');
      const deadline = moment(this.resportingCutOff.value.deadline).format(
        'HH:mm:ss'
      );

      const obj = {
        // name: this.resportingCutOff.controls['name'].value,
        admin_sub_group_id: this.subGroupId,
        role_id: this.roleId,
        cut_off_time: cut_off_time,
        deadline: deadline,
      };
      this.EditId ? (obj['id'] = this.EditId) : '';
      const response: any = await this.apiService.addRepotingCutOff(obj);
      this.utils.hideLoading();
      if (response.statusCode === 200) {
        this.utils.showSuccessToast(response.message);
        this.onModalClose();
        this.getReportingList();
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
  async editReportingCutOff(listId) {
    this.EditId = listId;
    const queryList = `?id=${listId}`;
    this.onModalOpen();
    const response: any = await this.apiService.getRepotingCutOffList(
      queryList
    );
    if (response.statusCode == 200) {
      this.resportingCutOff.controls['SubGroup'].setValue(
        response.data.result[0].admin_sub_group_name
      );
      this.subGroupId = response.data.result[0].admin_sub_group_id;
      this.resportingCutOff.controls['Role'].setValue(
        response.data.result[0].admin_role_name
      );
      this.roleId = response.data.result[0].role_id;
      const cutOffTimeParts = response.data.result[0].cut_off_time.split(':');
      const selectedTime = {
        hour: parseInt(cutOffTimeParts[0], 10),
        minute: parseInt(cutOffTimeParts[1], 10),
      };

      this.resportingCutOff.controls['cut_off_time'].setValue(selectedTime);

      const deadlineTimeParts = response.data.result[0].deadline.split(':');
      const deadlineSelectedTime = {
        hour: parseInt(deadlineTimeParts[0], 10),
        minute: parseInt(deadlineTimeParts[1], 10),
      };
      this.resportingCutOff.controls['deadline'].setValue(deadlineSelectedTime);
    }
  }

  deleteDepartment(id) {
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
        const response: any = await this.apiService.deleteRepotingCutOff(id);
        if ((response.statusCode = 200)) {
          Swal.fire({
            title: 'Deleted!',
            text: 'Your Department been deleted.',
            icon: 'success',
            confirmButtonColor: '#6259ca',
          });
          await this.getReportingList();
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
    this.getReportingList();
  }
  subGroup(event) {
    if (event) {
      this.resportingCutOff.controls['Role'].setValue(null);
      this.subGroupId = +event;
      this.getroleList();
    }
  }
  getRoleId(event) {
    this.roleId = +event;
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
      // 'Name',
      'Sub Group Name',
      'Sub Group Role',
      'Cut Off Time',
      'Deadline',
      'Created At',
    ];

    for (const item of this.reportingList) {
      const rowData = [
        // item.name,
        item.admin_sub_group_name || '-',
        item.admin_role_name || '-',
        item.cut_off_time || '-',
        item.deadline || '-',
        moment(item.created_at).format('YYYY-MM-DD hh:mm A'),
      ];
      pdfData.push(rowData);
    }

    this.exportService.exportToPDF(
      headerRow,
      pdfData,
      `Exported Reporting Cut Off${this.formattedDate}`
    );
  }

  exportToCSV() {
    const csvData: any = [];

    const headerRow = [
      // 'Name',
      'Sub Group Name',
      'Sub Group Role',
      'Cut Off Time',
      'Deadline',
      'Created At',
    ];
    csvData.push(headerRow);

    for (const item of this.reportingList) {
      const rowData = [
        // item.name,
        item.admin_sub_group_name || '-',
        item.admin_role_name || '-',
        item.cut_off_time || '-',
        item.deadline || '-',
        moment(item.created_at).format('YYYY-MM-DD hh:mm A'),
      ];
      csvData.push(rowData);
    }
    this.exportService.exportToCSV(
      csvData,
      `Exported Reporting Cut Off${this.formattedDate}`
    );
  }

  exportToExcel() {
    const excelData: any = [];

    const headerRow = [
      // 'Name',
      'Sub Group Name',
      'Sub Group Role',
      'Cut Off Time',
      'Deadline',
      'Created At',
    ];
    excelData.push(headerRow);

    for (const item of this.reportingList) {
      const rowData = [
        // item.name,
        item.admin_sub_group_name || '-',
        item.admin_role_name || '-',
        item.cut_off_time || '-',
        item.deadline || '-',
        moment(item.created_at).format('YYYY-MM-DD hh:mm A'),
      ];
      excelData.push(rowData);
    }
    this.exportService.exportToExcel(
      excelData,
      `Exported Reporting Cut Off${this.formattedDate}`
    );
  }
}
