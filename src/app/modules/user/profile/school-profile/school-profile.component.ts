import { HttpClient } from '@angular/common/http';
import {
  Component,
  EventEmitter,
  Input,
  Output,
  TemplateRef,
  ViewChild,
} from '@angular/core';
import { FormGroup, FormBuilder, Validators, FormArray } from '@angular/forms';
import { NgbModalRef, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ToastrService } from 'ngx-toastr';
import { ERROR } from 'src/app/Constants/constants';
import { ApiService } from 'src/app/services/api.service';
import { EncryptDecryptUserroleService } from 'src/app/services/encrypt-decrypt-userrole.service';
import { UtilityService } from 'src/app/services/utility.service';
import { NoSpace } from 'src/app/shared/validations/no-space.validator';

@Component({
  selector: 'app-school-profile',
  templateUrl: './school-profile.component.html',
  styleUrls: ['./school-profile.component.scss'],
})
export class SchoolProfileComponent {
  editSchoolForm: FormGroup;
  imagemodalReference: NgbModalRef;
  schoolList: any = [];
  @ViewChild('imageCropper', { static: false }) imageCropper: TemplateRef<any>;
  userRole;
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
  imgUrl: any;
  isImgEdit = false;
  imageChangedEvent: any;
  file;
  fileCrop;
  isEdit = false;
  mediumList: any = [];
  standardList: any = [];
  mediumId: any = null;
  isIndexSubmitted = false;
  isAadharSubmitted = false;
  currentIndexArray: any = [];
  currentAadharArray: any = [];
  masterArray: any = [];
  @Input('userProfile') userProfile: any;
  @Output() onEditEmitter: any = new EventEmitter();
  constructor(
    private modalService: NgbModal,
    private formBuilder: FormBuilder,
    private apiService: ApiService,
    private utils: UtilityService,
    public http: HttpClient,
    private toastr: ToastrService
  ) { }

  async ngOnInit() {
    this.onEdit();
    this.getMediumList();
  }

  formInit() {
    this.editSchoolForm = this.formBuilder.group({
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
      city: ['', [Validators.required, NoSpace()]],
      state: ['', [Validators.required, NoSpace()]],
      country: ['', [Validators.required, NoSpace()]],
      address: ['', [Validators.required, NoSpace()]],
      short_code: ['', [Validators.required, NoSpace()]],
      branch_name: ['', [Validators.required, NoSpace()]],
      index_ids: this.formBuilder.array([]),
      aadhar_ids: this.formBuilder.array([]),
      week_off_days: [null, Validators.required],
    });
  }

  get form() {
    return this.editSchoolForm.controls;
  }

  newIndex() {
    return this.formBuilder.group({
      index_number: ['', [Validators.required]],
      medium_id: [null, Validators.required],
      standard_ids: [null, [Validators.required]],
    });
  }

  indexs(): FormArray {
    return this.editSchoolForm.controls['index_ids'] as FormArray;
  }

  addIndex() {
    if (this.indexs().valid) {
      this.indexs().push(this.newIndex());
    } else {
      this.isIndexSubmitted = true;
    }
  }

  removeIndex(index: number) {
    const value = this.editSchoolForm.value.index_ids[index];
    const indexNo = this.currentIndexArray.findIndex(
      (item) => item.mediumId == value?.medium_id
    );
    for (const item of value?.standard_ids || []) {
      const array = this.masterArray.find((ele) => ele.id.toString() == item);
      if (
        !this.currentIndexArray[indexNo].standardList.find(
          (item) => +item.id == array.id
        )
      )
        this.currentIndexArray[indexNo].standardList.push(array);
    }
    this.indexs().removeAt(index);
  }

  newAadhar() {
    return this.formBuilder.group({
      aadhar_diase_number: ['', [Validators.required]],
      medium_id: [null, Validators.required],
      standard_ids: [null, [Validators.required]],
    });
  }

  aadhars(): FormArray {
    return this.editSchoolForm.controls['aadhar_ids'] as FormArray;
  }

  addAadhar() {
    if (this.aadhars().valid) {
      this.aadhars().push(this.newAadhar());
    } else {
      this.isAadharSubmitted = true;
    }
  }

