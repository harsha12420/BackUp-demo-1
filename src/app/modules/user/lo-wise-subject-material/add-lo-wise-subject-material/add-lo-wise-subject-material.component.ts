import { Component, TemplateRef, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
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
import * as moment from 'moment';
import { Router } from '@angular/router';
import { NoSpace } from 'src/app/shared/validations/no-space.validator';
@Component({
  selector: 'app-add-lo-wise-subject-material',
  templateUrl: './add-lo-wise-subject-material.component.html',
  styleUrls: ['./add-lo-wise-subject-material.component.scss'],
})
export class AddLoWiseSubjectMaterialComponent {
  subjectMaterialForm: FormGroup;
  modalReference: NgbModalRef;
  pageLimit = Constants.PAGE_LIMIT;
  currentPage = Constants.STARTING_PAGE;
  find = '';
  totalItems: number;
  subjectMeterialList: any = [];
  @ViewChild('material', { static: false })
  material: TemplateRef<any>;
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
  studentId: any = [];
  mediumList: any;
  subjectList: any;
  standardList: any;
  lessonId: any;
  topicList: any;
  lessonList: any;
  getTopicId: any;
  loList: any;
  getloId: any;
  getLoLevel: any;
  loListLevel: any;

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

  async ngOnInit() {
    await this.getSubjectWiseLessonPlanningMeterialList();
  }

  async getSubjectWiseLessonPlanningMeterialList() {
    this.utils.showLoading();
    const queryList = `?search=${this.searchString}&sort=${this.sort}&orderby=${this.orderBy}`;
    const response: any = await this.apiService.getMaterial(queryList);
    if (response.statusCode === 200) {
      this.subjectMeterialList = response.data.result;
      this.totalItems = response.data.totalCount;
    }
    this.utils.hideLoading();
  }

  onPageChange = async (page: any) => {
    this.currentPage = page;
    this.getSubjectWiseLessonPlanningMeterialList();
  };

  addMaterial() {
    this.router.navigate([
      '/admin/medium-and-subject-wise/add-process-subject-material',
    ]);
  }

  onModalOpen() {
    this.formInit();
    // if (this.EditId) {
    //   this.subjectMaterialForm.controls['status'].disable();
    // }
    this.modalReference = this.modalService.open(this.material, this.config);
    this.modalReference.hidden.subscribe(() => {
      this.onModalClose();
    });
  }
  formInit() {
    this.subjectMaterialForm = this.formBuilder.group({
      medium: [null, Validators.required],
      subject: [null, Validators.required],
      standard: [null, Validators.required],
      lesson_id: [null, Validators.required],
      topic_id: [null, Validators.required],
      lo_id: [null, Validators.required],
      lo_level_id: [null, Validators.required],
      material_status: ['true', Validators.required],
      status: ['true', Validators.required],
    });
  }
  get form() {
    return this.subjectMaterialForm.controls;
  }

  async onSubmit() {
    try {
      this.isSubmitted = true;
      if (this.subjectMaterialForm.invalid) {
        return;
      }
      this.utils.showLoading();
      let obj;
      if (this.EditId) {
        obj = {
          isActive:
            this.subjectMaterialForm.controls['status'].value == 'true'
              ? true
              : false,
          medium_id: this.mediumId,
          subject_id: this.subjectId,
          standard_id: this.standardId,

          material_status:
            this.subjectMaterialForm.controls['material_status'].value,
          lesson_id: this.lessonId,
          topic_id: this.getTopicId,
          lo_id: this.getloId,
          lo_level_id: this.getLoLevel,
        };
      }

      this.EditId ? (obj['id'] = this.EditId) : '';
      const response: any = await this.apiService.addMaterial(obj);
      this.utils.hideLoading();
      if (response.statusCode === 200) {
        this.utils.showSuccessToast(response.message);
        this.onModalClose();
        this.getSubjectWiseLessonPlanningMeterialList();
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
  async editSubjectMaterial(listId) {
    this.EditId = listId;

    const queryList = `?id=${listId}`;
    this.onModalOpen();
    const response: any = await this.apiService.getMaterial(queryList);
    if ((response.statusCode = 200)) {
      this.mediumId = response.data.result[0].medium_id;
      this.subjectId = response.data.result[0].subject_id;
      this.standardId = response.data.result[0].standard_id;
      this.lessonId = response.data.result[0].lesson_id;
      this.getTopicId = response.data.result[0].topic_id;
      this.getloId = response.data.result[0].lo_id;
      this.getLoLevel = response.data.result[0].lo_level_id;

      this.subjectMaterialForm.controls['medium'].setValue(
        response.data.result[0].medium_name
      );
      this.subjectMaterialForm.controls['subject'].setValue(
        response.data.result[0].subject_name
      );
      this.subjectMaterialForm.controls['standard'].setValue(
        response.data.result[0].standard_name
      );
      this.subjectMaterialForm.controls['lesson_id'].setValue(
        response.data.result[0].lesson_name
      );
      this.subjectMaterialForm.controls['topic_id'].setValue(
        response.data.result[0].topic_name
      );
      this.subjectMaterialForm.controls['lo_id'].setValue(
        response.data.result[0].lo_name
      );
      this.subjectMaterialForm.controls['material_status'].setValue(
        response.data.result[0].material_status
      );
      this.subjectMaterialForm.controls['lo_level_id'].setValue(
        response.data.result[0].lo_level_name
      );
      this.subjectMaterialForm.controls['status'].setValue(
        response.data.result[0].is_active.toString()
      );
    }
    this.getMediumList();
    this.getSubjectList();
    this.getStandardList();
    this.getLOLevelList();
    this.getLessonList(this.subjectId);
    this.getTopicList(this.lessonId);
    this.getTopicWiseLOList(this.getTopicId);
  }

  deleteSubjectMaterial(id) {
    Swal.fire({
      icon: 'warning',
      title: 'Are you sure?',
      text: 'You will not be able to recover Material!',
      showCancelButton: true,
      confirmButtonText: 'Yes, delete it!',
      confirmButtonColor: '#6259ca',
      cancelButtonText: 'No, cancel it!',
      cancelButtonColor: '#6259ca',
      reverseButtons: true,
    }).then(async (result: any) => {
      if (result.isConfirmed) {
        const response: any = await this.apiService.deleteMaterial(id);
        if ((response.statusCode = 200)) {
          Swal.fire({
            title: 'Deleted!',
            text: 'Your Materialbeen deleted.',
            icon: 'success',
            confirmButtonColor: '#6259ca',
          });
          await this.getSubjectWiseLessonPlanningMeterialList();
        }
      } else if (result.dismiss === Swal.DismissReason.cancel) {
        Swal.fire({
          title: 'Cancelled!',
          text: 'Your Material is safe :)',
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
    this.getSubjectWiseLessonPlanningMeterialList();
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
  lessonIdList(event) {
    if (event) {
      this.lessonId = +event;
      this.getTopicList(this.lessonId);
    }
  }
  async getTopicList(id: any) {
    const queryList = `?id=${id}&skip_pagination=${true}&sort=DESC`;
    const response: any = await this.apiService.getTopicList(queryList);
    if (response.statusCode === 200) {
      this.topicList = response.data.result;
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
  async getTopicWiseLOList(id: any) {
    const queryList = `?topic_id=${id}&skip_pagination=${true}&sort=DESC`;
    const response: any = await this.apiService.getTopicWiseLOList(queryList);
    if (response.statusCode === 200) {
      this.loList = response.data.result;
    }
  }
  loId(event) {
    if (event) {
      this.getloId = +event;
    }
  }
  loLevel(event) {
    if (event) {
      this.getLoLevel = +event;
    }
  }
  async getLOLevelList() {
    const queryList = `?skip_pagination=${true}&sort=DESC`;
    const response: any = await this.apiService.getLOLevelList(queryList);
    if (response.statusCode === 200) {
      this.loListLevel = response.data.result;
    }
  }
}
