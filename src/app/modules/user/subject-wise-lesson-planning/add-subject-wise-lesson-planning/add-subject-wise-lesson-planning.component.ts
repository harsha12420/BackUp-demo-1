import { Component, TemplateRef, ViewChild } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import {
  NgbDateStruct,
  NgbModal,
  NgbModalRef,
} from '@ng-bootstrap/ng-bootstrap';
import { Constants } from 'src/app/Constants/constants';
import { ApiService } from 'src/app/services/api.service';
import { UtilityService } from 'src/app/services/utility.service';
import { NoSpace } from 'src/app/shared/validations/no-space.validator';
import { BsDatepickerViewMode } from 'ngx-bootstrap/datepicker';
import Swal from 'sweetalert2';
import * as moment from 'moment';
import { Router } from '@angular/router';
import { ExportService } from 'src/app/services/export-service.service';
import { CdkDragDrop, moveItemInArray } from '@angular/cdk/drag-drop';
@Component({
  selector: 'app-add-subject-wise-lesson-planning',
  templateUrl: './add-subject-wise-lesson-planning.component.html',
  styleUrls: ['./add-subject-wise-lesson-planning.component.scss'],
})
export class AddSubjectWiseLessonPlanningComponent {
  lessonPlanningForm: FormGroup;
  modalReference: NgbModalRef;
  pageLimit = Constants.PAGE_LIMIT;
  currentPage = Constants.STARTING_PAGE;
  find = '';
  totalItems: number;
  subjectAssignmentRep: any = [];
  @ViewChild('LessonPlanning', { static: false })
  LessonPlanning: TemplateRef<any>;
  isSubmitted = false;
  model1!: NgbDateStruct;
  EditId: any;
  searchString = '';
  orderBy: any = 'sequence';
  sort = 'DESC';
  isAscending = false;
  mediumId: any;
  subjectId: any;
  standardId: any;
  studentId: any = [];
  mediumList: any;
  subjectList: any;
  standardList: any;

