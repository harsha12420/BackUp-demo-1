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
  selector: 'app-add-chapter',
  templateUrl: './add-chapter.component.html',
  styleUrls: ['./add-chapter.component.scss'],
})
export class AddChapterComponent {
  chapterForm: FormGroup;
  modalReference: NgbModalRef;
  pageLimit = Constants.PAGE_LIMIT;
  currentPage = Constants.STARTING_PAGE;
  find = '';
  totalItems: number;
  chapterRes: any = [];
  @ViewChild('Chapter', { static: false })
  Chapter: TemplateRef<any>;
  isSubmitted = false;
  model1!: NgbDateStruct;
  EditId: any;
  searchString = '';
  stateList: any;
  config = {
    backdrop: true,
    ignoreBackdropClick: true,
    class: 'modal-md',
    centered: true,
    modalDialogClass: 'modal-xl',
  };
  mediumList: any;
  mediumId: any;
  standardList: any;
  standardId: any;
  subjectList: any;
  subjectID: any;
  orderBy: any = 'created_at';
  sort = 'DESC';
  isAscending = false;
  constructor(
    private modalService: NgbModal,
    private formBuilder: FormBuilder,
    private apiService: ApiService,
    private exportService:ExportService,
    private utils: UtilityService
  ) { }

  async ngOnInit() {
    await this.getPointList();
    this.getMedium();
    this.getStandard();
    this.getSubject();
  }

  async getPointList(isExport=false) {
    this.utils.showLoading();
    let queryList = `?search=${this.searchString}&page=${this.currentPage}&limit=${this.pageLimit}&sort=${this.sort}&orderby=${this.orderBy}`;
    if (isExport) {
      queryList += `&skip_pagination=true`;
    }
    const response: any = await this.apiService.getChapterList(queryList);
    if (!isExport && response.statusCode === 200) {
      this.chapterRes = response.data.result;
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
    this.getPointList();
  };
  onModalOpen() {
    this.formInit();
    this.modalReference = this.modalService.open(this.Chapter, this.config);
    this.modalReference.hidden.subscribe(() => {
      this.onModalClose();
    });
  }
  formInit() {
    this.chapterForm = this.formBuilder.group({
      name: ['', [Validators.required, NoSpace()]],
      medium_id: [null, Validators.required],
      standard_id: [null, Validators.required],
      subject_id: [null, Validators.required],
    });
  }
  get form() {
    return this.chapterForm.controls;
  }
  async onSubmit() {
    try {
      this.isSubmitted = true;
      if (this.chapterForm.invalid) {
        return;
      }
      this.utils.showLoading();

      const obj = {
        name: this.chapterForm.controls['name'].value,
        medium_id: this.mediumId,
        standard_id: this.standardId,
        subject_id: this.subjectID,
      };
      this.EditId ? (obj['id'] = this.EditId) : '';
      const response: any = await this.apiService.addChapter(obj);
      this.utils.hideLoading();
      if (response.statusCode === 200) {
        this.utils.showSuccessToast(response.message);
        this.onModalClose();
        this.getPointList();
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
  async editChapter(listId) {
    this.EditId = listId;
    this.onModalOpen();
    const response: any = await this.apiService.getChapterId(listId);
    if ((response.statusCode = 200)) {
      this.chapterForm.controls['name'].setValue(response.data.name);

      this.chapterForm.controls['medium_id'].setValue(response.data.medium_id);
      this.chapterForm.controls['standard_id'].setValue(
        response.data.standard_id
      );
      this.chapterForm.controls['subject_id'].setValue(
        response.data.subject_id
      );
    }
  }

  deleteChapter(id) {
    Swal.fire({
      icon: 'warning',
      title: 'Are you sure?',
      text: 'You will not be able to recover Chapter  !',
      showCancelButton: true,
      confirmButtonText: 'Yes, delete it!',
      confirmButtonColor: '#6259ca',
      cancelButtonText: 'No, cancel it!',
      cancelButtonColor: '#6259ca',
      reverseButtons: true,
    }).then(async (result: any) => {
      if (result.isConfirmed) {
        const response: any = await this.apiService.ChapterDelete(id);
        if ((response.statusCode = 200)) {
          Swal.fire({
            title: 'Deleted!',
            text: 'Your Chapter been deleted.',
            icon: 'success',
            confirmButtonColor: '#6259ca',
          });
          await this.getPointList();
        }
      } else if (result.dismiss === Swal.DismissReason.cancel) {
        Swal.fire({
          title: 'Cancelled!',
          text: 'Your Chapter  is safe :)',
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
  async getMedium() {
    this.utils.showLoading();
    const queryList = `?skip_pagination=${true}&sort=DESC`;
    const response: any = await this.apiService.getMediumList(queryList);
    if (response.statusCode === 200) {
      this.mediumList = response.data.result;
    }
    this.utils.hideLoading();
  }
  medium(event) {
    this.mediumId = Number(event.target.value);
  }
  async getStandard() {
    this.utils.showLoading();
    const queryList = `?skip_pagination=${true}&sort=DESC`;
    const response: any = await this.apiService.getStandardList(queryList);
    if (response.statusCode === 200) {
      this.standardList = response.data.result;
    }
    this.utils.hideLoading();
  }
  standard(event) {
    this.standardId = Number(event.target.value);
  }
  async getSubject() {
    this.utils.showLoading();
    const queryList = `?skip_pagination=${true}&sort=DESC&isActive=true`;
    const response: any = await this.apiService.getSubjectList(queryList);
    if (response.statusCode === 200) {
      this.subjectList = response.data.result;
    }
    this.utils.hideLoading();
  }
  subject(event) {
    this.subjectID = Number(event.target.value);
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
    this.getPointList();
  }

  async exportAll(exportType ){
    const data: any = [];
    const headerRow = [ 
      "Chapter Name",
      "Medium",
      "Standard",
      "Subject",
      "Submission Date"
   ]
    if (exportType != "pdf") {
      data.push(headerRow);
    }
    const arr: any = await this.getPointList(true);
    for (const item of arr) {
      const rowData = [
        item.name||"-",
        item.medium_name||"-",
        item.standard_name||"-",
        item.subject_name||"-",
        moment(item.created_at).format("YYYY-MM-DD hh:mm A")||"-",
      ]
      data.push(rowData);
    }
    this.exportService.exportData(
      exportType,
      headerRow,
      data,
      `Exported Chapter List${ moment().format("YYYY-MM-DD")}`
    );
  }
}
