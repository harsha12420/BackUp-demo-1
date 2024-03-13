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
  selector: 'app-group-master',
  templateUrl: './group-master.component.html',
  styleUrls: ['./group-master.component.scss']
})
export class GroupMasterComponent {
  addFeeGroup: FormGroup;
  modalReference: NgbModalRef;
  pageLimit = Constants.PAGE_LIMIT;
  currentPage = Constants.STARTING_PAGE;
  find = '';
  totalItems: number;
  groupMasterList: any = [];
  @ViewChild('GroupMaster', { static: false })
  GroupMaster: TemplateRef<any>;
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
    await this.getGroupMasterList();
  }

  async getGroupMasterList(isExport = false) {
    try{
      this.utils.showLoading();
      let queryList = `?search=${this.searchString}&page=${this.currentPage}&limit=${this.pageLimit}&sort=${this.sort}&orderby=${this.orderBy}`;
      if (isExport) {
        queryList += `&skip_pagination=true`;
      }
      const response: any = await this.apiService.getGroupMaster(queryList);
      if (!isExport && response.statusCode === 200) {
        this.groupMasterList = response.data.result;
        this.totalItems = response.data.totalCount;
      } else if (isExport && response.statusCode === 200) {
        this.utils.hideLoading();
        return response.data.result;
      }
      this.utils.hideLoading();
      }
      catch(e){
        this.utils.hideLoading();
      }
  }

  onPageChange = async (page: any) => {
    this.currentPage = page;
    this.getGroupMasterList();
  };
  onModalOpen() {
    this.formInit();
    this.modalReference = this.modalService.open(this.GroupMaster, this.config);
    this.modalReference.hidden.subscribe(() => {
      this.onModalClose();
    });
  }
  formInit() {
    this.addFeeGroup = this.formBuilder.group({
      feeGroup: ['', [Validators.required, NoSpace()]],
      Status: ['true', Validators.required],
    });
  }
  get form() {
    return this.addFeeGroup.controls;
  }
  async onSubmit() {
    try {
      this.isSubmitted = true;
      if (this.addFeeGroup.invalid) {
        return;
      }
      this.utils.showLoading();

      const obj = {
        name: this.addFeeGroup.controls['feeGroup'].value,
        isActive:
          this.addFeeGroup.controls['Status'].value == 'true'
            ? true
            : false,
      };
      this.EditId ? (obj['id'] = this.EditId) : '';
      const response: any = await this.apiService.addGroupMaster(obj);
      this.utils.hideLoading();
      if (response.statusCode === 200) {
        this.utils.showSuccessToast(response.message);
        this.onModalClose();
        this.getGroupMasterList();
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
  async editGroupRecord(listId) {
    this.EditId = listId;
    this.onModalOpen();
    const response: any = await this.apiService.getGroupMasterById(listId);
    if ((response.statusCode = 200)) {
      this.addFeeGroup.controls['feeGroup'].setValue(response.data.name);
      this.addFeeGroup.controls['Status'].setValue(
        response.data.is_active.toString()
      );
    }
  }

  deleteGroupRecord(id) {
    Swal.fire({
      icon: 'warning',
      title: 'Are you sure?',
      text: 'You will not be able to recover this group master !',
      showCancelButton: true,
      confirmButtonText: 'Yes, delete it!',
      confirmButtonColor: '#6259ca',
      cancelButtonText: 'No, cancel it!',
      cancelButtonColor: '#6259ca',
      reverseButtons: true,
    }).then(async (result: any) => {
      if (result.isConfirmed) {
        const response: any = await this.apiService.deleteGroupMaster(id);
        if ((response.statusCode = 200)) {
          Swal.fire({
            title: 'Deleted!',
            text: 'Your Group Master been deleted.',
            icon: 'success',
            confirmButtonColor: '#6259ca',
          });
          await this.getGroupMasterList();
        }
      } else if (result.dismiss === Swal.DismissReason.cancel) {
        Swal.fire({
          title: 'Cancelled!',
          text: 'Your Group Master is safe :)',
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
    this.getGroupMasterList();
  }

  async exportAll(exportType) {
    const data: any = [];
    const headerRow = ['Fee Group', 'Status', 'Date & Time'];
    if (exportType != 'pdf') {
      data.push(headerRow);
    }
    const arr: any = await this.getGroupMasterList(true);
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
      `Exported Fee Group List${moment().format('YYYY-MM-DD')}`
    );
  }
}
