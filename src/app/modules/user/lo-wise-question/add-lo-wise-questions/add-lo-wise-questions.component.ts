import { Component, TemplateRef, ViewChild } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import {
  NgbModal,
  NgbModalRef,
} from '@ng-bootstrap/ng-bootstrap';
import { Constants } from 'src/app/Constants/constants';
import { ApiService } from 'src/app/services/api.service';
import { UtilityService } from 'src/app/services/utility.service';
import { Router } from '@angular/router';
import AngularEditor from './../../../../../../ckeditor/build/ckeditor';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';

@Component({
  selector: 'app-add-lo-wise-questions',
  templateUrl: './add-lo-wise-questions.component.html',
  styleUrls: ['./add-lo-wise-questions.component.scss']
})
export class AddLoWiseQuestionsComponent {
  questionsForm!: FormGroup;
  addQuestionsForm!: FormGroup;
  modalReference: NgbModalRef;
  pageLimit = Constants.PAGE_LIMIT;
  currentPage = Constants.STARTING_PAGE;
  eventModalRef: BsModalRef;
  @ViewChild('SubjectCategory') SubjectCategory: TemplateRef<any>;
  subjectAssignmentRep: any = [];
  isSubmitted = false;
  addQuestionsSubmitted = false;
  mediumId: any;
  subjectId: any;
  standardId: any;
  lessonId: any;
  topicId: any;
  subTopicId: any;
  difficultyLevelId: any;
  questionTypeId: any;
  mediumList: any;
  subjectList: any;
  standardList: any;
  lessonList: any;
  topicList: any;
  subTopicList: any;
  loList: any;
  questionTypeList: any;
  difficultyLevelList: any;
  topicLength: any = 0;
  editorData = 'DemoCK';
  public Editor: any = AngularEditor;
  EditId: any;

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
    private modalService: BsModalService,
    private modalRef: BsModalRef
  ) {
    this.formInit();
  }

  async ngOnInit() {
    this.getMediumList();
    this.getSubjectList();
    this.getStandardList();
    this.getTopicList();
  }

  onPageChange = async (page: any) => {
    this.currentPage = page;
  };

  onModalOpen(template: TemplateRef<any>) {
    const initialState = { class: 'small-modal-xl' };
    this.eventModalRef = this.modalService.show(template, initialState);
    this.getQuestionTypeList();
    this.getDifficultyLevelList();
    this.addQuestionsForm.reset();
    this.addQuestionsSubmitted = false;
    // this.formInit();
    // this.modalReference = this.modalService.open(this.SubjectCategory, this.config);
    // this.modalReference.hidden.subscribe(() => {
    //   this.onModalClose();
    // });
  }

  onModalClose() {
    this.eventModalRef?.hide();
    this.isSubmitted = false;
    this.addQuestionsSubmitted = false;
  }

  formInit() {
    this.questionsForm = this.formBuilder.group({
      medium: [null, Validators.required],
      subject: [null, Validators.required],
      standard: [null, Validators.required],
      lesson: [null, Validators.required],
      topics: this.formBuilder.array([]),
      status: ['true', Validators.required]
    });
  }

  get form() {
    return this.questionsForm.controls;
  }

  get addQuestionsform() {
    return this.addQuestionsForm.controls;
  }

  getTopicsControl() {
    return (this.questionsForm.get('topics') as FormArray).controls
  }

  getControl(i: any) {
    return (this.questionsForm.get('topics.' + i + '.questions') as FormArray).controls;
  }

  topics(): FormArray {
    return this.questionsForm.controls['topics'] as FormArray;
  }

  subtopic(topicIndex: number): FormArray {
    const topics = this.questionsForm.get('topics') as FormArray;
    return topics.at(topicIndex).get('questions') as FormArray;
  }

  createTopicFormGroup() {
    return this.formBuilder.group({
      topic_id: ['', [Validators.required]],
      sub_topic_id: [null],
      lo_level_id: ['', [Validators.required]],
      questions: this.formBuilder.array([])
    });
  }

  createSubtopicFormGroup() {
    return this.formBuilder.group({
      question_type_id: [null],
      difficulty_level_id: [null],
      question: [null],
      choices_A: [null],
      choices_B: [null],
      choices_C: [null],
      choices_D: [null],
      correct_answer: [null],
      marks: [null],
    });
  }

  addQuestionsFormGroup() {
    this.addQuestionsForm = this.formBuilder.group({
      question_type_id: [null, Validators.required],
      difficulty_level_id: [null, Validators.required],
      question: [null, Validators.required],
      choices_A: [null, Validators.required],
      choices_B: [null, Validators.required],
      choices_C: [null, Validators.required],
      choices_D: [null, Validators.required],
      correct_answer: [null, Validators.required],
      marks: [null, Validators.required],
    });
  }

  get formAddQuestions() {
    return this.addQuestionsForm.controls;
  }

  addTopic() {
    const topics = this.questionsForm.get('topics') as FormArray;
    if (this.topics().valid) {
      this.addQuestionsFormGroup();
      topics.push(this.createTopicFormGroup());
    } else {
      this.isSubmitted = true;
    }
  }

  removeTopic(index: number) {
    const topics = this.questionsForm.get('topics') as FormArray;
    topics.removeAt(index);
  }

  testsubtopics: any;
  addQuestion(topicIndex: number) {
    this.onModalOpen(this.SubjectCategory)
    this.testsubtopics = topicIndex;
    // const topics = this.questionsForm.get('topics') as FormArray;
    // const subtopics = topics.at(topicIndex).get('questions') as FormArray;
    // if (this.subtopic(topicIndex).valid) {
    //   subtopics.push(this.createSubtopicFormGroup());
    // } else {
    //   this.isSubmitted = true;
    // }
  }

  removeSubtopic(topicIndex: number, subtopicIndex: number) {
    const topics = this.questionsForm.get('topics') as FormArray;
    const subtopics = topics.at(topicIndex).get('questions') as FormArray;
    subtopics.removeAt(subtopicIndex);
  }

  addQuestions() {
    try {
      const topics = this.questionsForm.get('topics') as FormArray;
      const subtopics = topics.at(this.testsubtopics).get('questions') as FormArray;
      this.addQuestionsSubmitted = true;

      if (this.addQuestionsForm.invalid) {
        return;
      }
      if (this.subtopic(this.testsubtopics).valid) {
        subtopics.push(this.createSubtopicFormGroup());
      } else {
        this.isSubmitted = true;
      }

      this.eventModalRef?.hide();

      let patch = subtopics.controls[subtopics.controls.length - 1];
      patch['controls'].question_type_id.setValue(this.addQuestionsForm.value.question_type_id);
      patch['controls'].difficulty_level_id.setValue(this.addQuestionsForm.value.difficulty_level_id);
      patch['controls'].question.setValue(this.addQuestionsForm.value.question);
      patch['controls'].correct_answer.setValue(this.addQuestionsForm.value.correct_answer);
      patch['controls'].marks.setValue(this.addQuestionsForm.value.marks);
      if (this.questionTypeId === 3) {
        patch['controls'].choices_A.setValue(this.addQuestionsForm.value.choices_A);
        patch['controls'].choices_B.setValue(this.addQuestionsForm.value.choices_B);
        patch['controls'].choices_C.setValue(this.addQuestionsForm.value.choices_C);
        patch['controls'].choices_D.setValue(this.addQuestionsForm.value.choices_D);
      }
    } catch (error) {
      this.utils.hideLoading();
    }
  }

  async onSubmit() {
    try {
      this.isSubmitted = true;
      if (this.questionsForm.invalid) {
        return;
      }
      this.utils.showLoading();
      let obj = {
        isActive: this.questionsForm.controls['status'].value == 'true' ? true : false,
        medium_id: this.mediumId,
        subject_id: this.subjectId,
        standard_id: this.standardId,
        lession_id: this.lessonId,
        lo_wise_questions: this.questionsForm.value.topics
      };
      const response: any = await this.apiService.addQuestion(obj);
      this.utils.hideLoading();
      if (response.statusCode === 200) {
        this.utils.showSuccessToast(response.message);
        this.router.navigate(['/admin/lo-wise-questions']);
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

  topicEvent(event) {
    if (event) {
      this.topicId = +event;
      this.getSubTopicList(this.topicId);
    }
  }

  subTopicEvent(event) {
    if (event) {
      this.subTopicId = +event;
      this.getLOLevelList(this.subTopicId, 2);
    }
  }

  difficultyLevel(event) {
    if (event) {
      this.difficultyLevelId = +event;
    }
  }

  questionType(event) {
    if (event) {
      this.questionTypeId = +event;
      if (this.questionTypeId === 5) {
        this.addQuestionsForm.controls['choices_A'].disable();
        this.addQuestionsForm.controls['choices_B'].disable();
        this.addQuestionsForm.controls['choices_C'].disable();
        this.addQuestionsForm.controls['choices_D'].disable();
      } else {
        this.addQuestionsForm.controls['choices_A'].enable();
        this.addQuestionsForm.controls['choices_B'].enable();
        this.addQuestionsForm.controls['choices_C'].enable();
        this.addQuestionsForm.controls['choices_D'].enable();
      }
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
    const response: any = await this.apiService.getSubjectWiseLessonPlanningList(queryList);
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
    const response: any = await this.apiService.getLessonWiseTopicSubtopicList(queryList);
    if (response.statusCode === 200) {
      this.subTopicList = response.data.result;
      if (this.subTopicList.length === 0) {
        this.getLOLevelList(id, 1);
      }
    }
  }

  async getLOLevelList(id: any, type: any) {
    let queryList;
    if (type === 1) {
      queryList = `?topic_id=${id}&skip_pagination=${true}&sort=DESC`;
    } else {
      queryList = `?sub_topic_id=${id}&skip_pagination=${true}&sort=DESC`;
    }
    const response: any = await this.apiService.getTopicWiseLOList(queryList);
    if (response.statusCode === 200) {
      this.loList = response.data.result;
    }
  }

  async getQuestionTypeList() {
    const queryList = `?skip_pagination=${true}&sort=DESC`;
    const response: any = await this.apiService.getQuestionTypeMasterList(queryList);
    if (response.statusCode === 200) {
      this.questionTypeList = response.data.result;
    }
  }

  async getDifficultyLevelList() {
    const queryList = `?skip_pagination=${true}&sort=DESC`;
    const response: any = await this.apiService.getQuestionTypeDifficultyMasterList(queryList);
    if (response.statusCode === 200) {
      this.difficultyLevelList = response.data.result;
    }
  }
}
