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
import { NoSpace } from 'src/app/shared/validations/no-space.validator';
import Swal from 'sweetalert2';
import { CdkDragDrop, moveItemInArray } from '@angular/cdk/drag-drop';
import * as moment from 'moment';
import { ExportService } from 'src/app/services/export-service.service';
@Component({
  selector: 'app-add-subject',
  templateUrl: './add-subject.component.html',
  styleUrls: ['./add-subject.component.scss'],
})
export class AddSubjectComponent {
  subjectForm: FormGroup;
  modalReference: NgbModalRef;
  pageLimit = Constants.PAGE_LIMIT;
  currentPage = Constants.STARTING_PAGE;
  find = '';
  totalItems: number;
  subjectRep: any = [];
  @ViewChild('Subject', { static: false })
  Subject: TemplateRef<any>;
  isSubmitted = false;
  model1!: NgbDateStruct;
  EditId: any;
  searchString = '';
  standardList: any;
  orderBy: any = 'sequence';
  sort = 'ASC';
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
    private exportService:ExportService,
    private utils: UtilityService
  ) { }

  async ngOnInit() {
    await this.getSubjectList();
  }

  async getSubjectList(isExport=false) {
    this.utils.showLoading();
    let queryList = `?search=${this.searchString}&page=${this.currentPage}&limit=${this.pageLimit}&sort=${this.sort}&orderby=${this.orderBy}`;
    if (isExport) {
      queryList += `&skip_pagination=true`;
    }
    const response: any = await this.apiService.getSubjectList(queryList);
    if (!isExport && response.statusCode === 200) {
      this.subjectRep = response.data.result;
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
    this.getSubjectList();
  };
  onModalOpen() {
    this.formInit();
    this.modalReference = this.modalService.open(this.Subject, this.config);
    this.modalReference.hidden.subscribe(() => {
      this.onModalClose();
    });
  }
  formInit() {
    this.subjectForm = this.formBuilder.group({
      name: ['', [Validators.required, NoSpace()]],
      Status: ['true', Validators.required],
    });
  }
  get form() {
    return this.subjectForm.controls;
  }
  async onSubmit() {
    try {
      this.isSubmitted = true;
      if (this.subjectForm.invalid) {
        return;
      }
      this.utils.showLoading();

      const obj = {
        name: this.subjectForm.controls['name'].value,
        isActive:
          this.subjectForm.controls['Status'].value == 'true' ? true : false,
      };
      this.EditId ? (obj['id'] = this.EditId) : '';
      const response: any = await this.apiService.addSubject(obj);
      this.utils.hideLoading();
      if (response.statusCode === 200) {
        this.utils.showSuccessToast(response.message);
        this.onModalClose();
        this.getSubjectList();
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
  async editSubject(listId) {
    this.EditId = listId;
    this.onModalOpen();
    const response: any = await this.apiService.getSubjectId(listId);
    if ((response.statusCode = 200)) {
      this.subjectForm.controls['name'].setValue(response.data.name);

      this.subjectForm.controls['Status'].setValue(
        response.data.is_active.toString()
      );
    }
  }

  deleteSubject(id) {
    Swal.fire({
      icon: 'warning',
      title: 'Are you sure?',
      text: 'You will not be able to recover Subject !',
      showCancelButton: true,
      confirmButtonText: 'Yes, delete it!',
      confirmButtonColor: '#6259ca',
      cancelButtonText: 'No, cancel it!',
      cancelButtonColor: '#6259ca',
      reverseButtons: true,
    }).then(async (result: any) => {
      if (result.isConfirmed) {
        const response: any = await this.apiService.SubjectDelete(id);
        if ((response.statusCode = 200)) {
          Swal.fire({
            title: 'Deleted!',
            text: 'Your Subject has been deleted.',
            icon: 'success',
            confirmButtonColor: '#6259ca',
          });
          await this.getSubjectList();
        }
      } else if (result.dismiss === Swal.DismissReason.cancel) {
        Swal.fire({
          title: 'Cancelled!',
          text: 'Your Subject is safe :)',
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
    this.getSubjectList();
  }

  async drop(event: CdkDragDrop<any[]>) {
    try {
      moveItemInArray(this.subjectRep, event.previousIndex, event.currentIndex);
      let data: any = []
      this.subjectRep.forEach((element, index) => {
        let json = {
          id: element.id,
          sequence: index + 1
        }
        data.push(json);
      });

      let json = {
        subject_ids: data
      }
      const response: any = await this.apiService.addSubjectSequence(json);
      if ((response.statusCode = 200)) {
        this.getSubjectList();
        this.utils.showSuccessToast(response.message);
      }
    } catch (error) {
      this.utils.hideLoading();
    }
  }

  async exportAll(exportType ){
    const data: any = [];
    const headerRow = [ 
      "Exam Name",
      "Exam Status",
      "Exam Date"
   ]
    if (exportType != "pdf") {
      data.push(headerRow);
    }
    const arr: any = await this.getSubjectList(true);
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
      `Exported Subject List${ moment().format("YYYY-MM-DD")}`
    );
  }
}
