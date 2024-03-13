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
  selector: 'app-add-lesson-planning',
  templateUrl: './add-lesson-planning.component.html',
  styleUrls: ['./add-lesson-planning.component.scss'],
})
export class AddLessonPlanningComponent {
  lessonPlanningForm!: FormGroup;
  modalReference: NgbModalRef;
  pageLimit = Constants.PAGE_LIMIT;
  currentPage = Constants.STARTING_PAGE;
  subjectAssignmentRep: any = [];
  isSubmitted = false;
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
    private formBuilder: FormBuilder,
    private apiService: ApiService,
    private utils: UtilityService,
    private router: Router
  ) {}

  async ngOnInit() {
    this.formInit();
    this.getMediumList();
    // this.getSubjectList();
    // this.getStandardList();
  }

  onPageChange = async (page: any) => {
    this.currentPage = page;
  };

  formInit() {
    this.lessonPlanningForm = this.formBuilder.group({
      medium: [null, Validators.required],
      subject: [null, Validators.required],
      standard: [null, Validators.required],
      book: ['', [Validators.required, NoSpace()]],
      publication: ['', [Validators.required, NoSpace()]],
      lessons: this.formBuilder.array([]),
      status: ['true', Validators.required],
    });
  }

  get form() {
    return this.lessonPlanningForm.controls;
  }

  addLesson() {
    if (this.lessons().valid) {
      this.lessons().push(this.createLesson());
    } else {
      this.isSubmitted = true;
    }
  }

  createLesson() {
    return this.formBuilder.group({
      lesson: ['', [Validators.required, NoSpace()]],
      no_of_lecture: [null, Validators.required],
      from_date: ['', [Validators.required, NoSpace()]],
      to_date: ['', [Validators.required, NoSpace()]],
      isActive: ['true', Validators.required],
    });
  }

  removeLesson(i: any) {
    this.lessons().removeAt(i);
  }

  lessons(): FormArray {
    return this.lessonPlanningForm.controls['lessons'] as FormArray;
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
      let obj = {
        // isActive: this.lessonPlanningForm.controls['status'].value == 'true' ? true : false,
        medium_id: this.mediumId,
        subject_id: this.subjectId,
        standard_id: this.standardId,
        book_name: this.lessonPlanningForm.controls['book'].value,
        publication_name: this.lessonPlanningForm.controls['publication'].value,
        lessons: this.lessonPlanningForm.value.lessons,
      };
      const response: any = await this.apiService.addSubjectWiseLessonPlanning(
        obj
      );
      this.utils.hideLoading();
      if (response.statusCode === 200) {
        this.utils.showSuccessToast(response.message);
        this.router.navigate(['/admin/subject-wise-lesson-planning']);
      }
    } catch (error) {
      this.utils.hideLoading();
    }
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
  async getStandardList() {
    let queryList = this.mediumId;
    const response: any = await this.apiService.getStandardListById(queryList);
    if (response.statusCode === 200) {
      this.standardList = response.data.result;
    }
  }
}
