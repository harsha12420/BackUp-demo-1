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
  selector: 'app-add-question-difficulty-level-master',
  templateUrl: './add-question-difficulty-level-master.component.html',
  styleUrls: ['./add-question-difficulty-level-master.component.scss'],
})
export class AddQuestionDifficultyLevelMasterComponent {
  questionDifficulityLevelForm: FormGroup;
  modalReference: NgbModalRef;
  pageLimit = Constants.PAGE_LIMIT;
  currentPage = Constants.STARTING_PAGE;
  find = '';
  totalItems: number;
  questionDifficultyLevelRep: any = [];
  @ViewChild('QuestionDifficulty', { static: false })
  QuestionDifficulty: TemplateRef<any>;
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

  constructor(
    private modalService: NgbModal,
    private formBuilder: FormBuilder,
    private apiService: ApiService,
    private utils: UtilityService,
    private exportService:ExportService
  ) { }

  async ngOnInit() {
    await this.getQuestionTypeDifficultyMasterList();
  }

  async getQuestionTypeDifficultyMasterList(isExport=false) {
    this.utils.showLoading();
    let queryList = `?search=${this.searchString}&page=${this.currentPage}&limit=${this.pageLimit}&sort=${this.sort}&orderby=${this.orderBy}`;
    if (isExport) {
      queryList += `&skip_pagination=true`;
    }
    const response: any =
      await this.apiService.getQuestionTypeDifficultyMasterList(queryList);
    if (!isExport && response.statusCode === 200) {
      this.questionDifficultyLevelRep = response.data.result;
      this.totalItems = response.data.totalCount;
    }
    else if (isExport && response.statusCode === 200) {
      this.utils.hideLoading();
      return response.data.result;
    }
    this.utils.hideLoading();
  }

  onPageChange = async (page: any) => {
    this.currentPage = page;
    this.getQuestionTypeDifficultyMasterList();
  };
  onModalOpen() {
    this.formInit();
    this.modalReference = this.modalService.open(
      this.QuestionDifficulty,
      this.config
    );
    this.modalReference.hidden.subscribe(() => {
      this.onModalClose();
    });
  }

  formInit() {
    this.questionDifficulityLevelForm = this.formBuilder.group({
      name: ['', [Validators.required, NoSpace()]],
      status: ['true', Validators.required],
    });
  }

  get form() {
    return this.questionDifficulityLevelForm.controls;
  }

  async onSubmit() {
    try {
      this.isSubmitted = true;
      if (this.questionDifficulityLevelForm.invalid) {
        return;
      }
      this.utils.showLoading();

      const obj = {
        name: this.questionDifficulityLevelForm.controls['name'].value,
        isActive:
          this.questionDifficulityLevelForm.controls['status'].value == 'true'
            ? true
            : false,
      };
      this.EditId ? (obj['id'] = this.EditId) : '';
      const response: any =
        await this.apiService.addQuestionTypeDifficultyMaster(obj);
      this.utils.hideLoading();
      if (response.statusCode === 200) {
        this.utils.showSuccessToast(response.message);
        this.onModalClose();
        this.getQuestionTypeDifficultyMasterList();
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
    const response: any =
      await this.apiService.getQuestionTypeDifficultyMasterById(queryList);
    if ((response.statusCode = 200)) {
      this.questionDifficulityLevelForm.controls['name'].setValue(
        response.data.name
      );
      this.questionDifficulityLevelForm.controls['status'].setValue(
        response.data.is_active.toString()
      );
    }
  }

  deleteQuestionTypeMaster(id) {
    Swal.fire({
      icon: 'warning',
      title: 'Are you sure?',
      text: 'You will not be able to recover Question Type Difficulty Level!',
      showCancelButton: true,
      confirmButtonText: 'Yes, delete it!',
      confirmButtonColor: '#6259ca',
      cancelButtonText: 'No, cancel it!',
      cancelButtonColor: '#6259ca',
      reverseButtons: true,
    }).then(async (result: any) => {
      if (result.isConfirmed) {
        const response: any =
          await this.apiService.questionTypeDifficultyMasterDelete(id);
        if ((response.statusCode = 200)) {
          Swal.fire({
            title: 'Deleted!',
            text: 'Your Question Type Difficulty Level has been deleted.',
            icon: 'success',
            confirmButtonColor: '#6259ca',
          });
          await this.getQuestionTypeDifficultyMasterList();
        }
      } else if (result.dismiss === Swal.DismissReason.cancel) {
        Swal.fire({
          title: 'Cancelled!',
          text: 'Your Question Type Difficulty Level is safe :)',
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
    this.getQuestionTypeDifficultyMasterList();
  }

  async exportAll(exportType ){
    const data: any = [];
    const headerRow = [ 
      "Difficulty Level",
      "Status",
      "Date & Time"
   ]
    if (exportType != "pdf") {
      data.push(headerRow);
    }
    const arr: any = await this.getQuestionTypeDifficultyMasterList(true);
    for (const item of arr) {
      const rowData = [
        item.name||"-",
        item.is_active ? "Active" : "In Active"||"-",
        moment(item.created_at).format("YYYY-MM-DD hh:mm A")||"-",
      ]
      data.push(rowData);
    }
    this.exportService.exportData(
      exportType,
      headerRow,
      data,
      `Exported Question Difficulity Level List${ moment().format("YYYY-MM-DD")}`
    );
  }
}
