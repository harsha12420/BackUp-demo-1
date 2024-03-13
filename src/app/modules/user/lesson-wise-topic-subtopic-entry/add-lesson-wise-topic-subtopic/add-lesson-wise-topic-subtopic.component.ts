import { Component } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { Constants } from 'src/app/Constants/constants';
import { ApiService } from 'src/app/services/api.service';
import { UtilityService } from 'src/app/services/utility.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-add-lesson-wise-topic-subtopic',
  templateUrl: './add-lesson-wise-topic-subtopic.component.html',
  styleUrls: ['./add-lesson-wise-topic-subtopic.component.scss'],
})
export class AddLessonWiseTopicSubtopicComponent {
  lessonPlanningForm!: FormGroup;
  modalReference: NgbModalRef;
  pageLimit = Constants.PAGE_LIMIT;
  currentPage = Constants.STARTING_PAGE;
  subjectAssignmentRep: any = [];
  isSubmitted = false;
  mediumId: any;
  subjectId: any;
  standardId: any;
  lessonId: any;
  mediumList: any;
  subjectList: any;
  standardList: any;
  lessonList: any;
  topicLength: any = 0;

  config = {
    backdrop: true,
    ignoreBackdropClick: true,
    class: 'modal-md',
    centered: true,
    modalDialogClass: 'modal-xl',
  };
  constructor(
    private formBuilder: FormBuilder,
    private apiService: ApiService,
    private utils: UtilityService,
    private router: Router
  ) {
    this.formInit();
  }

  async ngOnInit() {
    this.getMediumList();
    this.getSubjectList();
    this.getStandardList();
  }

  onPageChange = async (page: any) => {
    this.currentPage = page;
  };

  formInit() {
    this.lessonPlanningForm = this.formBuilder.group({
      medium: [null, Validators.required],
      subject: [null, Validators.required],
      standard: [null, Validators.required],
      lesson: [null, Validators.required],
      topics: this.formBuilder.array([]),
      status: ['true', Validators.required],
    });
  }

  get form() {
    return this.lessonPlanningForm.controls;
  }

  getTopicsControl() {
    return (this.lessonPlanningForm.get('topics') as FormArray).controls;
  }

  getControl(i: any) {
    return (
      this.lessonPlanningForm.get('topics.' + i + '.sub_topics') as FormArray
    ).controls;
  }

  topics(): FormArray {
    return this.lessonPlanningForm.controls['topics'] as FormArray;
  }

  subtopic(topicIndex: number): FormArray {
    const topics = this.lessonPlanningForm.get('topics') as FormArray;
    return topics.at(topicIndex).get('sub_topics') as FormArray;
  }

  createTopicFormGroup() {
    return this.formBuilder.group({
      name: ['', Validators.required],
      version_no: [null, Validators.required],
      sub_topics: this.formBuilder.array([]),
    });
  }

  createSubtopicFormGroup() {
    return this.formBuilder.group({
      name: ['', Validators.required],
      version_no: [null, Validators.required],
    });
  }

  addTopic() {
    const topics = this.lessonPlanningForm.get('topics') as FormArray;
    if (this.topics().valid) {
      topics.push(this.createTopicFormGroup());
    } else {
      this.isSubmitted = true;
    }
  }

  removeTopic(index: number) {
    const topics = this.lessonPlanningForm.get('topics') as FormArray;
    topics.removeAt(index);
  }

  addSubtopic(topicIndex: number) {
    const topics = this.lessonPlanningForm.get('topics') as FormArray;
    const subtopics = topics.at(topicIndex).get('sub_topics') as FormArray;
    if (this.subtopic(topicIndex).valid) {
      subtopics.push(this.createSubtopicFormGroup());
    } else {
      this.isSubmitted = true;
    }
  }

  removeSubtopic(topicIndex: number, subtopicIndex: number) {
    const topics = this.lessonPlanningForm.get('topics') as FormArray;
    const subtopics = topics.at(topicIndex).get('sub_topics') as FormArray;
    subtopics.removeAt(subtopicIndex);
  }

  async onSubmit() {
    try {
      this.isSubmitted = true;
      if (this.lessonPlanningForm.invalid) {
        return;
      }
      this.utils.showLoading();
      let obj = {
        isActive:
          this.lessonPlanningForm.controls['status'].value == 'true'
            ? true
            : false,
        medium_id: this.mediumId,
        subject_id: this.subjectId,
        standard_id: this.standardId,
        lesson_id: this.lessonId,
        topics: this.lessonPlanningForm.value.topics,
      };
      const response: any = await this.apiService.addLessonWiseTopicSubtopic(
        obj
      );
      this.utils.hideLoading();
      if (response.statusCode === 200) {
        this.utils.showSuccessToast(response.message);
        this.router.navigate(['/admin/lesson-wise-topic-subtopic-entry']);
      }
    } catch (error) {
      this.utils.hideLoading();
    }
  }

  subject(event) {
    if (event) {
      this.subjectId = +event;
      this.getLessonList(this.subjectId);
    }
  }

  medium(event) {
    if (event) {
      this.mediumId = +event;
    }
  }

  standard(event) {
    if (event) {
      this.standardId = +event;
    }
  }

  lesson(event) {
    if (event) {
      this.lessonId = +event;
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

  async getStandardList() {
    const queryList = `?skip_pagination=${true}&sort=DESC`;
    const response: any = await this.apiService.getStandardList(queryList);
    if (response.statusCode === 200) {
      this.standardList = response.data.result;
    }
  }

  async getLessonList(id: any) {
    const queryList = `?subject_id=${id}&skip_pagination=${true}&sort=DESC`;
    const response: any =
      await this.apiService.getSubjectWiseLessonPlanningList(queryList);
    if (response.statusCode === 200) {
      this.lessonList = response.data.result;
    }
  }
}
