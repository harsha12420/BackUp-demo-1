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
  selector: 'app-add-department',
  templateUrl: './add-department.component.html',
  styleUrls: ['./add-department.component.scss'],
})
export class AddDepartmentComponent {
  departmentForm: FormGroup;
  modalReference: NgbModalRef;
  pageLimit = Constants.PAGE_LIMIT;
  currentPage = Constants.STARTING_PAGE;
  find = '';
  totalItems: number;
  departmentList: any = [];
  @ViewChild('Department', { static: false })
  Department: TemplateRef<any>;
  isSubmitted = false;
  model1!: NgbDateStruct;
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
    modalDialogClass: 'modal-lg',
  };
  constructor(
    private modalService: NgbModal,
    private formBuilder: FormBuilder,
    private apiService: ApiService,
    private exportService: ExportService,
    private utils: UtilityService
  ) { }
  async ngOnInit() {
    await this.getDepartmentList();
  }
  async getDepartmentList(isExport = false) {
    this.utils.showLoading();
    let queryList = `?search=${this.searchString}&page=${this.currentPage}&limit=${this.pageLimit}&sort=${this.sort}&orderby=${this.orderBy}`;
    if (isExport) {
      queryList += `&skip_pagination=true`
    }
    const response: any = await this.apiService.getDepartmentList(queryList);
    if (!isExport && response.statusCode === 200) {
      this.departmentList = response.data.result;
      this.totalItems = response.data.totalCount;
    }
    else if (isExport && response.statusCode === 200) {
      this.utils.hideLoading();
      return response.data.result;
    }
    this.utils.hideLoading();
  }
  onPageChange = async (page: any) => {
    this.currentPage = page;
    this.getDepartmentList();
  };
  onModalOpen() {
    this.formInit();
    this.modalReference = this.modalService.open(this.Department, this.config);
    this.modalReference.hidden.subscribe(() => {
      this.onModalClose();
    });
  }
  formInit() {
    this.departmentForm = this.formBuilder.group({
      name: ['', [Validators.required, NoSpace()]],
      short_code: ['', [Validators.required, NoSpace()]],
      is_active: ['true', Validators.required],
    });
  }
  get form() {
    return this.departmentForm.controls;
  }
  async onSubmit() {
    try {
      this.isSubmitted = true;
      if (this.departmentForm.invalid) {
        return;
      }
      this.utils.showLoading();
      const obj = {
        name: this.departmentForm.controls['name'].value,
        short_code: this.departmentForm.controls['short_code'].value,
        isActive:
          this.departmentForm.controls['is_active'].value == 'true' ? true : false,
      };
      this.EditId ? (obj['id'] = this.EditId) : '';
      const response: any = await this.apiService.addDepartment(obj);
      this.utils.hideLoading();
      if (response.statusCode === 200) {
        this.utils.showSuccessToast(response.message);
        this.onModalClose();
        this.getDepartmentList();
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
  async editDepartment(listId) {
    this.EditId = listId;
    this.onModalOpen();
    const response: any = await this.apiService.getDepartmentId(listId);
    if ((response.statusCode = 200)) {
      this.departmentForm.controls['name'].setValue(response.data.name);
      this.departmentForm.controls['short_code'].setValue(response.data.short_code);
      this.departmentForm.controls['is_active'].setValue(response.data.is_active.toString())
    }
  }

  deleteDepartment(id) {
    Swal.fire({
      icon: 'warning',
      title: 'Are you sure?',
      text: 'You will not be able to recover Department !',
      showCancelButton: true,
      confirmButtonText: 'Yes, delete it!',
      confirmButtonColor: '#6259ca',
      cancelButtonText: 'No, cancel it!',
      cancelButtonColor: '#6259ca',
      reverseButtons: true,
    }).then(async (result: any) => {
      if (result.isConfirmed) {
        const response: any = await this.apiService.DepartmentDelete(id);
        if ((response.statusCode = 200)) {
          Swal.fire({
            title: 'Deleted!',
            text: 'Your Department been deleted.',
            icon: 'success',
            confirmButtonColor: '#6259ca',
          });
          await this.getDepartmentList();
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
      this.sort = this.isAscending ? 'ASC' : 'DESC'
    } else {
      this.isAscending = true;
      this.sort = 'ASC'
    }
    this.orderBy = columnName;
    this.getDepartmentList();
  }
  async exportAll(exportType) {
    const data: any = [];
    const headerRow = [
      "Department Name",
      "Department Date",
    ]
    if (exportType != "pdf") {
      data.push(headerRow);
    }
    const arr: any = await this.getDepartmentList(true);
    for (const item of arr) {
      const rowData = [
        item.name || "-",
        moment(item.date_joining).format("YYYY-MM-DD hh:mm A") || "-",
      ]
      data.push(rowData);
    }
    this.exportService.exportData(
      exportType,
      headerRow,
      data,
      `Exported Department List${moment().format("YYYY-MM-DD")}`
    );
  }
}