  minMode: BsDatepickerViewMode = 'year';
  maxDate: any;
  bsConfig;
  todayDate = new Date().toISOString().split('T')[0];

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
    private exportService: ExportService,
    private router: Router
  ) {}

  async ngOnInit() {
    await this.getSubjectWiseLessonPlanningList();
    this.getMediumList();
    // this.getSubjectList();
    // this.getStandardList();
  }

  async getSubjectWiseLessonPlanningList(isExport = false) {
    this.utils.showLoading();
    let queryList = `?search=${this.searchString}&sort=${this.sort}&orderby=${this.orderBy}`;
    if (isExport) {
      queryList += `&skip_pagination=true`;
    }
    const response: any =
      await this.apiService.getSubjectWiseLessonPlanningList(queryList);
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
    this.getSubjectWiseLessonPlanningList();
  };

  addLessonPlanning() {
    this.router.navigate([
      '/admin/subject-wise-lesson-planning/add-lesson-planning',
    ]);
  }

  onModalOpen() {
    this.formInit();
    if (this.EditId) {
      this.lessonPlanningForm.controls['status'].disable();
    }
    this.modalReference = this.modalService.open(
      this.LessonPlanning,
      this.config
    );
    this.modalReference.hidden.subscribe(() => {
      this.onModalClose();
    });
  }
  formInit() {
    this.lessonPlanningForm = this.formBuilder.group({
      medium: [null, Validators.required],
      subject: [null, Validators.required],
      standard: [null, Validators.required],
      book: ['', [Validators.required, NoSpace()]],
      publication: ['', [Validators.required, NoSpace()]],
      lesson: ['', [Validators.required, NoSpace()]],
      no_of_lectures: [null, [Validators.required]],
      from_date: ['', [Validators.required, NoSpace()]],
      to_date: ['', [Validators.required, NoSpace()]],
      status: ['true', Validators.required],
    });
  }
  get form() {
    return this.lessonPlanningForm.controls;
  }

  onDateChange(i: any) {
    this.maxDate = this.lessonPlanningForm.value.lessons[i].from_date;
  }

  onCalenderClick(i: any) {
    this.maxDate = this.lessonPlanningForm.value.lessons[i].from_date;
  }

  async onSubmit() {
    try {
      this.isSubmitted = true;
      if (this.lessonPlanningForm.invalid) {
        return;
      }
      this.utils.showLoading();
      let obj;
      if (this.EditId) {
        obj = {
          isActive:
            this.lessonPlanningForm.controls['status'].value == 'true'
              ? true
              : false,
          medium_id: this.mediumId,
          subject_id: this.subjectId,
          standard_id: this.standardId,
          book_name: this.lessonPlanningForm.controls['book'].value,
          publication_name:
            this.lessonPlanningForm.controls['publication'].value,
          lesson: this.lessonPlanningForm.controls['lesson'].value,
          no_of_lecture:
            this.lessonPlanningForm.controls['no_of_lectures'].value,
          form_date: this.lessonPlanningForm.controls['from_date'].value,
          to_date: this.lessonPlanningForm.controls['to_date'].value,
        };
      }
      this.EditId ? (obj['id'] = this.EditId) : '';
      const response: any = await this.apiService.addSubjectWiseLessonPlanning(
        obj
      );
      this.utils.hideLoading();
      if (response.statusCode === 200) {
        this.utils.showSuccessToast(response.message);
        this.onModalClose();
        this.getSubjectWiseLessonPlanningList();
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
  async editSubjectWiseLessonPlanning(listId) {
    this.EditId = listId;
    const queryList = `?id=${listId}`;
    this.onModalOpen();
    const response: any =
      await this.apiService.getSubjectWiseLessonPlanningList(queryList);
    if ((response.statusCode = 200)) {
      this.mediumId = response.data.result[0].medium_id;
      this.getStandardList();
      this.subjectId = response.data.result[0].subject_id;
      this.standardId = response.data.result[0].standard_id;
      this.lessonPlanningForm.controls['medium'].setValue(
        response.data.result[0].medium_name
      );
      this.lessonPlanningForm.controls['subject'].setValue(
        response.data.result[0].subject_name
      );
      this.lessonPlanningForm.controls['standard'].setValue(
        response.data.result[0].standard_name
      );
      this.lessonPlanningForm.controls['book'].setValue(
        response.data.result[0].book_name
      );
      this.lessonPlanningForm.controls['publication'].setValue(
        response.data.result[0].publication_name
      );
      this.lessonPlanningForm.controls['lesson'].setValue(
        response.data.result[0].lesson
      );
      this.lessonPlanningForm.controls['from_date'].setValue(
        moment(response.data.result[0].from_date).format('YYYY-MM-DD')
      );
      this.lessonPlanningForm.controls['to_date'].setValue(
        moment(response.data.result[0].to_date).format('YYYY-MM-DD')
      );
      this.lessonPlanningForm.controls['no_of_lectures'].setValue(
        Number(response.data.result[0].no_of_lecture)
      );
    }
    this.getSubjectList();
  }

  deleteSubjectWiseLessonPlanning(id) {
    Swal.fire({
      icon: 'warning',
      title: 'Are you sure?',
      text: 'You will not be able to recover Subject Wise Leasson Planning!',
      showCancelButton: true,
      confirmButtonText: 'Yes, delete it!',
      confirmButtonColor: '#6259ca',
      cancelButtonText: 'No, cancel it!',
      cancelButtonColor: '#6259ca',
      reverseButtons: true,
    }).then(async (result: any) => {
      if (result.isConfirmed) {
        const response: any =
          await this.apiService.deleteSubjectWiseLessonPlanning(id);
        if ((response.statusCode = 200)) {
          Swal.fire({
            title: 'Deleted!',
            text: 'Your Subject Wise Leasson Planning been deleted.',
            icon: 'success',
            confirmButtonColor: '#6259ca',
          });
          await this.getSubjectWiseLessonPlanningList();
        }
      } else if (result.dismiss === Swal.DismissReason.cancel) {
        Swal.fire({
          title: 'Cancelled!',
          text: 'Your Subject Wise Leasson Planning is safe :)',
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
    this.getSubjectWiseLessonPlanningList();
  }

  subject(event) {
    if (event) {
      this.subjectId = +event;
    }
  }

  medium(event) {
    if (event) {
      this.lessonPlanningForm.controls['standard'].setValue(null);
      this.lessonPlanningForm.controls['subject'].setValue(null);

      this.mediumId = +event;
      this.getStandardList();
    }
  }

  standard(event) {
    if (event) {
      this.lessonPlanningForm.controls['subject'].setValue(null);

      this.standardId = +event;
      this.getSubjectList();
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
    const queryList = `?skip_pagination=${true}&medium_id=${
      this.mediumId
    }&standard_id=${this.standardId} `;
    const response: any = await this.apiService.getSubjectAssignmentList(
      queryList
    );
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
  async drop(event: CdkDragDrop<any[]>) {
    try {
      moveItemInArray(
        this.subjectAssignmentRep,
        event.previousIndex,
        event.currentIndex
      );
      let data: any = [];
      this.subjectAssignmentRep.forEach((element, index) => {
        let json = {
          id: element.id,
          sequence: index + 1,
        };
        data.push(json);
      });

      let json = {
        lesson_planning_ids: data,
      };
      const response: any = await this.apiService.addSubjectWiseLessonSequence(
        json
      );
      if ((response.statusCode = 200)) {
        this.getSubjectList();
        this.utils.showSuccessToast(response.message);
      }
    } catch (error) {
      this.utils.hideLoading();
    }
  }

  async exportAll(exportType) {
    const data: any = [];
    const headerRow = [
      'Medium',
      'Standard',
      'Subject',
      'Book Name',
      'Publication Name ',
      'Chapter',
      'No Of Lectures',
      'From Date',
      'To Date',
      'Status',
    ];
    if (exportType != 'pdf') {
      data.push(headerRow);
    }
    const arr: any = await this.getSubjectWiseLessonPlanningList(true);
    for (const item of arr) {
      const rowData = [
        item.medium_name || '-',
        item.standard_name || '-',
        item.subject_name || '-',
        item.book_name || '-',
        item.publication_name || '-',
        item.lesson || '-',
        item.no_of_lecture || '-',
        moment(item.from_date).format('YYYY-MM-DD hh:mm A') || '-',
        moment(item.to_date).format('YYYY-MM-DD hh:mm A') || '-',
        item.is_active ? 'Active' : 'In Active' || '-',
      ];
      data.push(rowData);
    }
    this.exportService.exportData(
      exportType,
      headerRow,
      data,
      `Exported Subject Wise Chapter Planning List${moment().format(
        'YYYY-MM-DD'
      )}`
    );
  }
  async getStandardList() {
    let queryList = this.mediumId;
    const response: any = await this.apiService.getStandardListById(queryList);
    if (response.statusCode === 200) {
      this.standardList = response.data.result;
    }
  }
}
