import { Component } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { Constants } from 'src/app/Constants/constants';
import { ApiService } from 'src/app/services/api.service';
import { UtilityService } from 'src/app/services/utility.service';
import { BsDatepickerViewMode } from 'ngx-bootstrap/datepicker';
import { Router } from '@angular/router';
@Component({
  selector: 'app-add-process-lo-wise-subject-material',
  templateUrl: './add-process-lo-wise-subject-material.component.html',
  styleUrls: ['./add-process-lo-wise-subject-material.component.scss'],
})
export class AddProcessLoWiseSubjectMaterialComponent {
  subjectMaterialForm!: FormGroup;
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
  lessonList: any;
  lessonId: any;
  topicList: any;
  getTopicId: any;
  loList: any;
  loListLevel: any;
  SubjectMaterialList: any;
  getloId: any;
  getLoLevel: any;
  getSubjectMaterialId: any;

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
    this.getLOLevelList();
    this.getSubjectMaterialType();
  }

  onPageChange = async (page: any) => {
    this.currentPage = page;
  };

  formInit() {
    this.subjectMaterialForm = this.formBuilder.group({
      medium_id: [null, Validators.required],
      subject_id: [null, Validators.required],
      standard_id: [null, Validators.required],
      lesson_id: [null, Validators.required],
      materials: this.formBuilder.array([]),
      material_status: ['true', Validators.required],
      status: ['true', Validators.required],
    });
  }

  get form() {
    return this.subjectMaterialForm.controls;
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
      topic_id: ['', [Validators.required]],
      lo_id: [null, Validators.required],
      lo_level_id: ['', [Validators.required]],
      subject_material_type_id: ['', [Validators.required]],
      material_status: ['true', Validators.required],
    });
  }

  removeLesson(i: any) {
    this.lessons().removeAt(i);
  }

  lessons(): FormArray {
    return this.subjectMaterialForm.controls['materials'] as FormArray;
  }

  async onSubmit() {
    try {
      this.isSubmitted = true;
      if (this.subjectMaterialForm.invalid) {
        return;
      }
      this.utils.showLoading();
      let obj = {
        isActive:
          this.subjectMaterialForm.controls['status'].value == 'true'
            ? true
            : false,
        material_status:
          this.subjectMaterialForm.controls['material_status'].value,
        medium_id: this.mediumId,
        subject_id: this.subjectId,
        standard_id: this.standardId,
        lesson_id: this.lessonId,

        materials: this.subjectMaterialForm.value.materials,
      };

      const response: any = await this.apiService.addMaterial(obj);

      this.utils.hideLoading();
      if (response.statusCode === 200) {
        this.utils.showSuccessToast(response.message);
        this.router.navigate(['/admin/medium-and-subject-wise']);
      }
    } catch (error) {
      this.utils.hideLoading();
    }
  }

  subject(event) {
    if (event) {
      this.subjectMaterialForm.controls['lesson_id'].setValue(null);
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
  lessonIdList(event) {
    if (event) {
      this.lessonId = +event;
      this.getTopicList(this.lessonId);
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
  topicId(event) {
    if (event) {
      this.getTopicId = +event;
      this.getTopicWiseLOList(this.getTopicId);
    }
  }
  loId(event) {
    if (event) {
      this.getloId = event;
    }
  }
  loLevel(event) {
    if (event) {
      this.getLoLevel = event;
    }
  }
  subjectMaterialId(event) {
    if (event) {
      this.getSubjectMaterialId = event;
    }
  }

  async getTopicList(id: any) {
    const queryList = `?id=${id}&skip_pagination=${true}&sort=DESC`;
    const response: any = await this.apiService.getTopicList(queryList);
    if (response.statusCode === 200) {
      this.topicList = response.data.result;
    }
  }
  async getTopicWiseLOList(id: any) {
    const queryList = `?topic_id=${id}&skip_pagination=${true}&sort=DESC`;
    const response: any = await this.apiService.getTopicWiseLOList(queryList);
    if (response.statusCode === 200) {
      this.loList = response.data.result;
    }
  }
  async getLOLevelList() {
    const queryList = `?skip_pagination=${true}&sort=DESC`;
    const response: any = await this.apiService.getLOLevelList(queryList);
    if (response.statusCode === 200) {
      this.loListLevel = response.data.result;
    }
  }
  async getSubjectMaterialType() {
    const queryList = `?skip_pagination=${true}&sort=DESC`;
    const response: any = await this.apiService.getSubjectMaterialType(
      queryList
    );
    if (response.statusCode === 200) {
      this.SubjectMaterialList = response.data.result;
    }
  }
}
