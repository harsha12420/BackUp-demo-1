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
  selector: 'app-head-group-master',
  templateUrl: './head-group-master.component.html',
  styleUrls: ['./head-group-master.component.scss']
})
export class HeadGroupMasterComponent {
  addFeeHeadGroup: FormGroup;
  modalReference: NgbModalRef;
  pageLimit = Constants.PAGE_LIMIT;
  currentPage = Constants.STARTING_PAGE;
  find = '';
  totalItems: number;
  headGroupMasterList: any = [];
  @ViewChild('HeadGroupMaster', { static: false })
  HeadGroupMaster: TemplateRef<any>;
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
    private utils: UtilityService,
    private exportService: ExportService
  ) { }

  async ngOnInit() {
    await this.getHeadGroupList();
  }

  async getHeadGroupList(isExport = false) {
    try{
      this.utils.showLoading();
      let queryList = `?search=${this.searchString}&page=${this.currentPage}&limit=${this.pageLimit}&sort=${this.sort}&orderby=${this.orderBy}`;
      if (isExport) {
        queryList += `&skip_pagination=true`;
      }
      const response: any = await this.apiService.getHeadGroupMaster(queryList);
      if (!isExport && response.statusCode === 200) {
        this.headGroupMasterList = response.data.result;
        this.totalItems = response.data.totalCount;
      } else if (isExport && response.statusCode === 200) {
        this.utils.hideLoading();
        return response.data.result;
      }
      this.utils.hideLoading();
    }catch(e){
      this.utils.hideLoading();
    }
  }

  onPageChange = async (page: any) => {
    this.currentPage = page;
    this.getHeadGroupList();
  };
  onModalOpen() {
    this.formInit();
    this.modalReference = this.modalService.open(this.HeadGroupMaster, this.config);
    this.modalReference.hidden.subscribe(() => {
      this.onModalClose();
    });
  }
  formInit() {
    this.addFeeHeadGroup = this.formBuilder.group({
      feeHeadGroup: ['', [Validators.required, NoSpace()]],
      Status: ['true', Validators.required],
    });
  }
  get form() {
    return this.addFeeHeadGroup.controls;
  }
  async onSubmit() {
    try {
      this.isSubmitted = true;
      if (this.addFeeHeadGroup.invalid) {
        return;
      }
      this.utils.showLoading();
      const obj = {
        name: this.addFeeHeadGroup.controls['feeHeadGroup'].value,
        isActive:
          this.addFeeHeadGroup.controls['Status'].value == 'true'
            ? true
            : false,
      };
      this.EditId ? (obj['id'] = this.EditId) : '';
      const response: any = await this.apiService.addHeadGroupMaster(obj);
      this.utils.hideLoading();
      if (response.statusCode === 200) {
        this.utils.showSuccessToast(response.message);
        this.onModalClose();
        this.getHeadGroupList();
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
  async editHeadGroupRecord(listId) {
    this.EditId = listId;
    this.onModalOpen();
    const response: any = await this.apiService.getHeadGroupMasterById(listId);
    if ((response.statusCode = 200)) {
      this.addFeeHeadGroup.controls['feeHeadGroup'].setValue(response.data.name);
      this.addFeeHeadGroup.controls['Status'].setValue(
        response.data.is_active.toString()
      );
    }
  }

  deleteHeadGroupRecord(id) {
    Swal.fire({
      icon: 'warning',
      title: 'Are you sure?',
      text: 'You will not be able to recover this group head master  !',
      showCancelButton: true,
      confirmButtonText: 'Yes, delete it!',
      confirmButtonColor: '#6259ca',
      cancelButtonText: 'No, cancel it!',
      cancelButtonColor: '#6259ca',
      reverseButtons: true,
    }).then(async (result: any) => {
      if (result.isConfirmed) {
        const response: any = await this.apiService.deleteHeadGroupMaster(id);
        if ((response.statusCode = 200)) {
          Swal.fire({
            title: 'Deleted!',
            text: 'Your Group Head Master been deleted.',
            icon: 'success',
            confirmButtonColor: '#6259ca',
          });
          await this.getHeadGroupList();
        }
      } else if (result.dismiss === Swal.DismissReason.cancel) {
        Swal.fire({
          title: 'Cancelled!',
          text: 'Your Group Head Master is safe :)',
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
    this.getHeadGroupList();
  }

  async exportAll(exportType) {
    const data: any = [];
    const headerRow = ['Fee Head Group', 'Status', 'Date & Time'];
    if (exportType != 'pdf') {
      data.push(headerRow);
    }
    const arr: any = await this.getHeadGroupList(true);
    for (const item of arr) {
      const rowData = [
        item.name || '-',
        item.is_active ? 'Active' : 'In Active' || '-',
        moment(item.created_at).format('YYYY-MM-DD hh:mm A') || '-',
      ];
      data.push(rowData);
    }
    this.exportService.exportData(
      exportType,
      headerRow,
      data,
      `Exported Fee Head Group List${moment().format('YYYY-MM-DD')}`
    );
  }
}





