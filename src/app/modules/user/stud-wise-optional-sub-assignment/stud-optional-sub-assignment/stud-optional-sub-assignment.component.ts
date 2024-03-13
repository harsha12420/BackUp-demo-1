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
  selector: 'app-stud-optional-sub-assignment',
  templateUrl: './stud-optional-sub-assignment.component.html',
  styleUrls: ['./stud-optional-sub-assignment.component.scss'],
})
export class StudOptionalSubAssignmentComponent {
  studSubAssignmentForm: FormGroup;
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
  divisionId: any;
  singleStudentId: any = [];
  studentId: any = [];
  mediumList: any;
  subjectList: any;
  standardList: any;
  divisionList: any;
  studentList: any;

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
    await this.getStudOptionalSubjAssignmentList();
    this.getMediumList();
    this.getSubjectList();
    this.getDivisionList();
    this.getStudentsList();
  }

  async getStudOptionalSubjAssignmentList(isExport = false) {
    this.utils.showLoading();
    let queryList = `?search=${this.searchString}&sort=${this.sort}&orderby=${this.orderBy}`;
    if (isExport) {
      queryList += `&skip_pagination=true`;
    }
    const response: any =
      await this.apiService.getStudOptionalSubjAssignmentList(queryList);
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
    this.getStudOptionalSubjAssignmentList();
  };
  onModalOpen() {
    this.formInit();
    if (!this.EditId) {
      this.studSubAssignmentForm.controls['single_student'].disable();
    } else {
      this.studSubAssignmentForm.controls['students'].disable();
    }
    this.modalReference = this.modalService.open(
      this.SubjectAssignment,
      this.config
    );
    this.modalReference.hidden.subscribe(() => {
      this.onModalClose();
    });
  }
  formInit() {
    this.studSubAssignmentForm = this.formBuilder.group({
      medium: [null, Validators.required],
      subject: [null, Validators.required],
      standard: [null, Validators.required],
      division: [null, Validators.required],
      single_student: [null, Validators.required],
      students: [null, Validators.required],
      status: ['true', Validators.required],
    });
  }
  get form() {
    return this.studSubAssignmentForm.controls;
  }
  async onSubmit() {
    try {
      this.isSubmitted = true;
      if (this.studSubAssignmentForm.invalid) {
        return;
      }
      this.utils.showLoading();

      const obj = {
        isActive:
          this.studSubAssignmentForm.controls['status'].value == 'true'
            ? true
            : false,
        medium_id: this.mediumId,
        subject_id: this.subjectId,
        standard_id: this.standardId,
        division_id: this.divisionId,
        student_ids: this.EditId ? this.singleStudentId : this.studentId,
      };
      this.EditId ? (obj['id'] = this.EditId) : '';
      const response: any = await this.apiService.addStudOptionalSubjAssignment(
        obj
      );
      this.utils.hideLoading();
      if (response.statusCode === 200) {
        this.utils.showSuccessToast(response.message);
        this.onModalClose();
        this.getStudOptionalSubjAssignmentList();
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
    this.singleStudentId = [];
    this.EditId = listId;
    const queryList = `?id=${listId}`;
    this.onModalOpen();
    const response: any =
      await this.apiService.getStudOptionalSubjAssignmentList(queryList);
    if ((response.statusCode = 200)) {
      this.mediumId = response.data.result[0].medium_id;
      this.subjectId = response.data.result[0].subject_id;
      this.standardId = response.data.result[0].standard_id;
      this.divisionId = response.data.result[0].division_id;
      let name =
        response.data.result[0].first_name +
        ' ' +
        response.data.result[0].last_name;
      this.EditId
        ? this.singleStudentId.push(response.data.result[0].student_id)
        : '';
      this.studSubAssignmentForm.controls['medium'].setValue(
        response.data.result[0].medium_name
      );
      this.mediumId = response.data.result[0].medium_id;

      this.studSubAssignmentForm.controls['subject'].setValue(
        response.data.result[0].subject_name
      );
      this.studSubAssignmentForm.controls['standard'].setValue(
        response.data.result[0].standard_name
      );
      this.studSubAssignmentForm.controls['division'].setValue(
        response.data.result[0].division_name
      );

      this.studSubAssignmentForm.controls['single_student'].setValue(name);
      this.studSubAssignmentForm.controls['status'].setValue(
        response.data.result[0].is_active ? true : false
      );
      this.getStandardList();
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
          await this.apiService.deleteStudOptionalSubjAssignment(id);
        if ((response.statusCode = 200)) {
          Swal.fire({
            title: 'Deleted!',
            text: 'Your Subject Assignment been deleted.',
            icon: 'success',
            confirmButtonColor: '#6259ca',
          });
          await this.getStudOptionalSubjAssignmentList();
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
    this.getStudOptionalSubjAssignmentList();
  }

  subject(event) {
    if (event) {
      this.subjectId = +event;
    }
  }

  medium(event) {
    if (event) {
      this.studSubAssignmentForm.controls['standard'].setValue(null);

      this.mediumId = +event;
      this.getStandardList();
    }
  }

  standard(event) {
    if (event) {
      this.standardId = +event;
    }
  }

  division(event) {
    if (event) {
      this.divisionId = +event;
    }
  }

  student(event) {
    if (event) {
      this.singleStudentId.push(+event);
    }
  }

  selectAllStudents() {
    const selected = this.studentList.map((item) => item.id.toString());
    this.studentId = selected;
    this.studSubAssignmentForm.controls['students'].patchValue(selected);
  }

  ClearAllStudents() {
    (this.studSubAssignmentForm.controls['students'] as any).patchValue([]);
    this.studentId = [];
  }

  getStudentId(event) {
    this.studentId = event;
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

  async getDivisionList() {
    const queryList = `?skip_pagination=${true}&sort=DESC`;
    const response: any = await this.apiService.getDivisionList(queryList);
    if (response.statusCode === 200) {
      this.divisionList = response.data.result;
    }
  }

  async getStudentsList() {
    const queryList = `?skip_pagination=${true}&sort=DESC`;
    const response: any = await this.apiService.getStudentList(queryList);
    if (response.statusCode === 200) {
      this.studentList = response.data.result;
    }
  }

  async exportAll(exportType) {
    const data: any = [];
    const headerRow = [
      'Medium',
      'Standard',
      'Division',
      'Subject',
      'Student Name',
      'Status',
      'Date & Time',
    ];
    if (exportType != 'pdf') {
      data.push(headerRow);
    }
    const arr: any = await this.getStudOptionalSubjAssignmentList(true);
    for (const item of arr) {
      const rowData = [
        item.medium_name || '-',
        item.standard_name || '-',
        item.division_name || '-',
        item.subject_name || '-',
        item.first_name + ' ' + item.middle_name + ' ' + item.last_name || '-',
        item.is_active ? 'Active' : 'In Active' || '-',
        moment(item.created_at).format('YYYY-MM-DD hh:mm A') || '-',
      ];
      data.push(rowData);
    }
    this.exportService.exportData(
      exportType,
      headerRow,
      data,
      `Exported Student Wise Optional Subject Assignment List${moment().format(
        'YYYY-MM-DD'
      )}`
    );
  }
}
