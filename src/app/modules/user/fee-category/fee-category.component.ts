import { Component, TemplateRef, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NgbModalRef, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { Constants } from 'src/app/Constants/constants';
import { ApiService } from 'src/app/services/api.service';
import { UtilityService } from 'src/app/services/utility.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-fee-category',
  templateUrl: './fee-category.component.html',
  styleUrls: ['./fee-category.component.scss']
})
export class FeeCategoryComponent {
  addFeeCategoryForm: FormGroup;
  modalReference: NgbModalRef;
  pageLimit = Constants.PAGE_LIMIT;
  currentPage = Constants.STARTING_PAGE;
  totalItems: number;
  feeCategoryList: any = [];
  @ViewChild('FeeCategory', { static: false })
  FeeCategory: TemplateRef<any>;
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
    modalDialogClass: 'modal-xl',
  };
  constructor(
    private modalService: NgbModal,
    private formBuilder: FormBuilder,
    private apiService: ApiService,
    private utils: UtilityService
  ) { }

  async ngOnInit() {
    await this.getFeeCategoryMasterList();
  }

  async getFeeCategoryMasterList() {
    this.utils.showLoading();
    const queryList = `?search=${this.searchString}&page=${this.currentPage}&limit=${this.pageLimit}&sort=${this.sort}&orderby=${this.orderBy}`;
    const response: any = await this.apiService.getFeeCategoryMaster(queryList);
    if (response.statusCode === 200) {
      this.feeCategoryList = response.data.result;
      this.totalItems = response.data.totalCount;
    }
    this.utils.hideLoading();
  }

  onPageChange = async (page: any) => {
    this.currentPage = page;
    this.getFeeCategoryMasterList();
  };

  onModalOpen() {
    this.formInit();
    this.modalReference = this.modalService.open(this.FeeCategory, this.config);
    this.modalReference.hidden.subscribe(() => {
      this.onModalClose();
    });
  }

  formInit() {
    this.addFeeCategoryForm = this.formBuilder.group({
      name: ['', [Validators.required]],
      status: ['true', Validators.required],
    });
  }

  get form() {
    return this.addFeeCategoryForm.controls;
  }

  async onSubmit() {
    try {
      this.isSubmitted = true;
      if (this.addFeeCategoryForm.valid) {
        this.utils.showLoading();
        const obj = {
          name: this.addFeeCategoryForm.controls['name'].value,
          isActive: this.addFeeCategoryForm.controls['status'].value == 'true' ? true : false,
        };
        this.EditId ? (obj['id'] = this.EditId) : '';
        const response: any = await this.apiService.addFeeCategory(obj);
        this.utils.hideLoading();
        if (response.statusCode === 200) {
          this.utils.showSuccessToast(response.message);
          this.onModalClose();
          this.getFeeCategoryMasterList();
          this.addFeeCategoryForm.reset();
        }
      } else {
        this.addFeeCategoryForm.markAllAsTouched();
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

  async editFeeCategory(category) {
    this.EditId = category._id;
    this.onModalOpen();
    this.addFeeCategoryForm.patchValue({
      name: category.name,
      status: category.isActive.toString()
    })
  }

  deleteFeecategory(id) {
    Swal.fire({
      icon: 'warning',
      title: 'Are you sure?',
      text: 'You will not be able to recover this fee category master !',
      showCancelButton: true,
      confirmButtonText: 'Yes, delete it!',
      confirmButtonColor: '#6259ca',
      cancelButtonText: 'No, cancel it!',
      cancelButtonColor: '#6259ca',
      reverseButtons: true,
    }).then(async (result: any) => {
      if (result.isConfirmed) {
        const response: any = await this.apiService.deleteFeeCategoryMaster(id);
        if ((response.statusCode = 200)) {
          Swal.fire({
            title: 'Deleted!',
            text: 'Your Fee Category Master deleted.',
            icon: 'success',
            confirmButtonColor: '#6259ca',
          });
          await this.getFeeCategoryMasterList();
        }
      } else if (result.dismiss === Swal.DismissReason.cancel) {
        Swal.fire({
          title: 'Cancelled!',
          text: 'Your Fee Category Master is safe :)',
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
    this.getFeeCategoryMasterList();
  }
}
