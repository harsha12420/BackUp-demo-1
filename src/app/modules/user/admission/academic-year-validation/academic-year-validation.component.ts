import { Component, TemplateRef, ViewChild } from '@angular/core';
import { FormGroup, FormBuilder, Validators, ValidatorFn } from '@angular/forms';
import { NgbModalRef, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import * as moment from 'moment';
import { Constants } from 'src/app/Constants/constants';
import { ApiService } from 'src/app/services/api.service';
import { ExportService } from 'src/app/services/export-service.service';
import { UtilityService } from 'src/app/services/utility.service';
import { NoSpace } from 'src/app/shared/validations/no-space.validator';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-academic-year-validation',
  templateUrl: './academic-year-validation.component.html',
  styleUrls: ['./academic-year-validation.component.scss']
})
export class AcademicYearValidationComponent {
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
  academicYearList: any = [];
  standardList: any = [];
  mediumList: any = [];
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
    const response: any = await this.apiService.getAcademicYearValidationList(queryList);
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

  async getMediumList() {
    this.utils.showLoading();
    let queryList = `?skip_pagination=true&sort=DESC`;
    const response: any = await this.apiService.getMediumList(queryList);
    if (response.statusCode === 200) {
      this.mediumList = response.data.result;
    }
    this.utils.hideLoading();
  }

  getMediumId(event) {
    this.addForm.controls['standardId'].setValue(null);
    this.getStandardList(+event);
  }

  async getStandardList(id) {
    this.utils.showLoading();
    const response: any = await this.apiService.getStandardListById(id);
    if (response.statusCode === 200) {
      this.standardList = response.data.result;
    }
    this.utils.hideLoading();
  }

  async getAcademicList() {
    this.utils.showLoading();
    const queryList = `?skip_pagination=true`;
    const response: any = await this.apiService.getAcademicYearList(queryList);
    if (response.statusCode === 200) {
      this.academicYearList = response.data.result;
    }
    this.utils.hideLoading();
  }

  onPageChange = async (page: any) => {
    this.currentPage = page;
    this.getList();
  };
  onModalOpen() {
    this.formInit();
    this.getAcademicList();
    this.getMediumList();
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
      acdemicYearId: [null, [Validators.required]],
      mediumId: [null, [Validators.required]],
      standardId: [null, [Validators.required]],
      minimumAge: ['', [Validators.required]],
      maximumAge: [''],
      enrollmentLastDate: ['', [Validators.required]],
    }, {
      validator: this.minMaxValidator()
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
        standardId: +this.addForm.controls['standardId'].value,
        mediumId: +this.addForm.controls['mediumId'].value,
        isActive: true
      };
      this.EditId ? (obj['id'] = this.EditId) : '';
      const response: any = await this.apiService.updateAcademicYearValidation({ ...this.addForm.value, ...obj });
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
  async editAcademicYear(id) {
    this.EditId = id;
    this.onModalOpen();
    const queryList = `?id=${id}`;
    const response: any = await this.apiService.getAcademicYearValidationList(queryList);
    if ((response.statusCode = 200)) {
      const obj = {
        acdemicYearId: response.data.list.academicYearId._id,
        standardId: response.data.list.standardId.toString(),
        mediumId: response.data.list.mediumId.toString(),
        minimumAge: response.data.list.minimumAge,
        maximumAge: response.data.list.maximumAge,
        enrollmentLastDate: moment(response.data.list.enrollmentLastDate).format('YYYY-MM-DD'),
      }
      this.addForm.patchValue(obj);
    }
  }

  deleteAcademicYear(id) {
    Swal.fire({
      icon: 'warning',
      title: 'Are you sure?',
      text: 'You will not be able to recover this academic year validation!',
      showCancelButton: true,
      confirmButtonText: 'Yes, delete it!',
      confirmButtonColor: '#6259ca',
      cancelButtonText: 'No, cancel it!',
      cancelButtonColor: '#6259ca',
      reverseButtons: true,
    }).then(async (result: any) => {
      if (result.isConfirmed) {
        const response: any = await this.apiService.deleteAcademicYearValidation(id);
        if ((response.statusCode = 200)) {
          Swal.fire({
            title: 'Deleted!',
            text: 'Your academic year validation has been deleted.',
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

  async exportAcademicYear(exportType: string) {
    const data: any = [];

    const headerRow = [
      'Sr. No.',
      'Academic Year',
      'Medium',
      'Standard',
      'Minimum Age Criteria',
      'Maximum Age Criteria',
      'Enrollment Last Date',
      'Date & Time',
    ];

    if (exportType != 'pdf') {
      data.push(headerRow)
    }
    const arr: any = await this.getList(true);

    for (const [index, item] of arr.entries()) {
      const rowData = [
        index + 1,
        item.academicyear.title,
        item.mediumName,
        item.standardName,
        item.minimumAge,
        item.maximumAge,
        moment(item.enrollmentLastDate).format('YYYY-MM-DD'),
        moment(item.created_at).format('YYYY-MM-DD hh:mm A'),
      ];
      data.push(rowData);
    }
    this.exportService.exportData(exportType, headerRow, data, `Academic Year Validation`)
  }

  minMaxValidator(): ValidatorFn {
    return (control: any): { [key: string]: boolean } | null => {
      const minimumAge = control.get('minimumAge').value;
      const maximumAge = control.get('maximumAge').value;
      if (minimumAge && maximumAge && minimumAge >= maximumAge) {
        return { 'minmax': true };
      }
      return null;
    };
  }
}
