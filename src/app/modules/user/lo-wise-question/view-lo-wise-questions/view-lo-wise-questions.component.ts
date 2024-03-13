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
import { BsDatepickerViewMode } from 'ngx-bootstrap/datepicker';
import Swal from 'sweetalert2';
import { Router } from '@angular/router';
import AngularEditor from './../../../../../../ckeditor/build/ckeditor';

@Component({
  selector: 'app-view-lo-wise-questions',
  templateUrl: './view-lo-wise-questions.component.html',
  styleUrls: ['./view-lo-wise-questions.component.scss']
})
export class ViewLoWiseQuestionsComponent {
  editTopicSubTopicForm: FormGroup;
  modalReference: NgbModalRef;
  pageLimit = Constants.PAGE_LIMIT;
  currentPage = Constants.STARTING_PAGE;
  find = '';
  totalItems: number;
  questionsRep: any = [];
  @ViewChild('LessonPlanning', { static: false })
  LessonPlanning: TemplateRef<any>;
  isSubmitted = false;
  isEditSubTopicSubmitted = false;
  model1!: NgbDateStruct;
  EditId: any;
  searchString = '';
  orderBy: any = 'created_at';
  sort = 'DESC';
  isAscending = false;
  lessonId: any;
  lessonList: any;
  editTopicSubTopic: any;
  public Editor: any = AngularEditor;

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
    private router: Router
  ) { }

  isDropdownOpen: boolean = false;

  toggleDropdown() {
    this.isDropdownOpen = !this.isDropdownOpen;
  }

  async ngOnInit() {
    await this.getQuestions();
  }

  formInit() {
    this.editTopicSubTopicForm = this.formBuilder.group({
      name: [null, Validators.required],
      version_no: [null, Validators.required],
      lesson: [null, [Validators.required]]
    });
  }

  async getQuestions() {
    this.utils.showLoading();
    const queryList = `?search=${this.searchString}&sort=${this.sort}&orderby=${this.orderBy}`;
    const response: any = await this.apiService.getQuestions(queryList);
    if (response.statusCode === 200) {
      this.questionsRep = response.data.result;
      this.totalItems = response.data.totalCount;
    }
    this.utils.hideLoading();
  }

  onPageChange = async (page: any) => {
    this.currentPage = page;
    this.getQuestions();
  };

  addLessonWiseTopicSubTopic() {
    this.router.navigate(['/admin/subject_planning/add_lo_wise_question']);
  }

  onModalOpen() {
    this.formInit();
    this.modalReference = this.modalService.open(this.LessonPlanning, this.config);
    this.modalReference.hidden.subscribe(() => {
      this.onModalClose();
    });
  }

  onModalClose() {
    this.isSubmitted = false;
    this.EditId = null;
    this.modalReference.close();
  }

  get editForm() {
    return this.editTopicSubTopicForm.controls;
  }

  async onSubmit() {
    try {
      this.isSubmitted = true;
      if (this.editTopicSubTopicForm.invalid) {
        return;
      }
      this.utils.showLoading();
      let obj;
      if (this.EditId) {
        obj = {
          name: this.editTopicSubTopicForm.controls['name'].value,
          version_no: this.editTopicSubTopicForm.controls['version_no'].value
        };
      }
      this.EditId ? (obj['id'] = this.EditId) : '';
      (this.editTopicSubTopic === 1) ? (obj['lesson_id'] = this.lessonId) : '';
      let response: any;
      if (this.editTopicSubTopic === 1) {
        response = await this.apiService.editLessonWiseTopic(obj);
      } else {
        response = await this.apiService.editLessonWiseSubtopic(obj);
      }
      this.utils.hideLoading();
      if (response.statusCode === 200) {
        this.utils.showSuccessToast(response.message);
        this.onModalClose();
        this.getQuestions();
      }
    } catch (error) {
      this.utils.hideLoading();
    }
  }

  async editQuestion(listId: any, type?: any) {
    this.editTopicSubTopic = type;
    this.EditId = listId;
    const queryList = `?id=${listId}`;
    this.onModalOpen();
    const response: any = await this.apiService.getQuestions(queryList);
    if ((response.statusCode = 200)) {
      this.editTopicSubTopicForm.controls['name'].setValue((type === 1) ? response.data.result[0].topic_name : response.data.result[0].name);
      this.editTopicSubTopicForm.controls['version_no'].setValue((type === 1) ? response.data.result[0].topic_version_no : response.data.result[0].version_no);
      if (type === 1) {
        this.getLessonList(response.data.result[0].subject_id);
        this.lessonId = response.data.result[0].lesson_id;
        this.EditId = response.data.result[0].topic_id;
        this.editTopicSubTopicForm.controls['lesson'].setValue(response.data.result[0].lesson_name);
      } else {
        this.editTopicSubTopicForm.controls['lesson'].disable();
      }
    }
  }

  deleteQuestion(id: any) {
    Swal.fire({
      icon: 'warning',
      title: 'Are you sure?',
      text: 'You will not be able to recover Question!',
      showCancelButton: true,
      confirmButtonText: 'Yes, delete it!',
      confirmButtonColor: '#6259ca',
      cancelButtonText: 'No, cancel it!',
      cancelButtonColor: '#6259ca',
      reverseButtons: true,
    }).then(async (result: any) => {
      if (result.isConfirmed) {
        const response: any = await this.apiService.questionDelete(id);
        if ((response.statusCode = 200)) {
          Swal.fire({
            title: 'Deleted!',
            text: 'Your Question has been deleted.',
            icon: 'success',
            confirmButtonColor: '#6259ca',
          });
          await this.getQuestions();
        }
      } else if (result.dismiss === Swal.DismissReason.cancel) {
        Swal.fire({
          title: 'Cancelled!',
          text: 'Your Question is safe :)',
          icon: 'error',
          confirmButtonColor: '#6259ca',
        });
      }
    });
  }

  addSubTopic(id: any) {
    this.router.navigate(['/admin/lesson-wise-topic-subtopic-entry/add-subtopic'], {
      queryParams: { topic_id: id },
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
    this.getQuestions();
  }

  lesson(event) {
    if (event) {
      this.lessonId = +event;
    }
  }

  async getLessonList(id: any) {
    const queryList = `?subject_id=${id}skip_pagination=${true}&sort=DESC`;
    const response: any = await this.apiService.getSubjectWiseLessonPlanningList(queryList);
    if (response.statusCode === 200) {
      this.lessonList = response.data.result;
    }
  }
}
