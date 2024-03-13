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

@Component({
  selector: 'app-lesson-wise-topic-subtopic',
  templateUrl: './lesson-wise-topic-subtopic.component.html',
  styleUrls: ['./lesson-wise-topic-subtopic.component.scss']
})
export class LessonWiseTopicSubtopicComponent {
  dropdownStates: boolean[] = [];
  editTopicSubTopicForm: FormGroup;
  modalReference: NgbModalRef;
  pageLimit = Constants.PAGE_LIMIT;
  currentPage = Constants.STARTING_PAGE;
  find = '';
  totalItems: number;
  subjectAssignmentRep: any = [];
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
  ) {
    this.dropdownStates = new Array(this.subjectAssignmentRep.length).fill(false);
  }

  // isDropdownOpen: boolean = false;

  // toggleDropdown() {
  //   this.isDropdownOpen = !this.isDropdownOpen;
  // }

  toggleDropdown(index: number) {
    // Toggle the dropdown state for the clicked row
    this.dropdownStates[index] = !this.dropdownStates[index];
  }


  async ngOnInit() {
    await this.getLessonWiseTopicSubtopicList();
  }

  formInit() {
    this.editTopicSubTopicForm = this.formBuilder.group({
      name: [null, Validators.required],
      version_no: [null, Validators.required],
      lesson: [null, [Validators.required]]
    });
  }

  async getLessonWiseTopicSubtopicList() {
    this.utils.showLoading();
    const queryList = `?search=${this.searchString}&sort=${this.sort}&orderby=${this.orderBy}`;
    const response: any = await this.apiService.getLessonWiseTopicSubtopicList(queryList);
    if (response.statusCode === 200) {
      this.subjectAssignmentRep = response.data.result;
      this.totalItems = response.data.totalCount;
    }
    this.utils.hideLoading();
  }

  onPageChange = async (page: any) => {
    this.currentPage = page;
    this.getLessonWiseTopicSubtopicList();
  };

  addLessonWiseTopicSubTopic() {
    this.router.navigate(['/admin/lesson-wise-topic-subtopic-entry/add-lesson-planning']);
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
        this.getLessonWiseTopicSubtopicList();
      }
    } catch (error) {
      this.utils.hideLoading();
    }
  }

  async editLessonWiseTopicSubTopic(listId: any, type: any) {
    this.editTopicSubTopic = type;
    this.EditId = listId;
    const queryList = `?id=${listId}`;
    this.onModalOpen();
    const response: any = await this.apiService.getLessonWiseTopicSubtopicList(queryList);
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

  deleteLessonWiseTopicSubTopic(id: any, type: any) {
    let message = (type === 1) ? 'Topic' : 'Sub Topic';
    Swal.fire({
      icon: 'warning',
      title: 'Are you sure?',
      text: `You will not be able to recover Lesson ${message}!`,
      showCancelButton: true,
      confirmButtonText: 'Yes, delete it!',
      confirmButtonColor: '#6259ca',
      cancelButtonText: 'No, cancel it!',
      cancelButtonColor: '#6259ca',
      reverseButtons: true,
    }).then(async (result: any) => {
      if (result.isConfirmed) {
        let response: any;
        if (type === 1) {
          response = await this.apiService.deleteLessonWiseTopic(id);
        } else {
          response = await this.apiService.deleteLessonWiseSubtopic(id);
        }
        if ((response.statusCode = 200)) {
          Swal.fire({
            title: 'Deleted!',
            text: `Your Lesson ${message} has been deleted.`,
            icon: 'success',
            confirmButtonColor: '#6259ca',
          });
          await this.getLessonWiseTopicSubtopicList();
        }
      } else if (result.dismiss === Swal.DismissReason.cancel) {
        Swal.fire({
          title: 'Cancelled!',
          text: `Your Lesson ${message} is safe :)`,
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
    this.getLessonWiseTopicSubtopicList();
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
