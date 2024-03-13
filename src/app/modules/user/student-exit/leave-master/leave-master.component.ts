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
  selector: 'app-leave-master',
  templateUrl: './leave-master.component.html',
  styleUrls: ['./leave-master.component.scss'],
})
export class LeaveMasterComponent {
  addLeaveRecord: FormGroup;
  modalReference: NgbModalRef;
  pageLimit = Constants.PAGE_LIMIT;
  currentPage = Constants.STARTING_PAGE;
  find = '';
  totalItems: number;
  leavingRecordList: any = [];
  @ViewChild('Leave', { static: false })
  Leave: TemplateRef<any>;
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
  constructor(
    private modalService: NgbModal,
    private formBuilder: FormBuilder,
    private apiService: ApiService,
    private exportService: ExportService,
    private utils: UtilityService
  ) {}

  async ngOnInit() {
    await this.getLeaveRecordList();
  }

  async getLeaveRecordList(isExport = false) {
    this.utils.showLoading();
    let queryList = `?search=${this.searchString}&page=${this.currentPage}&limit=${this.pageLimit}&sort=${this.sort}&orderby=${this.orderBy}`;
    if (isExport) {
      queryList += `&skip_pagination=true`;
    }
    const response: any = await this.apiService.getLeaveRecordList(queryList);
    if (!isExport && response.statusCode === 200) {
      this.leavingRecordList = response.data.result;
      this.totalItems = response.data.totalCount;
    } else if (isExport && response.statusCode === 200) {
      this.utils.hideLoading();
      return response.data.result;
    }
    this.utils.hideLoading();
  }

  onPageChange = async (page: any) => {
    this.currentPage = page;
    this.getLeaveRecordList();
  };
  onModalOpen() {
    this.formInit();
    this.modalReference = this.modalService.open(this.Leave, this.config);
    this.modalReference.hidden.subscribe(() => {
      this.onModalClose();
    });
  }
  formInit() {
    this.addLeaveRecord = this.formBuilder.group({
      reasonForLeave: ['', [Validators.required, NoSpace()]],
      Status: ['true', Validators.required],
    });
  }
  get form() {
    return this.addLeaveRecord.controls;
  }
  async onSubmit() {
    try {
      this.isSubmitted = true;
      if (this.addLeaveRecord.invalid) {
        return;
      }
      this.utils.showLoading();

      const obj = {
        reason_for_leaving_name:
          this.addLeaveRecord.controls['reasonForLeave'].value,
        isActive:
          this.addLeaveRecord.controls['Status'].value == 'true' ? true : false,
      };
      this.EditId ? (obj['id'] = this.EditId) : '';
      const response: any = await this.apiService.addLeaveRecord(obj);
      this.utils.hideLoading();
      if (response.statusCode === 200) {
        this.utils.showSuccessToast(response.message);
        this.onModalClose();
        this.getLeaveRecordList();
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
  async editLeaveRecord(listId) {
    this.EditId = listId;
    const queryList = `?id=${listId}`;
    this.onModalOpen();
    const response: any = await this.apiService.getLeaveRecordList(queryList);
    if ((response.statusCode = 200)) {
      this.addLeaveRecord.controls['reasonForLeave'].setValue(
        response.data.list.reason_for_leaving_name
      );
      this.addLeaveRecord.controls['Status'].setValue(
        response.data.list.is_active.toString()
      );
    }
  }

  deleteLeaveRecord(id) {
    Swal.fire({
      icon: 'warning',
      title: 'Are you sure?',
      text: 'You will not be able to recover reason for leaving !',
      showCancelButton: true,
      confirmButtonText: 'Yes, delete it!',
      confirmButtonColor: '#6259ca',
      cancelButtonText: 'No, cancel it!',
      cancelButtonColor: '#6259ca',
      reverseButtons: true,
    }).then(async (result: any) => {
      if (result.isConfirmed) {
        const response: any = await this.apiService.deleteLeaveRecord(id);
        if ((response.statusCode = 200)) {
          Swal.fire({
            title: 'Deleted!',
            text: 'Your Reason For Leaving  been deleted.',
            icon: 'success',
            confirmButtonColor: '#6259ca',
          });
          await this.getLeaveRecordList();
        }
      } else if (result.dismiss === Swal.DismissReason.cancel) {
        Swal.fire({
          title: 'Cancelled!',
          text: 'Your Reason For Leaving  is safe :)',
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
    this.getLeaveRecordList();
  }

  async exportAll(exportType) {
    const data: any = [];
    const headerRow = ['Reason For Leaving ', 'Status', 'Date & Time'];
    if (exportType != 'pdf') {
      data.push(headerRow);
    }
    const arr: any = await this.getLeaveRecordList(true);
    for (const item of arr) {
      const rowData = [
        item.reason_for_leaving_name || '-',
        item.is_active ? 'Active' : 'In Active' || '-',
        moment(item.created_at).format('YYYY-MM-DD hh:mm A') || '-',
      ];
      data.push(rowData);
    }
    this.exportService.exportData(
      exportType,
      headerRow,
      data,
      `Exported Leave List${moment().format('YYYY-MM-DD')}`
    );
  }
}