  removeAadhar(index: number) {
    const value = this.editSchoolForm.value.aadhar_ids[index];
    const indexNo = this.currentAadharArray.findIndex(
      (item) => item.mediumId == value?.medium_id
    );
    for (const item of value?.standard_ids || []) {
      const array = this.masterArray.find((ele) => ele.id.toString() == item);
      if (
        !this.currentAadharArray[indexNo].standardList.find(
          (item) => +item.id == array.id
        )
      )
        this.currentAadharArray[indexNo].standardList.push(array);
    }
    this.aadhars().removeAt(index);
  }

  async getMediumList() {
    const queryList = `?skip_pagination=${true}&sort=DESC`;
    const response: any = await this.apiService.getMediumList(queryList);
    if (response.statusCode === 200) {
      this.mediumList = response.data.result;
    }
  }

  async getStandard(type) {
    this.utils.showLoading();
    const response: any = await this.apiService.getStandardListById(
      this.mediumId
    );
    if (response.statusCode === 200) {
      this.standardList = response.data.result;
      if (type == 'index') {
        this.currentIndexArray.push({
          mediumId: this.mediumId,
          standardList: this.standardList,
        });
      } else {
        this.currentAadharArray.push({
          mediumId: this.mediumId,
          standardList: this.standardList,
        });
      }
      this.masterArray.push(...this.standardList);
    }
    this.utils.hideLoading();
  }

  medium(event, type) {
    this.mediumId = +event;
    if (type == 'index') {
      const a = this.currentIndexArray.find(
        (item: any) => item?.mediumId == event
      );
      if (a) return;
    } else {
      const b = this.currentAadharArray.find(
        (item: any) => item?.mediumId == event
      );
      if (b) return;
    }
    this.getStandard(type);
  }

  getStandardListIndex(ele: any): any[] {
    const mediumId = ele?.selectedValues[0];
    if (mediumId) {
      const array: any = this.currentIndexArray.find(
        (item: any) => item?.mediumId == mediumId
      );
      return array?.standardList || [];
    }
    return [];
  }

  getStandardListAadhar(ele: any): any[] {
    const mediumId = ele?.selectedValues[0];
    if (mediumId) {
      const array: any = this.currentAadharArray.find(
        (item: any) => item?.mediumId == mediumId
      );
      return array?.standardList || [];
    }
    return [];
  }

  async onSubmit() {
    try {
      this.isSubmitted = true;
      this.isAadharSubmitted = true;
      this.isIndexSubmitted = true;
      if (this.editSchoolForm.invalid) {
        return;
      }
      if (this.isImgEdit) {
        this.imgUrl = await this.getPresignUrl();
      }
      this.utils.showLoading();
      const response: any = await this.apiService.updateSchoolProfile({
        ...this.editSchoolForm.value,
        logo: this.imgUrl,
        mobile: this.editSchoolForm.value.mobile.toString(),
        week_off_days: this.editSchoolForm.value.week_off_days.toString(),
      });
      this.utils.hideLoading();
      if (response.statusCode === 200) {
        this.utils.showSuccessToast(response.message);
        this.isEdit = false;
        this.filesPreview = [];
        this.isImageSelected = false;
        this.imgUrl = null;
        this.isImgEdit = false;
        this.isSubmitted = false;
        this.isImageSelected = false;
        this.filesPreview = [];
        this.isAadharSubmitted = false;
        this.isIndexSubmitted = false;
        this.onEditEmitter.emit();
      }
    } catch (error) {
      this.utils.hideLoading();
    }
  }

