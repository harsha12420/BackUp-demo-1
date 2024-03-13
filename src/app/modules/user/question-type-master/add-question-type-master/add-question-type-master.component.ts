import { Component, TemplateRef, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import {
  NgbDateStruct,
  NgbModal,
  NgbModalRef,
} from '@ng-bootstrap/ng-bootstrap';
import * as moment from 'moment';
import { Constants } from 'src/app/Constants/constants';
import { ApiService } from 'src/app/services/api.service';
import { ExportService } from 'src/app/services/export-service.service';
import { UtilityService } from 'src/app/services/utility.service';
import { NoSpace } from 'src/app/shared/validations/no-space.validator';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-add-question-type-master',
  templateUrl: './add-question-type-master.component.html',
  styleUrls: ['./add-question-type-master.component.scss'],
})
export class AddQuestionTypeMasterComponent {
  questionTypeMasterForm: FormGroup;
  modalReference: NgbModalRef;
  pageLimit = Constants.PAGE_LIMIT;
  currentPage = Constants.STARTING_PAGE;
  find = '';
  totalItems: number;
  questionTypeMasterRep: any = [];
  @ViewChild('QuestionType', { static: false })
  QuestionType: TemplateRef<any>;
  isSubmitted = false;
  model1!: NgbDateStruct;
  EditId: any;
  searchString = '';
  standardList: any;
  orderBy: any = 'created_at';
  sort = 'DESC';
  isAscending = false;
  config = {
    backdrop: true,
    ignoreBackdropClick: true,
    class: 'modal-md',
    centered: true,
    modalDialogClass: 'modal-xl',
  };
  questionOptionTypeList: any = [
    { id: 1, name: 'OneWordAnswer' },
    { id: 2, name: 'MultiChoice' },
    { id: 3, name: 'FillingTheBlanks' },
    { id: 4, name: 'MatchingPairs' },
    { id: 5, name: 'TrueFalse' },
    { id: 6, name: 'Other' },
  ];

  constructor(
    private modalService: NgbModal,
    private formBuilder: FormBuilder,
    private apiService: ApiService,
    private utils: UtilityService,
    private exportService:ExportService,
  ) { }

  async ngOnInit() {
    await this.getQuestionTypeMasterList();
  }

  async getQuestionTypeMasterList(isExport=false) {
    this.utils.showLoading();
    let queryList = `?search=${this.searchString}&page=${this.currentPage}&limit=${this.pageLimit}&sort=${this.sort}&orderby=${this.orderBy}`;
    if (isExport) {
      queryList += `&skip_pagination=true`;
    }
    const response: any = await this.apiService.getQuestionTypeMasterList(
      queryList
    );
    if (!isExport && response.statusCode === 200) {
      this.questionTypeMasterRep = response.data.result;
      this.totalItems = response.data.totalCount;
    }
    else if (isExport&&response.statusCode === 200) {
      this.utils.hideLoading();
      return response.data.result;
    }
    this.utils.hideLoading();
  }

  onPageChange = async (page: any) => {
    this.currentPage = page;
    this.getQuestionTypeMasterList();
  };
  onModalOpen() {
    this.formInit();
    this.modalReference = this.modalService.open(
      this.QuestionType,
      this.config
    );
    this.modalReference.hidden.subscribe(() => {
      this.onModalClose();
    });
  }

  formInit() {
    this.questionTypeMasterForm = this.formBuilder.group({
      question_title: ['', [Validators.required, NoSpace()]],
      question_option_type: ['', [Validators.required]],
      status: ['true', Validators.required],
    });
  }

  get form() {
    return this.questionTypeMasterForm.controls;
  }

  async onSubmit() {
    try {
      this.isSubmitted = true;
      if (this.questionTypeMasterForm.invalid) {
        return;
      }
      this.utils.showLoading();

      const obj = {
        question_title:
          this.questionTypeMasterForm.controls['question_title'].value,
        question_option_type:
          this.questionTypeMasterForm.controls['question_option_type'].value,
        isActive:
          this.questionTypeMasterForm.controls['status'].value == 'true'
            ? true
            : false,
      };
      this.EditId ? (obj['id'] = this.EditId) : '';
      const response: any = await this.apiService.addQuestionTypeMaster(obj);
      this.utils.hideLoading();
      if (response.statusCode === 200) {
        this.utils.showSuccessToast(response.message);
        this.onModalClose();
        this.getQuestionTypeMasterList();
      }
    } catch (error) {
      this.utils.hideLoading();
    }
  }

  onModalClose() {
    this.isSubmitted = false;
    this.EditId = null;
    this.standardList = null;
    this.modalReference.close();
  }

  async editQuestionTypeMaster(listId) {
    this.EditId = listId;
    const queryList = `/${listId}`;
    this.onModalOpen();
    const response: any = await this.apiService.getQuestionTypeMasterByIdList(
      queryList
    );
    if ((response.statusCode = 200)) {
      this.questionTypeMasterForm.controls['question_title'].setValue(
        response.data.question_title
      );
      this.questionTypeMasterForm.controls['question_option_type'].setValue(
        response.data.question_option_type
      );
      this.questionTypeMasterForm.controls['status'].setValue(
        response.data.is_active.toString()
      );
    }
  }

  deleteQuestionTypeMaster(id) {
    Swal.fire({
      icon: 'warning',
      title: 'Are you sure?',
      text: 'You will not be able to recover Question Type!',
      showCancelButton: true,
      confirmButtonText: 'Yes, delete it!',
      confirmButtonColor: '#6259ca',
      cancelButtonText: 'No, cancel it!',
      cancelButtonColor: '#6259ca',
      reverseButtons: true,
    }).then(async (result: any) => {
      if (result.isConfirmed) {
        const response: any = await this.apiService.questionTypeMasterDelete(
          id
        );
        if ((response.statusCode = 200)) {
          Swal.fire({
            title: 'Deleted!',
            text: 'Your Question Type has been deleted.',
            icon: 'success',
            confirmButtonColor: '#6259ca',
          });
          await this.getQuestionTypeMasterList();
        }
      } else if (result.dismiss === Swal.DismissReason.cancel) {
        Swal.fire({
          title: 'Cancelled!',
          text: 'Your Question Type is safe :)',
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
    this.getQuestionTypeMasterList();
  }

  async exportAll(exportType ){
    const data: any = [];
    const headerRow = [ 
      "Question Title",
      "Question Option Type",
      "Status",
      "Date & Time"
   ]
    if (exportType != "pdf") {
      data.push(headerRow);
    }
    const arr: any = await this.getQuestionTypeMasterList(true);
    for (const item of arr) {
      const rowData = [
        item.question_title||"-",
        item.question_option_type||"-",
        item.is_active ? "Active" : "In Active"||"-",
        moment(item.created_at).format("YYYY-MM-DD hh:mm A")||"-",
      ]
      data.push(rowData);
    }
    this.exportService.exportData(
      exportType,
      headerRow,
      data,
      `Exported Observation Type List${ moment().format("YYYY-MM-DD")}`
    );
  }
}
