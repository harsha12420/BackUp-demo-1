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
  selector: 'app-add-job-round',
  templateUrl: './add-job-round.component.html',
  styleUrls: ['./add-job-round.component.scss'],
})
export class AddJobRoundComponent {
  addJobRoundForm: FormGroup;
  modalReference: NgbModalRef;
  pageLimit = Constants.PAGE_LIMIT;
  currentPage = Constants.STARTING_PAGE;
  find = '';
  totalItems: number;
  JobRoundList: any = [];
  @ViewChild('JobRound', { static: false })
  JobRound: TemplateRef<any>;
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
    private exportService:ExportService,
    private utils: UtilityService
  ) { }

  async ngOnInit() {
    await this.getJobRoundList();
  }

  async getJobRoundList(isExport=false) {
    this.utils.showLoading();
    let queryList = `?search=${this.searchString}&page=${this.currentPage}&limit=${this.pageLimit}&sort=${this.sort}&orderby=${this.orderBy}`;
    if(isExport)queryList+=`&`
    const response: any = await this.apiService.getJobRoundList(queryList);
    if (!isExport&&response.statusCode === 200) {
      this.JobRoundList = response.data.result;
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
    this.getJobRoundList();
  };
  onModalOpen() {
    this.formInit();
    this.modalReference = this.modalService.open(this.JobRound, this.config);
    this.modalReference.hidden.subscribe(() => {
      this.onModalClose();
    });
  }
  formInit() {
    this.addJobRoundForm = this.formBuilder.group({
      name: ['', [Validators.required, NoSpace()]],
      Status: ['true', Validators.required],
    });
  }
  get form() {
    return this.addJobRoundForm.controls;
  }
  async onSubmit() {
    try {
      this.isSubmitted = true;
      if (this.addJobRoundForm.invalid) {
        return;
      }
      this.utils.showLoading();

      const obj = {
        name: this.addJobRoundForm.controls['name'].value,
        isActive:
          this.addJobRoundForm.controls['Status'].value == 'true'
            ? true
            : false,
      };
      this.EditId ? (obj['id'] = this.EditId) : '';
      const response: any = await this.apiService.addJobRound(obj);
      this.utils.hideLoading();
      if (response.statusCode === 200) {
        this.utils.showSuccessToast(response.message);
        this.onModalClose();
        this.getJobRoundList();
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
  async editJobRoundList(listId) {
    this.EditId = listId;
    this.onModalOpen();
    const response: any = await this.apiService.getJobRoundId(listId);
    if ((response.statusCode = 200)) {
      this.addJobRoundForm.controls['name'].setValue(response.data.name);

      this.addJobRoundForm.controls['Status'].setValue(
        response.data.is_active.toString()
      );
    }
  }

  deleteJobRoundList(id) {
    Swal.fire({
      icon: 'warning',
      title: 'Are you sure?',
      text: 'You will not be able to recover this job round!',
      showCancelButton: true,
      confirmButtonText: 'Yes, delete it!',
      confirmButtonColor: '#6259ca',
      cancelButtonText: 'No, cancel it!',
      cancelButtonColor: '#6259ca',
      reverseButtons: true,
    }).then(async (result: any) => {
      if (result.isConfirmed) {
        const response: any = await this.apiService.JobRoundDelete(id);
        if ((response.statusCode = 200)) {
          Swal.fire({
            title: 'Deleted!',
            text: 'Your job round has been deleted.',
            icon: 'success',
            confirmButtonColor: '#6259ca',
          });
          await this.getJobRoundList();
        }
      } else if (result.dismiss === Swal.DismissReason.cancel) {
        Swal.fire({
          title: 'Cancelled!',
          text: 'Your job round is safe :)',
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
    this.getJobRoundList();
  }

  async exportAll(exportType ){
    const data: any = [];
    const headerRow = [ 
      "Job Round Name",
      "Job Round Status",
      "Job Round Date"
   ]
    if (exportType != "pdf") {
      data.push(headerRow);
    }
    const arr: any = await this.getJobRoundList(true);
    for (const item of arr) {
      const rowData = [
        item.name||"-",
        item.is_active ? "Active" : "In Active"||"-",
        moment(item.created_at).format("YYYY-MM-DD hh:mm A")||"-",
      ]
      data.push(rowData);
    }
    this.exportService.exportData(
      exportType,
      headerRow,
      data,
      `Exported Job Round List${ moment().format("YYYY-MM-DD")}`
    );
  }
}