  onPreviewFileSelect(event: any): void {
    this.file = event.addedFiles[0];
    if (this.file) {
      this.imageChangedEvent = event.addedFiles[0];
      this.imagemodalReference = this.modalService.open(this.imageCropper, {
        ...this.config,
        centered: true,
        modalDialogClass: 'image-cropper',
      });
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
    const file = new File([this.fileCrop.blob], this.file.name, {
      type: this.file.type,
    });
    const image = await this.utils.compressImage(file);
    this.filesPreview = [image];
    if (this.isEdit) {
      this.isImgEdit = true;
    }
    this.imagemodalReference.close();
  }

  onPreviewFileRemove(event: any) {
    if (this.isEdit) {
      this.isImgEdit = false;
    } else {
      this.isImageSelected = true;
    }
    this.filesPreview.splice(this.filesPreview.indexOf(event), 1);
  }

  async onEdit() {
    this.formInit();
    this.schoolId = this.userProfile.id;
    this.editSchoolForm.patchValue({ ...this.userProfile });

    this.editSchoolForm.patchValue({
      ...this.userProfile,
      week_off_days: this.userProfile.week_off_days?.split(','),
    });
    if (this.userProfile.school_index_number) {
      for (const item of this.userProfile.school_index_number) {
        let stdArray = item.standard_ids.map((item) => {
          return item.standard_id.toString();
        });
        const indexGroup = this.formBuilder.group({
          index_number: [item.index_number, [Validators.required]],
          medium_id: [item.medium_id.toString(), Validators.required],
          standard_ids: [stdArray, Validators.required], // Initialize standard_ids as an empty FormArray
        });
        const array = this.currentIndexArray.find(
          (ele: any) => ele?.mediumId == item.medium_id
        );
        this.mediumId = +item.medium_id;
        if (!array) await this.getStandard('index');
        setTimeout(() => {
          this.onStdChangeIndex(stdArray);
        }, 2000);
        this.indexs().push(indexGroup);
      }
    }

    if (this.userProfile.aadhar_diase_number) {
      for (const item of this.userProfile.aadhar_diase_number) {
        let stdArray = item.standard_ids.map((item) => {
          return item.standard_id.toString();
        });
        const aadharGroup = this.formBuilder.group({
          aadhar_diase_number: [
            item.aadhar_diase_number,
            [Validators.required],
          ],
          medium_id: [item.medium_id.toString(), Validators.required],
          standard_ids: [stdArray, Validators.required], // Initialize standard_ids as an empty FormArray
        });
        const array = this.currentAadharArray.find(
          (ele: any) => ele?.mediumId == item.medium_id
        );
        this.mediumId = +item.medium_id;
        if (!array) await this.getStandard('aadhar');
        setTimeout(() => {
          this.onStdChangeAadhar(stdArray);
        }, 2000);
        this.aadhars().push(aadharGroup);
      }
    }
    this.imgUrl = this.userProfile.image;
    this.editSchoolForm.controls['email'].disable();
    this.isEdit = true;
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

  removeSelectedElementIndex(e) {
    const array = this.masterArray.find((item) => item.id == e.value);
    const indexNo = this.currentIndexArray.findIndex(
      (item) => item.mediumId == array.medium_id
    );
    if (
      !this.currentIndexArray[indexNo].standardList.find(
        (item) => +item.id == array.id
      )
    )
      this.currentIndexArray[indexNo].standardList.push(array);
  }

  onStdChangeIndex(value) {
    for (const element of value) {
      const array = this.masterArray.find(
        (ele) => ele.id.toString() == element
      );
      const index = this.currentIndexArray.findIndex(
        (item) => item.mediumId == array.medium_id
      );
      const stdList = this.currentIndexArray[index]?.standardList
        ?.filter((item) => element != item.id.toString())
        .map((e) => {
          e.id = e.id.toString();
          return e;
        });
      this.currentIndexArray[index].standardList = stdList;
    }
  }

  removeSelectedElementAadhar(e) {
    const array = this.masterArray.find((item) => item.id == e.value);
    const indexNo = this.currentAadharArray.findIndex(
      (item) => item.mediumId == array.medium_id
    );
    if (
      !this.currentAadharArray[indexNo].standardList.find(
        (item) => +item.id == array.id
      )
    )
      this.currentAadharArray[indexNo].standardList.push(array);
  }

  onStdChangeAadhar(value) {
    for (const element of value) {
      const array = this.masterArray.find(
        (ele) => ele.id.toString() == element
      );
      const index = this.currentAadharArray.findIndex(
        (item) => item.mediumId == array.medium_id
      );
      const stdList = this.currentAadharArray[index]?.standardList?.filter(
        (item) => element != item.id.toString()
      );
      this.currentAadharArray[index].standardList = stdList;
    }
  }
}
