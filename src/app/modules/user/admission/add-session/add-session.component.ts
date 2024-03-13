import { Component, TemplateRef, ViewChild } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { NgbModalRef, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import * as moment from 'moment';
import { Constants } from 'src/app/Constants/constants';
import { ApiService } from 'src/app/services/api.service';
import { ExportService } from 'src/app/services/export-service.service';
import { UtilityService } from 'src/app/services/utility.service';
import { NoSpace } from 'src/app/shared/validations/no-space.validator';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-add-session',
  templateUrl: './add-session.component.html',
  styleUrls: ['./add-session.component.scss']
})
export class AddSessionComponent {
  addForm: FormGroup;
  modalReference: NgbModalRef;
  pageLimit = Constants.PAGE_LIMIT;
  currentPage = Constants.STARTING_PAGE;
  totalItems: number;
  list: any = [];
  @ViewChild('addTemp', { static: false }) addTemp: TemplateRef<any>;
  isSubmitted = false;
  EditId: any;
  searchString = '';
  orderBy: any = 'created_at';
  sort = 'DESC'
  isAscending = false
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
    private utils: UtilityService,
    private exportService: ExportService
  ) { }

  async ngOnInit() {
    await this.getList();
  }

  async getList(isExport = false) {
    this.utils.showLoading();
    let queryList = `?search=${this.searchString}&page=${this.currentPage}&limit=${this.pageLimit}&sort=${this.sort}&orderby=${this.orderBy}`;
    if (isExport) queryList += `&skip_pagination=true`;
    const response: any = await this.apiService.getSessionList(queryList);
    if (isExport && response.statusCode === 200) {
      this.utils.hideLoading();
      return response.data.result
    }
    if (response.statusCode === 200) {
      this.list = response.data.result;
      this.totalItems = response.data.totalCount;
    }
    this.utils.hideLoading();
  }

  onPageChange = async (page: any) => {
    this.currentPage = page;
    this.getList();
  };
  onModalOpen() {
    this.formInit();
    this.modalReference = this.modalService.open(
      this.addTemp,
      this.config
    );
    this.modalReference.hidden.subscribe(() => {
      this.onModalClose();
    });
  }
  formInit() {
    this.addForm = this.formBuilder.group({
      name: ['', [Validators.required, NoSpace()]],
      Status: ['true', Validators.required],
    });
  }
  get form() {
    return this.addForm.controls;
  }
  async onSubmit() {
    try {
      this.isSubmitted = true;
      if (this.addForm.invalid) {
        return;
      }
      this.utils.showLoading();

      const obj = {
        name: this.addForm.controls['name'].value,
        isActive:
          this.addForm.controls['Status'].value == 'true'
            ? true
            : false,
      };
      this.EditId ? (obj['id'] = this.EditId) : '';
      const response: any = await this.apiService.updateSession(obj);
      this.utils.hideLoading();
      if (response.statusCode === 200) {
        this.utils.showSuccessToast(response.message);
        this.onModalClose();
        this.getList();
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
  async editSession(id) {
    this.EditId = id;
    this.onModalOpen();
    const queryList = `?id=${id}`;
    const response: any = await this.apiService.getSessionList(queryList);
    if ((response.statusCode = 200)) {
      this.addForm.controls['name'].setValue(response.data.list.name);

      this.addForm.controls['Status'].setValue(
        response.data.list.isActive.toString()
      );
    }
  }

  deleteSession(id) {
    Swal.fire({
      icon: 'warning',
      title: 'Are you sure?',
      text: 'You will not be able to recover this session!',
      showCancelButton: true,
      confirmButtonText: 'Yes, delete it!',
      confirmButtonColor: '#6259ca',
      cancelButtonText: 'No, cancel it!',
      cancelButtonColor: '#6259ca',
      reverseButtons: true,
    }).then(async (result: any) => {
      if (result.isConfirmed) {
        const response: any = await this.apiService.deleteSession(id);
        if ((response.statusCode = 200)) {
          Swal.fire({
            title: 'Deleted!',
            text: 'Your session has been deleted.',
            icon: 'success',
            confirmButtonColor: '#6259ca',
          });
          await this.getList();
        }
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
      this.sort = this.isAscending ? 'ASC' : 'DESC'
    } else {
      this.isAscending = true;
      this.sort = 'ASC'
    }
    this.orderBy = columnName;
    this.getList();
  }

  async exportSession(exportType: string) {
    const data: any = [];

    const headerRow = [
      'Sr. No.',
      'Session Name',
      'Status',
      'Date & Time',
    ];

    if (exportType != 'pdf') {
      data.push(headerRow)
    }
    const arr: any = await this.getList(true);

    for (const [index, item] of arr.entries()) {
      const rowData = [
        index + 1,
        item.name,
        item.isActive ? "Active" : "In Active",
        moment(item.created_at).format('YYYY-MM-DD hh:mm A'),
      ];
      data.push(rowData);
    }
    this.exportService.exportData(exportType, headerRow, data, `Session`)
  }
}
