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
import Swal from 'sweetalert2';

@Component({
  selector: 'app-subject-assignment',
  templateUrl: './subject-assignment.component.html',
  styleUrls: ['./subject-assignment.component.scss'],
})
export class SubjectAssignmentComponent {
  subjectAssignmentForm: FormGroup;
  modalReference: NgbModalRef;
  pageLimit = Constants.PAGE_LIMIT;
  currentPage = Constants.STARTING_PAGE;
  find = '';
  totalItems: number;
  subjectAssignmentRep: any = [];
  @ViewChild('SubjectAssignment', { static: false })
  SubjectAssignment: TemplateRef<any>;
  isSubmitted = false;
  model1!: NgbDateStruct;
  EditId: any;
  searchString = '';
  orderBy: any = 'created_at';
  sort = 'DESC';
  isAscending = false;
  mediumId: any;
  subjectId: any;
  standardId: any;
  subjectCategoryId: any;
  mediumList: any;
  subjectList: any;
  standardList: any;
  subjectCategoryList: any;

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
    await this.getSubjectAssignmentList();
    this.getMediumList();
    this.getSubjectList();
    this.getSubjectCategoryList();
  }

  async getSubjectAssignmentList(isExport = false) {
    this.utils.showLoading();
    let queryList = `?search=${this.searchString}&page=${this.currentPage}&limit=${this.pageLimit}&sort=${this.sort}&orderby=${this.orderBy}`;
    if (isExport) {
      queryList += `&skip_pagination=true`;
    }
    const response: any = await this.apiService.getSubjectAssignmentList(
      queryList
    );
    if (!isExport && response.statusCode === 200) {
      this.subjectAssignmentRep = response.data.result;
      this.totalItems = response.data.totalCount;
    } else if (isExport && response.statusCode === 200) {
      this.utils.hideLoading();
      return response.data.result;
    }
    this.utils.hideLoading();
  }

  onPageChange = async (page: any) => {
    this.currentPage = page;
    this.getSubjectAssignmentList();
  };
  onModalOpen() {
    this.formInit();
    this.modalReference = this.modalService.open(
      this.SubjectAssignment,
      this.config
    );
    this.modalReference.hidden.subscribe(() => {
      this.onModalClose();
    });
  }
  formInit() {
    this.subjectAssignmentForm = this.formBuilder.group({
      medium: [null, Validators.required],
      subject: [null, Validators.required],
      standard: [null, Validators.required],
      subject_category: [null, Validators.required],
      status: ['true', Validators.required],
    });
  }
  get form() {
    return this.subjectAssignmentForm.controls;
  }
  async onSubmit() {
    try {
      this.isSubmitted = true;
      if (this.subjectAssignmentForm.invalid) {
        return;
      }
      this.utils.showLoading();
      let value = this.subjectId.map((item) => +item);
      const obj = {
        isActive:
          this.subjectAssignmentForm.controls['status'].value == 'true'
            ? true
            : false,
        medium_id: this.mediumId,
        subject_list:
          typeof this.subjectId === 'object' && Array.isArray(this.subjectId)
            ? this.subjectId.map((data: any) => {
                return {
                  subject_id: data,
                };
              })
            : this.subjectId,
        standard_id: this.standardId,
        subject_category_id: this.subjectCategoryId,
      };
      this.EditId ? (obj['id'] = this.EditId) : '';
      const response: any =
        await this.apiService.addMediumStandardWiseSubjectAssignment(obj);
      this.utils.hideLoading();
      if (response.statusCode === 200) {
        this.utils.showSuccessToast(response.message);
        this.onModalClose();
        this.getSubjectAssignmentList();
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
  async editSubjectAssignment(listId) {
    this.EditId = listId;
    const queryList = `?id=${listId}`;
    this.onModalOpen();
    const response: any = await this.apiService.getSubjectAssignmentList(
      queryList
    );
    if ((response.statusCode = 200)) {
      this.mediumId = response.data.result[0].medium_id;
      this.subjectId = response.data.result[0].subject_id;
      this.standardId = response.data.result[0].standard_id;
      this.subjectCategoryId = response.data.result[0].subject_category_id;
      this.subjectAssignmentForm.controls['medium'].setValue(
        response.data.result[0].medium_name
      );
      this.subjectAssignmentForm.controls['subject'].setValue(
        response.data.result[0].subject_id
      );
      this.subjectAssignmentForm.controls['standard'].setValue(
        response.data.result[0].standard_name
      );
      this.subjectAssignmentForm.controls['subject_category'].setValue(
        response.data.result[0].subject_category_name
      );
      this.subjectAssignmentForm.controls['status'].setValue(
        response.data.result[0].is_active ? true : false
      );
    }
  }

  deleteSubjectAssignment(id) {
    Swal.fire({
      icon: 'warning',
      title: 'Are you sure?',
      text: 'You will not be able to recover Subject Assignment!',
      showCancelButton: true,
      confirmButtonText: 'Yes, delete it!',
      confirmButtonColor: '#6259ca',
      cancelButtonText: 'No, cancel it!',
      cancelButtonColor: '#6259ca',
      reverseButtons: true,
    }).then(async (result: any) => {
      if (result.isConfirmed) {
        const response: any =
          await this.apiService.deleteMediumStandardWiseSubjectAssignment(id);
        if ((response.statusCode = 200)) {
          Swal.fire({
            title: 'Deleted!',
            text: 'Your Subject Assignment been deleted.',
            icon: 'success',
            confirmButtonColor: '#6259ca',
          });
          await this.getSubjectAssignmentList();
        }
      } else if (result.dismiss === Swal.DismissReason.cancel) {
        Swal.fire({
          title: 'Cancelled!',
          text: 'Your Subject Assignment is safe :)',
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
    this.getSubjectAssignmentList();
  }

  subject(event) {
    if (event) {
      this.subjectId = event;
    }
  }

  medium(event) {
    if (event) {
      this.subjectAssignmentForm.controls['standard'].setValue(null);
      this.mediumId = +event;
      this.getStandardList();
    }
  }

  standard(event) {
    if (event) {
      this.standardId = +event;
    }
  }

  subject_category(event) {
    if (event) {
      this.subjectCategoryId = +event;
    }
  }

  async getMediumList() {
    const queryList = `?skip_pagination=${true}&sort=DESC`;
    const response: any = await this.apiService.getMediumList(queryList);
    if (response.statusCode === 200) {
      this.mediumList = response.data.result;
    }
  }

  async getSubjectList() {
    this.utils.showLoading();
    const queryList = `?skip_pagination=${true}&sort=DESC&isActive=true`;
    const response: any = await this.apiService.getSubjectList(queryList);
    if (response.statusCode === 200) {
      this.subjectList = response.data.result;
    }
    this.utils.hideLoading();
  }

  // async getStandardList() {
  //   const queryList = `?skip_pagination=${true}&sort=DESC`;
  //   const response: any = await this.apiService.getStandardList(queryList);
  //   if (response.statusCode === 200) {
  //     this.standardList = response.data.result;
  //   }
  // }
  async getStandardList() {
    let queryList = this.mediumId;
    const response: any = await this.apiService.getStandardListById(queryList);
    if (response.statusCode === 200) {
      this.standardList = response.data.result;
    }
  }

  async getSubjectCategoryList() {
    const queryList = `?skip_pagination=${true}&sort=DESC`;
    const response: any = await this.apiService.getSubjectCategoryList(
      queryList
    );
    if (response.statusCode === 200) {
      this.subjectCategoryList = response.data.result;
    }
  }

  async exportAll(exportType) {
    const data: any = [];
    const headerRow = [
      'Medium',
      'Standard',
      'Subject',
      'Subject Category',
      'Status',
      'Date & Time',
    ];
    if (exportType != 'pdf') {
      data.push(headerRow);
    }
    const arr: any = await this.getSubjectAssignmentList(true);
    for (const item of arr) {
      const rowData = [
        item.medium_name || '-',
        item.standard_name || '-',
        item.subject_name || '-',
        item.subject_category_name || '-',
        item.is_active ? 'Active' : 'In Active' || '-',
        moment(item.created_at).format('YYYY-MM-DD hh:mm A') || '-',
      ];
      data.push(rowData);
    }
    this.exportService.exportData(
      exportType,
      headerRow,
      data,
      `Exported Medium & Standard Wise Subject Assignment List${moment().format(
        'YYYY-MM-DD'
      )}`
    );
  }
}
