import { Component } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { Constants } from 'src/app/Constants/constants';
import { ApiService } from 'src/app/services/api.service';
import { UtilityService } from 'src/app/services/utility.service';
import { BsDatepickerViewMode } from 'ngx-bootstrap/datepicker';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-add-sub-topic',
  templateUrl: './add-sub-topic.component.html',
  styleUrls: ['./add-sub-topic.component.scss']
})
export class AddSubTopicComponent {
  subTopicForm!: FormGroup;
  modalReference: NgbModalRef;
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
  topicId: any;

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
    private router: Router,
    private route: ActivatedRoute
  ) {
    this.formInit();
  }

  async ngOnInit() {
    this.getMediumList();
    this.getSubjectList();
    this.getStandardList();
    this.route.queryParamMap.subscribe((params) => {
      if (params) {
        const topicIdParam = params.get('topic_id');
        if (topicIdParam !== null) {
          this.topicId = +topicIdParam;
          this.addSubtopics();
        }
      }
    });
  }

  async addSubtopics() {
    const queryList = `?topicId=${this.topicId}`;
    const response: any = await this.apiService.getLessonWiseTopicSubtopicList(queryList);
    if ((response.statusCode = 200)) {
      this.mediumId = response.data.result[0].medium_id;
      this.subjectId = response.data.result[0].subject_id;
      this.standardId = response.data.result[0].standard_id;
      this.lessonId = response.data.result[0].lesson_id;
      this.subTopicForm.controls['medium'].setValue(response.data.result[0].medium_name);
      this.subTopicForm.controls['subject'].setValue(response.data.result[0].subject_name);
      this.subTopicForm.controls['standard'].setValue(response.data.result[0].standard_name);
      this.subTopicForm.controls['lesson'].setValue(response.data.result[0].lesson_name);
      this.subTopicForm.controls['name'].setValue(response.data.result[0].topic_name);
      this.subTopicForm.controls['version_no'].setValue(response.data.result[0].topic_version_no);
    }
  }

  formInit() {
    this.subTopicForm = this.formBuilder.group({
      name: ['', Validators.required],
      version_no: ['', Validators.required],
      medium: [null, Validators.required],
      subject: [null, Validators.required],
      standard: [null, Validators.required],
      lesson: [null, Validators.required],
      subtopics: this.formBuilder.array([]),
    });
  }

  get form() {
    return this.subTopicForm.controls;
  }

  getSubTopicsControl() {
    return (this.subTopicForm.get('subtopics') as FormArray).controls
  }

  subtopics(): FormArray {
    return this.subTopicForm.controls['subtopics'] as FormArray;
  }

  createSubTopicFormGroup() {
    return this.formBuilder.group({
      name: ['', Validators.required],
      version_no: [null, Validators.required],
    });
  }

  addSubTopic() {
    const topics = this.subTopicForm.get('subtopics') as FormArray;
    if (this.subtopics().valid) {
      topics.push(this.createSubTopicFormGroup());
    } else {
      this.isSubmitted = true;
    }
  }

  removeSubTopic(index: number) {
    const subtopics = this.subTopicForm.get('subtopics') as FormArray;
    subtopics.removeAt(index);
  }

  async onSubmit() {
    try {
      this.isSubmitted = true;
      if (this.subTopicForm.invalid) {
        return;
      }
      this.utils.showLoading();
      let obj = {
        id: this.topicId,
        sub_topics: this.subTopicForm.value.subtopics
      };
      const response: any = await this.apiService.addTopicWiseSubtopic(obj);
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
      this.getLessonList(this.subjectId)
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

  getMediumList() {
    const queryList = `?skip_pagination=${true}&sort=DESC`;
    const response: any = this.apiService.getMediumList(queryList);
    if (response.statusCode === 200) {
      this.mediumList = response.data.result;
    }
  }

  getSubjectList() {
    this.utils.showLoading();
    const queryList = `?skip_pagination=${true}&sort=DESC&isActive=true`;
    const response: any = this.apiService.getSubjectList(queryList);
    if (response.statusCode === 200) {
      this.subjectList = response.data.result;
    }
    this.utils.hideLoading();
  }

  getStandardList() {
    const queryList = `?skip_pagination=${true}&sort=DESC`;
    const response: any = this.apiService.getStandardList(queryList);
    if (response.statusCode === 200) {
      this.standardList = response.data.result;
    }
  }

  getLessonList(id: any) {
    const queryList = `?subject_id=${id}&skip_pagination=${true}&sort=DESC`;
    const response: any = this.apiService.getSubjectWiseLessonPlanningList(queryList);
    if (response.statusCode === 200) {
      this.lessonList = response.data.result;
    }
  }

}
