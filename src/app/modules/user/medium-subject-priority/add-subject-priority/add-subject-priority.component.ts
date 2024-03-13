import { Component, TemplateRef, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import {
  NgbDateStruct,
  NgbModal,
  NgbModalRef,
} from '@ng-bootstrap/ng-bootstrap';
import { Constants, DefaultMedium } from 'src/app/Constants/constants';
import { ApiService } from 'src/app/services/api.service';
import { UtilityService } from 'src/app/services/utility.service';
import { CdkDragDrop, moveItemInArray } from '@angular/cdk/drag-drop';
import Swal from 'sweetalert2';
import * as moment from 'moment';
import { ExportService } from 'src/app/services/export-service.service';

@Component({
  selector: 'app-add-subject-priority',
  templateUrl: './add-subject-priority.component.html',
  styleUrls: ['./add-subject-priority.component.scss']
})
export class AddSubjectPriorityComponent {
  subjectPriorityForm: FormGroup;
  modalReference: NgbModalRef;
  pageLimit = Constants.PAGE_LIMIT;
  currentPage = Constants.STARTING_PAGE;
  find = '';
  totalItems: number;
  subjectPriorityRep: any = [];
  @ViewChild('SubjectPriority', { static: false })
  SubjectPriority: TemplateRef<any>;
  isSubmitted = false;
  model1!: NgbDateStruct;
  EditId: any;
  searchString = '';
  subjectList: any;
  orderBy: any = 'sequence';
  sort = 'ASC';
  isAscending = false;
  mediumId: any;
  subjectId: any;
  mediumList: any;

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
    private exportService:ExportService,
    private utils: UtilityService
  ) { }

  async ngOnInit() {
    await this.getMediumSubjectPriorityList();
    this.getMediumList();
    this.getSubject();
  }

  async getMediumSubjectPriorityList(isExport=false) {
    this.utils.showLoading();
    let queryList = `?search=${this.searchString}&page=${this.currentPage}&limit=${this.pageLimit}&sort=${this.sort}&orderby=${this.orderBy}`;
    if (isExport) {
      queryList += `&skip_pagination=true`;
    }
    const response: any = await this.apiService.getMediumSubjectPriorityList(queryList);
    if (!isExport && response.statusCode === 200) {
      this.subjectPriorityRep = response.data.result;
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
    this.getMediumSubjectPriorityList();
  };
  onModalOpen() {
    this.formInit();
    this.modalReference = this.modalService.open(this.SubjectPriority, this.config);
    this.modalReference.hidden.subscribe(() => {
      this.onModalClose();
    });
  }
  formInit() {
    this.subjectPriorityForm = this.formBuilder.group({
      subject: [null, Validators.required],
      medium: [null, Validators.required],
      status: ['true', Validators.required]
    });
    if (this.mediumList) {
      this.mediumList.map((data) => {
        if (data.name == DefaultMedium) {
          this.subjectPriorityForm.patchValue(
            { 'medium': data.id }
          )
        }
      })
    }
  }
  get form() {
    return this.subjectPriorityForm.controls;
  }
  async onSubmit() {
    try {
      console.log(this.subjectPriorityForm.value);
      
      this.isSubmitted = true;
      if (this.subjectPriorityForm.invalid) {
        return;
      }
      this.utils.showLoading();
      if (this.subjectPriorityForm.value.medium) {
        this.mediumId = this.subjectPriorityForm.value.medium;
      }
      const obj = {
        isActive: this.subjectPriorityForm.controls['status'].value == 'true' ? true : false,
        subject_id: this.subjectId,
        medium_id: +this.mediumId
      };
      this.EditId ? (obj['id'] = this.EditId) : '';
      const response: any = await this.apiService.addMediumSubjectPriority(obj);
      this.utils.hideLoading();
      if (response.statusCode === 200) {
        this.utils.showSuccessToast(response.message);
        this.onModalClose();
        this.getMediumSubjectPriorityList();
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
  async editSubjectPriority(listId) {
    this.EditId = listId;
    const queryList = `?id=${listId}`;
    this.onModalOpen();
    const response: any = await this.apiService.getMediumSubjectPriorityList(queryList);
    if ((response.statusCode = 200)) {
      this.mediumId = response.data.result[0].medium_id;
      this.subjectId = response.data.result[0].subject_id;
      this.subjectPriorityForm.controls['medium'].setValue(response.data.result[0].medium_id);
      this.subjectPriorityForm.controls['subject'].setValue(response.data.result[0].subject_name);
      this.subjectPriorityForm.controls['status'].setValue(response.data.result[0].is_active ? true : false);
    }
  }

  deleteMediumSubjectPriority(id) {
    Swal.fire({
      icon: 'warning',
      title: 'Are you sure?',
      text: 'You will not be able to recover Subject Priority!',
      showCancelButton: true,
      confirmButtonText: 'Yes, delete it!',
      confirmButtonColor: '#6259ca',
      cancelButtonText: 'No, cancel it!',
      cancelButtonColor: '#6259ca',
      reverseButtons: true,
    }).then(async (result: any) => {
      if (result.isConfirmed) {
        const response: any = await this.apiService.deleteMediumSubjectPriority(id);
        if ((response.statusCode = 200)) {
          Swal.fire({
            title: 'Deleted!',
            text: 'Your Subject Priority been deleted.',
            icon: 'success',
            confirmButtonColor: '#6259ca',
          });
          await this.getMediumSubjectPriorityList();
        }
      } else if (result.dismiss === Swal.DismissReason.cancel) {
        Swal.fire({
          title: 'Cancelled!',
          text: 'Your Subject Priority is safe :)',
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
    this.getMediumSubjectPriorityList();
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
    this.subjectId = +event;
  }

  medium(event) {
    if (event) {
      this.mediumId = +event;
    }
  }

  async getMediumList() {
    const queryList = `?skip_pagination=${true}&sort=DESC`;
    const response: any = await this.apiService.getMediumList(queryList);
    if (response.statusCode === 200) {
      this.mediumList = response.data.result;
    }
  }

  async drop(event: CdkDragDrop<any[]>) {
    try {
      moveItemInArray(this.subjectPriorityRep, event.previousIndex, event.currentIndex);
      let data: any = []
      this.subjectPriorityRep.forEach((element, index) => {
        let json = {
          id: element.id,
          sequence: index + 1
        }
        data.push(json);
      });

      let json = {
        medium_subject_ids: data
      }
      const response: any = await this.apiService.addMediumSubjectPrioritySequence(json);
      if ((response.statusCode = 200)) {
        this.getMediumSubjectPriorityList();
        this.utils.showSuccessToast(response.message);
      }
    } catch (error) {
      this.utils.hideLoading();
    }
  }
  async exportAll(exportType ){
    const data: any = [];
    const headerRow = [ 
      "Medium",
      "Subject",
      "Status",
      "Date & Time"
   ]
    if (exportType != "pdf") {
      data.push(headerRow);
    }
    const arr: any = await this.getMediumSubjectPriorityList(true);
    for (const item of arr) {
      const rowData = [
        item.medium_name||"-",
        item.subject_name||"-",
        item.is_active ? "Active" : "In Active"||"-",
        moment(item.created_at).format("YYYY-MM-DD hh:mm A")||"-",
      ]
      data.push(rowData);
    }
    this.exportService.exportData(
      exportType,
      headerRow,
      data,
      `Exported Subject Priority List${ moment().format("YYYY-MM-DD")}`
    );
  }
}
