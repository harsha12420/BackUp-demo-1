import { Component, TemplateRef, ViewChild } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { NgbModalRef, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { Constants } from 'src/app/Constants/constants';
import { ApiService } from 'src/app/services/api.service';
import { UtilityService } from 'src/app/services/utility.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-standard-document',
  templateUrl: './standard-document.component.html',
  styleUrls: ['./standard-document.component.scss']
})
export class StandardDocumentComponent {
  assignDocumentForm: FormGroup;
  modalReference: NgbModalRef;
  pageLimit = Constants.PAGE_LIMIT;
  currentPage = Constants.STARTING_PAGE;
  totalItems: number;
  asignedDocumentList: any = [];
  standardList: any = [];
  @ViewChild('AssignDocuments', { static: false })
  AssignDocuments: TemplateRef<any>;
  isSubmitted = false;
  EditId: any;
  searchString = '';
  orderBy: any = 'created_at';
  sort = 0;
  isAscending = false;
  config = {
    backdrop: true,
    ignoreBackdropClick: true,
    class: 'modal-md',
    centered: true,
  };
  feeCategoryList: any = [];
  studentDocumentList: any = [];

  constructor(
    private modalService: NgbModal,
    private formBuilder: FormBuilder,
    private apiService: ApiService,
    private utils: UtilityService
  ) { }

  async ngOnInit() {
    await this.getAssignedDocumentList();
  }

  formInit() {
    this.assignDocumentForm = this.formBuilder.group({
      standard_id: ['' || null, [Validators.required]],
      fee_category_id: ['' || null, Validators.required],
      document_id: [[], [Validators.required]],
      status: ['true', [Validators.required]],
    });
  }

  get form() {
    return this.assignDocumentForm.controls;
  }

  async getAssignedDocumentList() {
    this.utils.showLoading();
    const queryList = `?page=${this.currentPage}&limit=${this.pageLimit}&sort=${this.sort}&orderby=${this.orderBy}`;
    const response: any = await this.apiService.getAssignedDocumentList(queryList);
    if (response.statusCode === 200) {
      this.asignedDocumentList = response.data.result;
      this.totalItems = response.data.totalCount;
    }
    this.utils.hideLoading();
  }

  onPageChange = async (page: any) => {
    this.currentPage = page;
    this.getAssignedDocumentList();
  };

  onModalOpen() {
    this.formInit();
    this.getStandardList();
    this.getFeeCategoryMasterList();
    this.getStudentDocumentList();
    this.modalReference = this.modalService.open(this.AssignDocuments, this.config);
    this.modalReference.hidden.subscribe(() => {
      this.onModalClose();
    });
  }

  async getStandardList() {
    this.utils.showLoading();
    let queryList = `?skip_pagination=true`;
    const response: any = await this.apiService.getStandardList(queryList);
    if (response.statusCode === 200) {
      this.standardList = response.data.result;
      this.totalItems = response.data.totalCount;
    }
    this.utils.hideLoading();
  }

  async getFeeCategoryMasterList() {
    this.utils.showLoading();
    const queryList = `?skip_pagination=true`;
    const response: any = await this.apiService.getFeeCategoryMaster(queryList);
    if (response.statusCode === 200) {
      this.feeCategoryList = response.data.result;
      this.totalItems = response.data.totalCount;
    }
    this.utils.hideLoading();
  }

  async getStudentDocumentList() {
    this.utils.showLoading();
    const queryList = `?type=STUDENT&skip_pagination=${true}&sort=DESC`;
    const response: any = await this.apiService.DocumentSettingList(queryList);
    if (response.statusCode === 200) {
      this.studentDocumentList = response.data.result;
    }
    this.utils.hideLoading();
  }

  async onSubmit() {
    try {
      this.isSubmitted = true;
      if (this.assignDocumentForm.valid) {
        this.utils.showLoading();
        const obj = {
          standard_id: this.assignDocumentForm.controls['standard_id'].value,
          fee_category_id: this.assignDocumentForm.controls['fee_category_id'].value,
          document_id: this.assignDocumentForm.controls['document_id'].value,
          isActive: this.assignDocumentForm.controls['status'].value == 'true' ? true : false,
        };
        this.EditId ? (obj['id'] = this.EditId) : '';
        const response: any = await this.apiService.assignDocumentToStandard(obj);
        this.utils.hideLoading();
        if (response.statusCode === 200) {
          this.utils.showSuccessToast(response.message);
          this.onModalClose();
          this.getAssignedDocumentList();
        }
      } else {
        this.assignDocumentForm.markAllAsTouched();
      }
    } catch (error) {
      this.utils.hideLoading();
    }
  }

  onModalClose() {
    this.isSubmitted = false;
    this.EditId = null;
    this.assignDocumentForm.reset();
    this.modalReference.close();
  }

  async documentIds(document) {
    this.EditId = document._id;
    this.onModalOpen();
    // const documentIds = document.document_id.map(d=> {return d.document_id});
    this.assignDocumentForm.patchValue({
      standard_id: document.standard_id,
      fee_category_id: document.fee_category_id,
      document_id: document.document_id,
      status: document.isActive.toString()
    })
  }

  deleteAssignedDocument(id) {
    Swal.fire({
      icon: 'warning',
      title: 'Are you sure?',
      text: 'You will not be able to recover this assigned coument to standard!',
      showCancelButton: true,
      confirmButtonText: 'Yes, delete it!',
      confirmButtonColor: '#6259ca',
      cancelButtonText: 'No, cancel it!',
      cancelButtonColor: '#6259ca',
      reverseButtons: true,
    }).then(async (result: any) => {
      if (result.isConfirmed) {
        const response: any = await this.apiService.deleteAssignedDocumentToStandard(id);
        if ((response.statusCode = 200)) {
          Swal.fire({
            title: 'Deleted!',
            text: 'Your Assigned Documents deleted.',
            icon: 'success',
            confirmButtonColor: '#6259ca',
          });
          await this.getAssignedDocumentList();
        }
      } else if (result.dismiss === Swal.DismissReason.cancel) {
        Swal.fire({
          title: 'Cancelled!',
          text: 'Your Assigned Documents is safe :)',
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
      this.sort = this.isAscending ? 1 : 0;
    } else {
      this.isAscending = true;
      this.sort = 1;
    }
    this.orderBy = columnName;
    this.getAssignedDocumentList();
  }
}
