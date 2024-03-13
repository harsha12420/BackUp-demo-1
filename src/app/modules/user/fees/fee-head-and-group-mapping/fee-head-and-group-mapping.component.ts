import { AfterViewInit, Component, ElementRef, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
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
  selector: 'app-fee-head-and-group-mapping',
  templateUrl: './fee-head-and-group-mapping.component.html',
  styleUrls: ['./fee-head-and-group-mapping.component.scss']
})
export class FeeHeadAndGroupMappingComponent implements OnInit {
  isEdit:any = false;
  addFeeHeadGroup: FormGroup;
  modalReference: NgbModalRef;
  pageLimit = Constants.PAGE_LIMIT;
  currentPage = Constants.STARTING_PAGE;
  totalItems: number;
  headGroupMasterList: any = [];
  @ViewChild('FeeAndHeadGroupMaster', { static: false })
  FeeAndHeadGroupMaster: TemplateRef<any>;
  headGroupMasterListing:any = [];
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
  groupMasterList :any;
  selectedItems:any = [];
  
  constructor(
    private modalService: NgbModal,
    private formBuilder: FormBuilder,
    private apiService: ApiService,
    private utils: UtilityService,
    private exportService: ExportService
  ) {
   }

  async ngOnInit() {
    await this.getHeadGroupList();
    await this.getGroupMasterList();
    await this.getHeadGroupListing();
  }

  async getGroupMasterList() {
    this.utils.showLoading();
    const queryList = `?search=${this.searchString}&page=${this.currentPage}&limit=${this.pageLimit}&sort=${this.sort}&orderby=${this.orderBy}`;
    const response: any = await this.apiService.getGroupMaster(queryList);
    if (response.statusCode === 200) {
      this.groupMasterList = response.data.result;
    }
    this.utils.hideLoading();
  }


  async getHeadGroupListing() {
    this.utils.showLoading();
    const queryList = `?search=${this.searchString}&page=${this.currentPage}&limit=${this.pageLimit}&sort=${this.sort}&orderby=${this.orderBy}`;
    const response: any = await this.apiService.getHeadGroupMaster(queryList);
    if (response.statusCode === 200) {
      this.headGroupMasterListing = response.data.result;
    }
    this.utils.hideLoading();
  }

  async getHeadGroupList(isExport = false) {
    try{
      this.utils.showLoading();
      let queryList = `?search=${this.searchString}&page=${this.currentPage}&limit=${this.pageLimit}&sort=${this.sort}&orderby=${this.orderBy}`;
      if (isExport) {
        queryList += `&skip_pagination=true`;
      }
      const response: any = await this.apiService.getHeadAndGroupMaster(queryList);
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
    this.modalReference = this.modalService.open(this.FeeAndHeadGroupMaster, this.config);
    this.modalReference.hidden.subscribe(() => {
      this.onModalClose();
    });
  }
  formInit() {
    this.addFeeHeadGroup = this.formBuilder.group({
      feeHeadGroup : ['' || null, [Validators.required]],
      feeGroup: ['' || null, [Validators.required]],
      Status: ['true', Validators.required],
    });
  }
  get form() {
    return this.addFeeHeadGroup.controls;
  }

  onSecondaryRoleChange(value) {
    this.selectedItems = value;
  }


  async onSubmit() {
    try {
      this.isSubmitted = true;
      if (this.addFeeHeadGroup.invalid) {
        return;
      }
      this.utils.showLoading();
      let obj = {
        fee_head_group_id: +this.addFeeHeadGroup.controls['feeHeadGroup'].value,
        fee_group_ids : this.selectedItems,
        isActive:
          this.addFeeHeadGroup.controls['Status'].value == 'true'
            ? true
            : false,
      };
      
      if(this.EditId){
        obj['id'] = this.EditId;
        obj['fee_group_id'] = this.addFeeHeadGroup.controls['feeGroup'].value;
        delete obj.fee_group_ids;
      }
      const response: any = await this.apiService.addHeadAndGroupMaster(obj);
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
    this.isEdit = false;
    this.modalReference.close();
    this.selectedItems = []
  }
  async editHeadGroupRecord(listId) {
    this.EditId = listId;
    if(this.EditId){
      this.isEdit = true;
    }
    this.onModalOpen();
    const response: any = await this.apiService.getHeadAndGroupMasterById(listId);
    if ((response.statusCode = 200)) {
      this.addFeeHeadGroup.controls['feeHeadGroup'].setValue(response.data.fee_head_group_id);
      this.addFeeHeadGroup.controls['feeGroup'].setValue(response.data.fee_group_id);
      this.addFeeHeadGroup.controls['Status'].setValue(
        response.data.is_active.toString()
      );
    }
  }

  deleteHeadGroupRecord(id) {
    Swal.fire({
      icon: 'warning',
      title: 'Are you sure?',
      text: 'You will not be able to recover this head and group master!',
      showCancelButton: true,
      confirmButtonText: 'Yes, delete it!',
      confirmButtonColor: '#6259ca',
      cancelButtonText: 'No, cancel it!',
      cancelButtonColor: '#6259ca',
      reverseButtons: true,
    }).then(async (result: any) => {
      if (result.isConfirmed) {
        const response: any = await this.apiService.deleteHeadAndGroupMaster(id);
        if ((response.statusCode = 200)) {
          Swal.fire({
            title: 'Deleted!',
            text: 'Your Group And Head Master been deleted.',
            icon: 'success',
            confirmButtonColor: '#6259ca',
          });
          await this.getHeadGroupList();
        }
      } else if (result.dismiss === Swal.DismissReason.cancel) {
        Swal.fire({
          title: 'Cancelled!',
          text: 'Your Group And Head Master is safe :)',
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
    const headerRow = ['Fee Head Group', 'Fee Group', 'Status', 'Date & Time'];
    if (exportType != 'pdf') {
      data.push(headerRow);
    }
    const arr: any = await this.getHeadGroupList(true);
    for (const item of arr) {
      const rowData = [
        item.fee_head_group_master_name || '-',
        item.fee_group_master_name || '-',
        item.is_active ? 'Active' : 'In Active' || '-',
        moment(item.created_at).format('YYYY-MM-DD hh:mm A') || '-',
      ];
      data.push(rowData);
    }
    this.exportService.exportData(
      exportType,
      headerRow,
      data,
      `Exported Fee Head and Group Mapping List${moment().format('YYYY-MM-DD')}`
    );
  }
}
