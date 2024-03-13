import { Component, TemplateRef, ViewChild } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { NgbModalRef, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import * as moment from 'moment';
import { Constants, ERROR } from 'src/app/Constants/constants';
import { ApiService } from 'src/app/services/api.service';
import { ExportService } from 'src/app/services/export-service.service';
import { UtilityService } from 'src/app/services/utility.service';
import { NoSpace } from 'src/app/shared/validations/no-space.validator';
import { environment } from 'src/environments/environment';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-add-subject-material-type',
  templateUrl: './add-subject-material-type.component.html',
  styleUrls: ['./add-subject-material-type.component.scss']
})
export class AddSubjectMaterialTypeComponent {
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
  sort = 'DESC'
  isAscending = false
  config = {
    backdrop: true,
    ignoreBackdropClick: true,
    class: 'modal-md',
    centered: true,
    modalDialogClass: 'modal-xl',
  };
  filesPreview: any = [];
  isImgEdit = false;
  imgUrl: any;
  mediaUrl = environment.MEDIA_URL;

  constructor(
    private modalService: NgbModal,
    private formBuilder: FormBuilder,
    private apiService: ApiService,
    private exportService:ExportService,
    private utils: UtilityService
  ) { }

  async ngOnInit() {
    await this.getSubjectMaterialType();
  }

  async getSubjectMaterialType(isExport=false) {
    this.utils.showLoading();
    let queryList = `?search=${this.searchString}&page=${this.currentPage}&limit=${this.pageLimit}&sort=${this.sort}&orderby=${this.orderBy}`;
    if (isExport) {
      queryList += `&skip_pagination=true`;
    }
    const response: any = await this.apiService.getSubjectMaterialType(queryList);
    if (!isExport &&response.statusCode === 200) {
      this.list = response.data.result;
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
    this.getSubjectMaterialType();
  };
  onModalOpen() {
    this.formInit();
    this.modalReference = this.modalService.open(this.addTemp, this.config);
    this.modalReference.hidden.subscribe(() => {
      this.onModalClose();
    });
  }
  formInit() {
    this.addForm = this.formBuilder.group({
      name: ['', [Validators.required, NoSpace()]],
      is_active: ['true', Validators.required],
      type: [null, Validators.required],
      // link: ['', [NoSpace()]]
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
      const formData = new FormData()
      formData.append('name', this.addForm.value.name);
      formData.append('is_active', this.addForm.value.is_active);
      formData.append('type', this.addForm.value.type);
      let response: any;
      if (this.EditId) {
        response = await this.apiService.updateSubjectMaterialType(this.EditId, formData);
      } else {
        response = await this.apiService.addSubjectMaterialType(formData);
      }
      if (response.statusCode === 200) {
        this.utils.showSuccessToast(response.message);
        this.onModalClose();
        this.getSubjectMaterialType();
      }
      this.utils.hideLoading();
    } catch (error) {
      this.utils.hideLoading();
    }
  }
  onModalClose() {
    this.isSubmitted = false;
    this.filesPreview = []
    this.EditId = null;
    this.modalReference.close();
  }
  async editTask(id) {
    this.EditId = id;
    this.onModalOpen();
    const response: any = await this.apiService.getByIdSubjectMaterialType(id);
    if ((response.statusCode = 200)) {
      // this.imgUrl = response.data.attachment_url ? this.mediaUrl + response.data.attachment_url : null;
      this.addForm.controls['name'].setValue(response.data.name);
      // this.addForm.controls['link'].setValue(
      //   response.data.link
      // );
      this.addForm.controls['type'].setValue(response.data.material_type);
      this.addForm.controls['is_active'].setValue(
        response.data.is_active.toString()
      );
    }
  }

  deleteTask(id) {
    Swal.fire({
      icon: 'warning',
      title: 'Are you sure?',
      text: 'You will not be able to recover this subject material type !',
      showCancelButton: true,
      confirmButtonText: 'Yes, delete it!',
      confirmButtonColor: '#6259ca',
      cancelButtonText: 'No, cancel it!',
      cancelButtonColor: '#6259ca',
      reverseButtons: true,
    }).then(async (result: any) => {
      if (result.isConfirmed) {
        const response: any = await this.apiService.deleteSubjectMaterialType(id);
        if ((response.statusCode = 200)) {
          Swal.fire({
            title: 'Deleted!',
            text: 'Your subject material type has been deleted.',
            icon: 'success',
            confirmButtonColor: '#6259ca',
          });
          await this.getSubjectMaterialType();
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
      this.sort = this.isAscending ? 'ASC' : 'DESC'
    } else {
      this.isAscending = true;
      this.sort = 'ASC'
    }
    this.orderBy = columnName;
    this.getSubjectMaterialType();
  }

  onPreviewFileSelect(event: any): void {
    this.filesPreview = event.addedFiles;
    if (this.filesPreview[0]) {
      if (this.EditId) {
        this.isImgEdit = true;
      }
    } else {
      this.filesPreview = [];
      this.utils.showErrorToast(ERROR.IMAGE_ERROR);
    }
  }

  onPreviewFileRemove(event: any) {
    if (this.EditId) {
      this.isImgEdit = false;
    }
    this.filesPreview.splice(this.filesPreview.indexOf(event), 1);
  }

  async exportAll(exportType ){
    const data: any = [];
    const headerRow = [ 
      "Subject Material Type",
      "Field",
      "Status",
      "Date & Time "
   ]
    if (exportType != "pdf") {
      data.push(headerRow);
    }
    const arr: any = await this.getSubjectMaterialType(true);
    for (const item of arr) {
      const rowData = [
        item.name||"-",
        item.material_type==0?'Link' : 'Attachment'||"-",
        item.is_active ? "Active" : "In Active"||"-",
        moment(item.created_at).format("YYYY-MM-DD hh:mm A")||"-",
      ]
      data.push(rowData);
    }
    this.exportService.exportData(
      exportType,
      headerRow,
      data,
      `Exported Subject Wise Chapter Planning List${ moment().format("YYYY-MM-DD")}`
    );
  }
}
