import { Component, TemplateRef, ViewChild } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { NgbModalRef, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import * as moment from 'moment';
import { Constants } from 'src/app/Constants/constants';
import { ApiService } from 'src/app/services/api.service';
import { ExportService } from 'src/app/services/export-service.service';
import { UtilityService } from 'src/app/services/utility.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-add-subject-material-type-category',
  templateUrl: './add-subject-material-type-category.component.html',
  styleUrls: ['./add-subject-material-type-category.component.scss'],
})
export class AddSubjectMaterialTypeCategoryComponent {
  addForm: FormGroup;
  modalReference: NgbModalRef;
  pageLimit = Constants.PAGE_LIMIT;
  currentPage = Constants.STARTING_PAGE;
  totalItems: number;
  list: any = [];
  @ViewChild('addTemp', { static: false }) addTemp: TemplateRef<any>;
  isSubmitted = false;
  EditId: any;
  searchString = '';
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
  mediumList: any = [];
  standardList: any = [];
  subjectMaterialTypeList: any = [];
  subjectCategoryList: any = [];
  mediumId: any;
  standardId: any;

  constructor(
    private modalService: NgbModal,
    private formBuilder: FormBuilder,
    private apiService: ApiService,
    private exportService: ExportService,
    private utils: UtilityService
  ) {}

  async ngOnInit() {
    await this.getSubjectMaterialTypeCategory();
  }

  async getSubjectMaterialTypeCategory(isExport = false) {
    this.utils.showLoading();
    let queryList = `?search=${this.searchString}&page=${this.currentPage}&limit=${this.pageLimit}&sort=${this.sort}&orderby=${this.orderBy}`;
    if (isExport) {
      queryList += `&skip_pagination=true`;
    }
    const response: any = await this.apiService.getSubjectMaterialTypeCategory(
      queryList
    );
    if (!isExport && response.statusCode === 200) {
      this.list = response.data.result;
      this.totalItems = response.data.totalCount;
    } else if (isExport && response.statusCode === 200) {
      this.utils.hideLoading();
      return response.data.result;
    }
    this.utils.hideLoading();
  }

  onPageChange = async (page: any) => {
    this.currentPage = page;
    this.getSubjectMaterialTypeCategory();
  };
  onModalOpen() {
    this.formInit();
    this.getMediumList();
    this.getSubjectCategoryList();
    this.getSubjectMaterialType();
    this.modalReference = this.modalService.open(this.addTemp, this.config);
    this.modalReference.hidden.subscribe(() => {
      this.onModalClose();
    });
  }
  formInit() {
    this.addForm = this.formBuilder.group({
      medium_id: [null, Validators.required],
      standard_id: [null, Validators.required],
      subject_material_type_id: [null, Validators.required],
      category_id: [null, Validators.required],
      is_active: ['true', Validators.required],
    });
  }
  get form() {
    return this.addForm.controls;
  }
  async onSubmit() {
    try {
      this.isSubmitted = true;
      if (this.addForm.invalid) {
        return;
      }
      this.utils.showLoading();
      const obj = {
        medium_id: this.mediumId,
        standard_id: this.standardId,
        subject_material_type_id: +this.addForm.value.subject_material_type_id,
        category_id: +this.addForm.value.category_id,
        isActive:
          this.addForm.controls['is_active'].value == 'true' ? true : false,
      };
      this.EditId ? (obj['id'] = this.EditId) : '';
      const response: any =
        await this.apiService.updateSubjectMaterialTypeCategory(obj);
      if (response.statusCode === 200) {
        this.utils.showSuccessToast(response.message);
        this.onModalClose();
        this.getSubjectMaterialTypeCategory();
      }
      this.utils.hideLoading();
    } catch (error) {
      this.utils.hideLoading();
    }
  }
  onModalClose() {
    this.isSubmitted = false;
    this.EditId = null;
    this.modalReference.close();
  }
  async editTask(id) {
    this.EditId = id;
    this.onModalOpen();
    const response: any =
      await this.apiService.getByIdSubjectMaterialTypeCategory(id);
    if ((response.statusCode = 200)) {
      const obj = {
        medium_id: response.data.medium_id.toString(),
        standard_id: response.data.standard_id.toString(),
        subject_material_type_id:
          response.data.subject_material_type_id.toString(),
        category_id: response.data.category_id.toString(),
        is_active: response.data.is_active.toString(),
      };
      this.mediumId = response.data.medium_id;
      this.standardId = response.data.standard_id;
      this.addForm.patchValue(obj);
      this.getStandardList();
    }
  }

