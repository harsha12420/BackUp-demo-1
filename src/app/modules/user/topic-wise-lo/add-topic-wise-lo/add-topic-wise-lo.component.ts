import { Component } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { Constants } from 'src/app/Constants/constants';
import { ApiService } from 'src/app/services/api.service';
import { UtilityService } from 'src/app/services/utility.service';
import { NoSpace } from 'src/app/shared/validations/no-space.validator';
import { BsDatepickerViewMode } from 'ngx-bootstrap/datepicker';
import { Router } from '@angular/router';

@Component({
  selector: 'app-add-topic-wise-lo',
  templateUrl: './add-topic-wise-lo.component.html',
  styleUrls: ['./add-topic-wise-lo.component.scss'],
})
export class AddTopicWiseLoComponent {
  topicWiseloForm!: FormGroup;
  modalReference: NgbModalRef;
  pageLimit = Constants.PAGE_LIMIT;
  currentPage = Constants.STARTING_PAGE;
  subjectAssignmentRep: any = [];
  isSubmitted = false;
  mediumId: any;
  subjectId: any;
  standardId: any;
  lessonId: any;
  topicId: any;
  mediumList: any;
  subjectList: any;
  standardList: any;
  lessonList: any;
  topicList: any;
  subTopicList: any;
  loList: any;

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
    private formBuilder: FormBuilder,
    private apiService: ApiService,
    private utils: UtilityService,
    private router: Router
  ) {}

  async ngOnInit() {
    this.formInit();
    this.getMediumList();
    this.getSubjectList();
    this.getStandardList();
    this.getTopicList();
    this.getLOLevelList();
  }

  onPageChange = async (page: any) => {
    this.currentPage = page;
  };

  formInit() {
    this.topicWiseloForm = this.formBuilder.group({
      medium: [null, Validators.required],
      subject: [null, Validators.required],
      standard: [null, Validators.required],
      lesson: [null, Validators.required],
      topics: this.formBuilder.array([]),
      status: ['true', Validators.required],
    });
  }

  get form() {
    return this.topicWiseloForm.controls;
  }

  addTopic() {
    if (this.topics().valid) {
      this.topics().push(this.createTopic());
    } else {
      this.isSubmitted = true;
    }
  }

  createTopic() {
    return this.formBuilder.group({
      topic_id: ['', [Validators.required]],
      sub_topic_id: [null],
      lo_level_id: ['', [Validators.required]],
      name: ['', [Validators.required, NoSpace()]],
    });
  }

  removeTopic(i: any) {
    this.topics().removeAt(i);
  }

  topics(): FormArray {
    return this.topicWiseloForm.controls['topics'] as FormArray;
  }

  onDateChange(i: any) {
    this.maxDate = this.topicWiseloForm.value.topics[i].from_date;
  }

  onCalenderClick(i: any) {
    this.maxDate = this.topicWiseloForm.value.topics[i].from_date;
  }

  async onSubmit() {
    try {
      this.isSubmitted = true;
      if (this.topicWiseloForm.invalid) {
        return;
      }
      this.utils.showLoading();
      let obj = {
        isActive:
          this.topicWiseloForm.controls['status'].value == 'true'
            ? true
            : false,
        medium_id: this.mediumId,
        subject_id: this.subjectId,
        standard_id: this.standardId,
        lesson_id: this.lessonId,
        topics: this.topicWiseloForm.value.topics,
      };
      const response: any = await this.apiService.addTopicWiseLO(obj);
      this.utils.hideLoading();
      if (response.statusCode === 200) {
        this.utils.showSuccessToast(response.message);
        this.router.navigate(['/admin/topic-wise-lo']);
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

  topic(event) {
    if (event) {
      this.topicId = +event;
      this.getSubTopicList(this.topicId);
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
    const queryList = `?subject_id=${id}skip_pagination=${true}&sort=DESC`;
    const response: any =
      await this.apiService.getSubjectWiseLessonPlanningList(queryList);
    if (response.statusCode === 200) {
      this.lessonList = response.data.result;
    }
  }

  async getTopicList() {
    const queryList = `?skip_pagination=${true}&sort=DESC`;
    const response: any = await this.apiService.getTopicList(queryList);
    if (response.statusCode === 200) {
      this.topicList = response.data.result;
    }
  }

  async getSubTopicList(id: any) {
    const queryList = `?topicId=${id}`;
    const response: any = await this.apiService.getLessonWiseTopicSubtopicList(
      queryList
    );
    if (response.statusCode === 200) {
      this.subTopicList = response.data.result;
    }
  }

  async getLOLevelList() {
    const queryList = `?skip_pagination=${true}&sort=DESC`;
    const response: any = await this.apiService.getLOLevelList(queryList);
    if (response.statusCode === 200) {
      this.loList = response.data.result;
    }
  }
}
