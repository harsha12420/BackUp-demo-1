import { HttpClient } from '@angular/common/http';
import { Component, TemplateRef, ViewChild } from '@angular/core';
import { FormGroup, FormBuilder, Validators, FormControl } from '@angular/forms';
import { NgbModalRef, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import * as moment from 'moment';
import { ToastrService } from 'ngx-toastr';
import { Constants, ERROR } from 'src/app/Constants/constants';
import { ApiService } from 'src/app/services/api.service';
import { ExportService } from 'src/app/services/export-service.service';
import { UtilityService } from 'src/app/services/utility.service';
import { NoSpace } from 'src/app/shared/validations/no-space.validator';

@Component({
  selector: 'app-add-organization',
  templateUrl: './add-organization.component.html',
  styleUrls: ['./add-organization.component.scss']
})
export class AddOrganizationComponent {
  addOrganizationForm: FormGroup;
  modalReference: NgbModalRef;
  imagemodalReference: NgbModalRef;
  pageLimit = Constants.PAGE_LIMIT;
  currentPage = Constants.STARTING_PAGE;
  orderBy: any = 'created_at';
  sort = 'DESC'
  totalItems: number;
  organizationList: any = [];
  @ViewChild('addOrganization', { static: false }) addOrganization: TemplateRef<any>;
  @ViewChild('imageCropper', { static: false }) imageCropper: TemplateRef<any>;
  isSubmitted = false;
  config = {
    backdrop: true,
    ignoreBackdropClick: true,
    class: 'modal-md',
    centered: true,
    modalDialogClass: 'modal-xl',
  };
  searchString = '';
  filesPreview: any = [];
  isImageSelected: boolean = false;
  showPassword = false;
  organizationId: any = null;
  isEdit = false
  imgUrl: any
  isImgEdit = false;
  imageChangedEvent: any;
  file
  fileCrop
  isAscending = false
  constructor(
    private modalService: NgbModal,
    private formBuilder: FormBuilder,
    private apiService: ApiService,
    private utils: UtilityService,
    private exportService:ExportService,
    private toastr: ToastrService,
    public http: HttpClient
  ) { }

  async ngOnInit() {
    await this.getOrganizationList();
  }

  togglePasswordVisibility() {
    this.showPassword = !this.showPassword;
  }

  async getOrganizationList(isExport=false) {
    this.utils.showLoading();
    let queryList = `?page=${this.currentPage}&limit=${this.pageLimit}&sort=${this.sort}&search=${this.searchString}&orderby=${this.orderBy}`;
    if (isExport) {
      queryList += `&skip_pagination=true`;
    } 
    const response: any = await this.apiService.getOrganizationList(queryList);
    if (!isExport && response.statusCode === 200) {
      this.organizationList = response.data.result;
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
    this.getOrganizationList();
  };

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

  onModalOpen() {
    this.formInit();
    this.modalReference = this.modalService.open(this.addOrganization, this.config);
  }

  formInit() {
    this.addOrganizationForm = this.formBuilder.group({
      name: ['', [Validators.required, NoSpace()]],
      mobile: [
        '',
        [
          Validators.required,
          Validators.min(1000000000),
          Validators.max(9999999999),
        ],
      ],
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(8)]],
      first_name: ['', [Validators.required, NoSpace()]],
      middle_name: ['', [NoSpace()]],
      last_name: ['', [Validators.required, NoSpace()]],
    });
  }

  get form() {
    return this.addOrganizationForm.controls;
  }

  async onSubmit() {
    try {
      this.isSubmitted = true;
      if (this.filesPreview.length == 0) {
        this.isImageSelected = true;
        return;
      }
      if (this.addOrganizationForm.invalid) {
        return;
      }
      const profileImg: any = await this.getPresignUrl();
      if (profileImg) {
        this.utils.showLoading();
        const response: any = await this.apiService.addOrganization({
          ...this.addOrganizationForm.value,
          logo: profileImg,
          mobile: this.addOrganizationForm.value.mobile.toString(),
        });
        this.utils.hideLoading();
        if (response.statusCode === 200) {
          this.utils.showSuccessToast(response.message);
          this.filesPreview = [];
          this.isImageSelected = false;
          this.onModalClose();
          this.getOrganizationList();
        }
      }
    } catch (error) {
      this.utils.hideLoading();
    }
  }

  onModalClose() {
    if (this.isEdit) this.addOrganizationForm.addControl('password', new FormControl('', Validators.required))
    this.imgUrl = null;
    this.isEdit = false
    this.isImgEdit = false
    this.isSubmitted = false;
    this.modalReference.close();
    this.isImageSelected = false
    this.filesPreview = [];
  }

  onPreviewFileSelect(event: any): void {
    this.file = event.addedFiles[0];
    if (this.file) {
      this.imageChangedEvent = event.addedFiles[0];
      this.modalReference.update({ windowClass: 'hideMainModal' })
      this.imagemodalReference = this.modalService.open(this.imageCropper, { ...this.config, centered: false, modalDialogClass: 'image-cropper' });
      this.imagemodalReference.hidden.subscribe(() => {
        this.modalReference.update({ windowClass: '' })
      })
      this.isImageSelected = false;
    } else {
      this.isImageSelected = true;
      this.toastr.error(ERROR.IMAGE_ERROR);
    }
  }

  async imageCropped(event: any) {
    this.fileCrop = event;
  }
  async onSave() {
    try {
      this.utils.showLoading();
      const file = new File([this.fileCrop.blob], this.file.name, { type: this.file.type });
      const image = await this.utils.compressImage(file);
      this.filesPreview = [image];
      if (this.isEdit) {
        this.isImgEdit = true;
      }
      this.utils.hideLoading();
      this.imagemodalReference.close();
    } catch (error) {
      this.filesPreview = [];
      this.utils.hideLoading();
    }
  }

  onPreviewFileRemove(event: any) {
    if (this.isEdit) {
      this.isImgEdit = false;
    } else {
      this.isImageSelected = true;
    }
    this.filesPreview.splice(this.filesPreview.indexOf(event), 1);
  }

  async getPresignUrl() {
    let ImgUrl = '';
    const obj = {
      file_name: this.filesPreview[0].name,
      ContentType: this.filesPreview[0].type,
    };
    const response: any = await this.apiService.organizationPresignedUrl(obj);
    if (response.statusCode == 200) {
      ImgUrl = response.data.url;
      const formData = new FormData();
      formData.append('file', this.filesPreview[0]);
      return new Promise((resolve, reject) => {
        this.http.put(ImgUrl, this.filesPreview[0]).subscribe(
          (res) => {
            this.isImageSelected = false;
            resolve(ImgUrl);
          },
          (err) => {
            reject();
          }
        );
      });
    }
  }
  onPressAllowNumber(event: any) {
    if (event.key == 'Tab') {
      return true;
    } else {
      let keyChar = String.fromCharCode(event.keyCode);
      let re = /[0-9]/;
      return re.test(keyChar);
    }
  }

  async onEdit(data: any) {
    this.organizationId = data.id;
    this.onModalOpen();
    const queryList = `?id=${this.organizationId}`;
    const response: any = await this.apiService.getOrganizationList(queryList);
    this.addOrganizationForm.patchValue({ ...response.data });
    this.imgUrl = response.data.logo;
    this.addOrganizationForm.removeControl('password');
    this.addOrganizationForm.controls['email'].disable();
    this.isEdit = true;
  }

  async onEditSubmit() {

    try {
      this.isSubmitted = true;
      if (this.addOrganizationForm.invalid) {
        return;
      }
      if (this.isImgEdit) {
        this.imgUrl = await this.getPresignUrl();
      }
      this.utils.showLoading();
      const response: any = await this.apiService.updateOrganization({
        ...this.addOrganizationForm.value,
        logo: this.imgUrl,
        mobile: this.addOrganizationForm.value.mobile.toString(),
        id: this.organizationId
      });
      this.utils.hideLoading();
      if (response.statusCode === 200) {
        this.utils.showSuccessToast(response.message);
        this.filesPreview = [];
        this.isImageSelected = false;
        this.onModalClose();
        this.getOrganizationList();
      }
    } catch (error) {
      this.utils.hideLoading();
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
    this.getOrganizationList();
  }

  async exportAll(exportType ){
    const data: any = [];
    const headerRow = [ 
      "Organization Logo",
      "Organization Name",
      "Full Name",
      "Email",
      "Mobile",
      "Created At",
   ]
   const format = {
    0: { cellWidth: 40 },
    1: { cellWidth: 25 },
    2: { cellWidth: 40 },
    3: { cellWidth: 30 },
    4: { cellWidth: 30 },
    5: { cellWidth: 30 },
  };
    if (exportType != "pdf") {
      data.push(headerRow);
    }
    const arr: any = await this.getOrganizationList(true);
    for (const item of arr) {
      const rowData = [
        item.logo||"-",
        item.name||"-",
        item.first_name+item.middle_name+item.last_name||"-",
        item.email||"-",
        item.mobile||"-",
        moment(item.created_at).format("YYYY-MM-DD hh:mm A")||"-",
      ]
      data.push(rowData);
    }
    this.exportService.exportData(
      exportType,
      headerRow,
      data,
      `Exported Organization List${ moment().format("YYYY-MM-DD")}`,
      format
    );
  }
}
