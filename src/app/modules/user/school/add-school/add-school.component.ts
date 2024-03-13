import { HttpClient } from '@angular/common/http';
import { Component, OnInit, TemplateRef, ViewChild } from '@angular/core';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from '@angular/forms';
import { NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import * as moment from 'moment';
import { ToastrService } from 'ngx-toastr';
import { Constants, ERROR } from 'src/app/Constants/constants';
import { ApiService } from 'src/app/services/api.service';
import { ExportService } from 'src/app/services/export-service.service';
import { UtilityService } from 'src/app/services/utility.service';
import { NoSpace } from 'src/app/shared/validations/no-space.validator';

@Component({
  selector: 'app-add-school',
  templateUrl: './add-school.component.html',
  styleUrls: ['./add-school.component.scss'],
})
export class AddSchoolComponent implements OnInit {
  addSchoolForm: FormGroup;
  modalReference: NgbModalRef;
  imagemodalReference: NgbModalRef;
  pageLimit = Constants.PAGE_LIMIT;
  currentPage = Constants.STARTING_PAGE;
  totalItems: number;
  schoolList: any = [];
  @ViewChild('addSchool', { static: false }) addSchool: TemplateRef<any>;
  @ViewChild('imageCropper', { static: false }) imageCropper: TemplateRef<any>;
  @ViewChild('viewSchoolAadhar', { static: false })
  viewSchoolAadhar: TemplateRef<any>;
  @ViewChild('viewSchoolList', { static: false })
  viewSchoolList: TemplateRef<any>;

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
  schoolId: any = null;
  isEdit = false;
  imgUrl: any;
  isImgEdit = false;
  imageChangedEvent: any;
  file;
  fileCrop;
  aadharList: any;
  indexList: any;
  orderBy: any = 'created_at';
  sort = 'DESC'
  isAscending = false

  constructor(
    private modalService: NgbModal,
    private formBuilder: FormBuilder,
    private apiService: ApiService,
    private utils: UtilityService,
    private toastr: ToastrService,
    private exportService:ExportService,
    public http: HttpClient
  ) { }

  async ngOnInit() {
    await this.getSchoolList();
  }

  togglePasswordVisibility() {
    this.showPassword = !this.showPassword;
  }

  async getSchoolList(isExport=false) {
    this.utils.showLoading();
    let queryList = `?page=${this.currentPage}&limit=${this.pageLimit}&search=${this.searchString}&sort=${this.sort}&orderby=${this.orderBy}`;
    if (isExport) {
      queryList += `&skip_pagination=true`;
    }
    const response: any = await this.apiService.getSchoolList(queryList);
    if (!isExport && response.statusCode === 200) {
      this.schoolList = response.data.result;
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
    this.getSchoolList();
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
    this.modalReference = this.modalService.open(this.addSchool, this.config);
  }

  formInit() {
    this.addSchoolForm = this.formBuilder.group({
      name: ['', [Validators.required, NoSpace()]],
      location: ['', [Validators.required, NoSpace()]],
      mobile: [
        '',
        [
          Validators.required,
          Validators.min(1000000000),
          Validators.max(9999999999),
        ],
      ],
      latitude: ['', [Validators.required, NoSpace()]],
      longitude: ['', [Validators.required, NoSpace()]],
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(8)]],
      city: ['', [Validators.required, NoSpace()]],
      state: ['', [Validators.required, NoSpace()]],
      country: ['', [Validators.required, NoSpace()]],
      address: ['', [Validators.required, NoSpace()]],
      short_code: ['', [Validators.required, NoSpace()]],
      branch_name: ['', [Validators.required, NoSpace()]],
      week_off_days: [null, Validators.required]
    });
  }

  get form() {
    return this.addSchoolForm.controls;
  }

  async onSubmit() {
    try {
      this.isSubmitted = true;
      if (this.filesPreview.length == 0) {
        this.isImageSelected = true;
        return;
      }
      if (this.addSchoolForm.invalid) {
        return;
      }
      const profileImg: any = await this.getPresignUrl();
      if (profileImg) {
        this.utils.showLoading();
        const response: any = await this.apiService.addSchool({
          ...this.addSchoolForm.value,
          logo: profileImg,
          mobile: this.addSchoolForm.value.mobile.toString(),
          week_off_days: this.addSchoolForm.value.week_off_days.toString()
        });
        this.utils.hideLoading();
        if (response.statusCode === 200) {
          this.utils.showSuccessToast(response.message);
          this.filesPreview = [];
          this.isImageSelected = false;
          this.onModalClose();
          this.getSchoolList();
        }
      }
    } catch (error) {
      this.utils.hideLoading();
    }
  }

  onModalClose() {
    if (this.isEdit)
      this.addSchoolForm.addControl(
        'password',
        new FormControl('', Validators.required)
      );
    this.imgUrl = null;
    this.isEdit = false;
    this.isImgEdit = false;
    this.isSubmitted = false;
    this.modalReference.close();
    this.isImageSelected = false;
    this.filesPreview = [];
  }

  onPreviewFileSelect(event: any): void {
    this.file = event.addedFiles[0];
    if (this.file) {
      this.imageChangedEvent = event.addedFiles[0];
      this.modalReference.update({ windowClass: 'hideMainModal' })
      this.imagemodalReference = this.modalService.open(this.imageCropper, {
        ...this.config,
        backdrop: false,
        centered: true,
        modalDialogClass: 'image-cropper',
      });
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
      const file = new File([this.fileCrop.blob], this.file.name, {
        type: this.file.type,
      });
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
    const response: any = await this.apiService.schoolPresignedUrl(obj);
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
    this.schoolId = data.id;
    this.onModalOpen();
    const queryList = `?id=${this.schoolId}`;
    const response: any = await this.apiService.getSchoolList(queryList);
    this.addSchoolForm.patchValue({ ...response.data, week_off_days: response.data.week_off_days?.split(',') });
    this.imgUrl = response.data.logo;
    this.addSchoolForm.removeControl('password');
    this.addSchoolForm.controls['email'].disable();
    this.isEdit = true;
  }

  async onEditSubmit() {
    try {
      this.isSubmitted = true;
      if (this.addSchoolForm.invalid) {
        return;
      }
      if (this.isImgEdit) {
        this.imgUrl = await this.getPresignUrl();
      }
      this.utils.showLoading();
      const response: any = await this.apiService.updateSchool({
        ...this.addSchoolForm.value,
        logo: this.imgUrl,
        mobile: this.addSchoolForm.value.mobile.toString(),
        id: this.schoolId,
        week_off_days: this.addSchoolForm.value.week_off_days.toString()
      });
      this.utils.hideLoading();
      if (response.statusCode === 200) {
        this.utils.showSuccessToast(response.message);
        this.filesPreview = [];
        this.isImageSelected = false;
        this.onModalClose();
        this.getSchoolList();
      }
    } catch (error) {
      this.utils.hideLoading();
    }
  }
  async onViewAadhar(schoolId, id) {
    this.modalReference = this.modalService.open(
      this.viewSchoolAadhar,
      this.config
    );
    const queryList = `?id=${id}&school_id=${schoolId}`;
    const response: any = await this.apiService.getSchoolList(queryList);
    this.aadharList = response.data.aadhar_diase_number;
  }
  async onViewIndex(schoolId, id) {
    this.modalReference = this.modalService.open(
      this.viewSchoolList,
      this.config
    );
    const queryList = `?id=${id}&school_id=${schoolId}`;
    const response: any = await this.apiService.getSchoolList(queryList);
    this.indexList = response.data.school_index_number;
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
    this.getSchoolList();
  }
  async exportAll(exportType ){
    const data: any = [];
    const headerRow = [
      "School Logo",
      "School Name",
      "Email",
      "Mobile",
      "Location",
      "Latitude",
      "Longitude",
      "Created at",
    ]
    const format = {
      0: { cellWidth: 40 },
      1: { cellWidth: 25 },
      2: { cellWidth: 25 },
      3: { cellWidth: 25 },
      4: { cellWidth: 15 },
      5: { cellWidth: 15 },
      6: { cellWidth: 15 },
      7: { cellWidth: 30 },
    };
    if (exportType != "pdf") {
      data.push(headerRow);
    }
    const arr: any = await this.getSchoolList(true);
    for (const item of arr) {
      const rowData = [        
        item.logo||"-",
        item.name||"-",
        item.email||"-",
        item.mobile||"-",
        item.location||"-",
        item.latitude||"-",
        item.longitude||"-",
        moment(item.created_at).format("YYYY-MM-DD hh:mm A")||"-",
      ]
      data.push(rowData);
    }
    this.exportService.exportData(
      exportType,
      headerRow,
      data,
      `Exported School List${ moment().format("YYYY-MM-DD")}`,
      format
    );
  }
}
