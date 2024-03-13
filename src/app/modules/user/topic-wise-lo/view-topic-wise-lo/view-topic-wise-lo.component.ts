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

@Component({
  selector: 'app-view-topic-wise-lo',
  templateUrl: './view-topic-wise-lo.component.html',
  styleUrls: ['./view-topic-wise-lo.component.scss']
})
export class ViewTopicWiseLoComponent {
  topicWiseloForm: FormGroup;
  modalReference: NgbModalRef;
  pageLimit = Constants.PAGE_LIMIT;
  currentPage = Constants.STARTING_PAGE;
  find = '';
  totalItems: number;
  topicWiseLORep: any = [];
  @ViewChild('TopicWiseLO', { static: false })
  TopicWiseLO: TemplateRef<any>;
  isSubmitted = false;
  model1!: NgbDateStruct;
  EditId: any;
  searchString = '';
  orderBy: any = 'created_at';
  sort = 'DESC';
  isAscending = false;
  mediumId: any;
  standardId: any;
  subjectId: any;
  lessonId: any;
  topicId: any;
  subTopicId: any;
  loLevelId: any;
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
    private modalService: NgbModal,
    private formBuilder: FormBuilder,
    private apiService: ApiService,
    private utils: UtilityService,
    private router: Router
  ) { }

  async ngOnInit() {
    await this.getTopicList();
    await this.getLOLevelList();
    await this.getTopicWiseLOList();
  }

  async getTopicWiseLOList() {
    this.utils.showLoading();
    const queryList = `?search=${this.searchString}&sort=${this.sort}&orderby=${this.orderBy}`;
    const response: any = await this.apiService.getTopicWiseLOList(queryList);
    if (response.statusCode === 200) {
      this.topicWiseLORep = response.data.result;
      this.totalItems = response.data.totalCount;
    }
    this.utils.hideLoading();
  }

  onPageChange = async (page: any) => {
    this.currentPage = page;
    this.getTopicWiseLOList();
  };

  addLessonPlanning() {
    this.router.navigate(['/admin/topic-wise-lo/add-topic-wise-lo']);
  }

  onModalOpen() {
    this.formInit();
    if (this.EditId) {
      this.topicWiseloForm.controls['status'].disable();
    }
    this.modalReference = this.modalService.open(this.TopicWiseLO, this.config);
    this.modalReference.hidden.subscribe(() => {
      this.onModalClose();
    });
  }
  formInit() {
    this.topicWiseloForm = this.formBuilder.group({
      topic_id: [null, Validators.required],
      sub_topic_id: [null, Validators.required],
      lo_level_id: [null, Validators.required],
      name: ['', [Validators.required, NoSpace()]],
      status: [null, Validators.required]
    });
  }
  get form() {
    return this.topicWiseloForm.controls;
  }

  onDateChange(i: any) {
    this.maxDate = this.topicWiseloForm.value.lessons[i].from_date;
  }

  onCalenderClick(i: any) {
    this.maxDate = this.topicWiseloForm.value.lessons[i].from_date;
  }

  async onSubmit() {
    try {
      this.isSubmitted = true;
      if (this.topicWiseloForm.invalid) {
        return;
      }
      this.utils.showLoading();
      let obj;
      if (this.EditId) {
        obj = {
          isActive: this.topicWiseloForm.controls['status'].value == 'true' ? true : false,
          topic_id: this.topicId,
          sub_topic_id: this.subTopicId,
          lo_level_id: this.loLevelId,
          medium_id: this.mediumId,
          subject_id: this.subjectId,
          standard_id: this.standardId,
          lesson_id: this.lessonId,
          name: this.topicWiseloForm.controls['name'].value
        };
      }
      this.EditId ? (obj['id'] = this.EditId) : '';
      const response: any = await this.apiService.addTopicWiseLO(obj);
      this.utils.hideLoading();
      if (response.statusCode === 200) {
        this.utils.showSuccessToast(response.message);
        this.onModalClose();
        this.getTopicWiseLOList();
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
  async editTopicWiseLO(listId) {
    this.EditId = listId;
    const queryList = `?id=${listId}`;
    this.onModalOpen();
    const response: any = await this.apiService.getTopicWiseLOList(queryList);
    if ((response.statusCode = 200)) {
      this.getSubTopicList(response.data.result[0].topic_id)
      this.topicId = response.data.result[0].topic_id;
      this.subTopicId = response.data.result[0].sub_topic_id;
      this.loLevelId = response.data.result[0].lo_level_id;
      this.mediumId = response.data.result[0].medium_id;
      this.standardId = response.data.result[0].standard_id;
      this.subjectId = response.data.result[0].subject_id;
      this.lessonId = response.data.result[0].lesson_id;
      this.topicWiseloForm.controls['topic_id'].setValue(response.data.result[0].topic_name);
      this.topicWiseloForm.controls['sub_topic_id'].setValue(response.data.result[0].sub_topic_name);
      this.topicWiseloForm.controls['lo_level_id'].setValue(response.data.result[0].lo_level_name);
      this.topicWiseloForm.controls['name'].setValue(response.data.result[0].name);
    }
  }

  deleteTopicWiseLO(id) {
    Swal.fire({
      icon: 'warning',
      title: 'Are you sure?',
      text: 'You will not be able to recover Topic Wise LO!',
      showCancelButton: true,
      confirmButtonText: 'Yes, delete it!',
      confirmButtonColor: '#6259ca',
      cancelButtonText: 'No, cancel it!',
      cancelButtonColor: '#6259ca',
      reverseButtons: true,
    }).then(async (result: any) => {
      if (result.isConfirmed) {
        const response: any = await this.apiService.topicWiseLODelete(id);
        if ((response.statusCode = 200)) {
          Swal.fire({
            title: 'Deleted!',
            text: 'Your Topic Wise LO has been deleted.',
            icon: 'success',
            confirmButtonColor: '#6259ca',
          });
          await this.getTopicWiseLOList();
        }
      } else if (result.dismiss === Swal.DismissReason.cancel) {
        Swal.fire({
          title: 'Cancelled!',
          text: 'Your Topic Wise LO Planning is safe :)',
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
      this.sort = this.isAscending ? 'ASC' : 'DESC'
    } else {
      this.isAscending = true;
      this.sort = 'ASC'
    }
    this.orderBy = columnName;
    this.getTopicWiseLOList();
  }

  topic(event) {
    if (event) {
      this.topicId = +event;
      this.getSubTopicList(this.topicId);
    }
  }

  subTopic(event) {
    if (event) {
      this.subTopicId = +event;
    }
  }

  loLevel(event) {
    if (event) {
      this.loLevelId = +event;
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
