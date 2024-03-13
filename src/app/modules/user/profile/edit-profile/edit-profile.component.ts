import { HttpClient } from '@angular/common/http';
import {
  Component,
  EventEmitter,
  Input,
  Output,
  TemplateRef,
  ViewChild,
} from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { NgbModalRef, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ToastrService } from 'ngx-toastr';
import { ERROR } from 'src/app/Constants/constants';
import { ApiService } from 'src/app/services/api.service';
import { EncryptDecryptUserroleService } from 'src/app/services/encrypt-decrypt-userrole.service';
import { UtilityService } from 'src/app/services/utility.service';

@Component({
  selector: 'app-edit-profile',
  templateUrl: './edit-profile.component.html',
  styleUrls: ['./edit-profile.component.scss'],
})
export class EditProfileComponent {
  profileForm: FormGroup;
  isSubmitted = false;
  isEditing: boolean = false;
  userRole: any;
  file;
  fileCrop;
  imageChangedEvent: any;
  imagemodalReference: NgbModalRef;
  isEdit = false;
  isImageSelected: boolean = false;
  isImgEdit = false;
  filesPreview: any = [];
  imgUrl: any;
  @Input('userProfile') userProfile: any;
  @ViewChild('imageCropper', { static: false }) imageCropper: TemplateRef<any>;
  config = {
    backdrop: true,
    ignoreBackdropClick: true,
    class: 'modal-md',
    centered: true,
    modalDialogClass: 'modal-xl',
  };
  @Output() onEditEmitter: any = new EventEmitter();
  constructor(
    private formBuilder: FormBuilder,
    private apiService: ApiService,
    private utils: UtilityService,
    private encryptDataService: EncryptDecryptUserroleService,
    private modalService: NgbModal,
    private toastr: ToastrService,
    public http: HttpClient
  ) { }

  async ngOnInit() {
    this.profileForm = this.formBuilder.group({
      name: ['', Validators.required],
      first_name: ['', Validators.required],
      middle_name: [''],
      last_name: ['', Validators.required],
      mobile: [
        '',
        [
          Validators.required,
          Validators.min(1000000000),
          Validators.max(9999999999),
        ],
      ],
      logo: [''],
    });
    this.userRole = await this.encryptDataService.getAndDecryptData();
    this.toggleEdit();
  }

  get form() {
    return this.profileForm.controls;
  }
  toggleEdit() {
    this.isEditing = !this.isEditing;
    this.profileForm.controls['name'].setValue(
      this.userProfile.organization_name
    );
    this.profileForm.controls['first_name'].setValue(
      this.userProfile.first_name
    );

    this.profileForm.controls['middle_name'].setValue(
      this.userProfile.middle_name
    );

    this.profileForm.controls['last_name'].setValue(this.userProfile.last_name);

    this.profileForm.controls['mobile'].setValue(this.userProfile.mobile);
    this.imgUrl = this.userProfile.image == "NULL" ? null : this.userProfile.image;
    this.isEdit = true;
  }
  async onSubmit() {
    try {
      this.isSubmitted = true;

      if (this.userRole == 0) {
        this.profileForm.removeControl('name');
        if (this.profileForm.invalid) {
          return;
        }
        if (this.isImgEdit) {
          this.imgUrl = await this.getPresignUrl();
        }
        this.utils.showLoading();
        const response: any = await this.apiService.editProfileSuperAdmin({
          ...this.profileForm.value,
          logo: this.imgUrl,
          mobile: this.profileForm.value.mobile.toString(),
        });
        this.utils.hideLoading();
        if (response.statusCode === 200) {
          this.utils.showSuccessToast(response.message);
          this.isEditing = false;
          this.onEditEmitter.emit();
          this.filesPreview = [];
          this.isImageSelected = false;
        }
      } else if (this.userRole == 1) {
        if (this.profileForm.invalid) {
          return;
        }
        if (this.isImgEdit) {
          this.imgUrl = await this.getPresignUrl();
        }
        this.utils.showLoading();
        const response: any = await this.apiService.editOrganizationProfile({
          ...this.profileForm.value,
          logo: this.imgUrl,
          mobile: this.profileForm.value.mobile.toString(),
        });
        this.utils.hideLoading();
        if (response.statusCode === 200) {
          this.utils.showSuccessToast(response.message);
          this.isEditing = false;
          this.onEditEmitter.emit();
          this.filesPreview = [];
          this.isImageSelected = false;
        }
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
        centered: false,
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
  onPreviewFileRemove(event: any) {
    if (this.isEdit) {
      this.isImgEdit = false;
    } else {
      this.isImageSelected = true;
    }
    this.filesPreview.splice(this.filesPreview.indexOf(event), 1);
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
}