  deleteTask(id) {
    Swal.fire({
      icon: 'warning',
      title: 'Are you sure?',
      text: 'You will not be able to recover this subject material type category !',
      showCancelButton: true,
      confirmButtonText: 'Yes, delete it!',
      confirmButtonColor: '#6259ca',
      cancelButtonText: 'No, cancel it!',
      cancelButtonColor: '#6259ca',
      reverseButtons: true,
    }).then(async (result: any) => {
      if (result.isConfirmed) {
        const response: any =
          await this.apiService.deleteSubjectMaterialTypeCategory(id);
        if ((response.statusCode = 200)) {
          Swal.fire({
            title: 'Deleted!',
            text: 'Your subject material type category has been deleted.',
            icon: 'success',
            confirmButtonColor: '#6259ca',
          });
          await this.getSubjectMaterialTypeCategory();
        }
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
    this.getSubjectMaterialTypeCategory();
  }

  async getSubjectMaterialType() {
    this.utils.showLoading();
    const queryList = `?skip_pagination=${true}&sort=DESC`;
    const response: any = await this.apiService.getSubjectMaterialType(
      queryList
    );
    if (response.statusCode === 200) {
      this.subjectMaterialTypeList = response.data.result;
    }
    this.utils.hideLoading();
  }

  async getMediumList() {
    const queryList = `?skip_pagination=${true}&sort=DESC`;
    const response: any = await this.apiService.getMediumList(queryList);
    if (response.statusCode === 200) {
      this.mediumList = response.data.result;
    }
  }

  // async getStandardList() {
  //   const queryList = `?skip_pagination=${true}&sort=DESC`;
  //   const response: any = await this.apiService.getStandardList(queryList);
  //   if (response.statusCode === 200) {
  //     this.standardList = response.data.result;
  //   }
  // }

  async getSubjectCategoryList() {
    const queryList = `?skip_pagination=${true}&sort=DESC`;
    const response: any = await this.apiService.getSubjectCategoryList(
      queryList
    );
    if (response.statusCode === 200) {
      this.subjectCategoryList = response.data.result;
    }
  }
  async exportAll(exportType) {
    const data: any = [];
    const headerRow = [
      'Medium',
      'Standard',
      'Subject Material Type',
      'Subject Category',
      'Status',
      'Date & Time',
    ];
    if (exportType != 'pdf') {
      data.push(headerRow);
    }
    const arr: any = await this.getSubjectMaterialTypeCategory(true);
    for (const item of arr) {
      const rowData = [
        item.medium_name || '-',
        item.standard_name || '-',
        item.subject_material_type || '-',
        item.category_name || '-',
        item.is_active ? 'Active' : 'In Active' || '-',
        moment(item.created_at).format('YYYY-MM-DD hh:mm A') || '-',
      ];
      data.push(rowData);
    }
    this.exportService.exportData(
      exportType,
      headerRow,
      data,
      `Exported Subject Material Type Category List${moment().format(
        'YYYY-MM-DD'
      )}`
    );
  }

  medium(event) {
    if (event) {
      this.addForm.controls['standard_id'].setValue(null);
      this.mediumId = +event;

      this.getStandardList();
    }
  }

  standard(event) {
    if (event) {
      this.standardId = +event;
    }
  }
  async getStandardList() {
    let queryList = this.mediumId;
    const response: any = await this.apiService.getStandardListById(queryList);
    if (response.statusCode === 200) {
      this.standardList = response.data.result;
    }
  }
}
