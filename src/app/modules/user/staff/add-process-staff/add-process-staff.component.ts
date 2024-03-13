import { HttpClient } from '@angular/common/http';
import { Component } from '@angular/core';
import {
  FormArray,
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import * as moment from 'moment';
import { BsDatepickerViewMode } from 'ngx-bootstrap/datepicker';
import { ERROR } from 'src/app/Constants/constants';
import { RegexEnum } from 'src/app/Constants/regex';
import { ApiService } from 'src/app/services/api.service';
import { UtilityService } from 'src/app/services/utility.service';
import { NoSpace } from 'src/app/shared/validations/no-space.validator';
@Component({
  selector: 'app-add-process-staff',
  templateUrl: './add-process-staff.component.html',
  styleUrls: ['./add-process-staff.component.scss'],
})
export class AddProcessStaffComponent {
  showPassword = false;
  filesPreview: any = [];
  staffRoomList: any = [];
  mediumList: any = [];
  standardList: any = [];
  subjectList: any = [];
  standardSubjectList: any = [];
  masterStandardSubjectList: any = [];
  firstFormGroup: FormGroup;
  isFirstFormSubmitted = false;
  secondFormGroup: FormGroup;
  isSecondFormSubmitted = false;
  isIceGroupSubmitted = false
  thirdFormGroup: FormGroup;
  isThirdFormSubmitted = false;

  fourthFormGroup: FormGroup;
  isFourthFormSubmitted = false;

  fifthFormGroup: FormGroup;
  isFifthFormSubmitted = false;
  isSubjectAllotmentSubmitted = false;
  isLinear = true;
  primaryRoleList: any = [];
  secondaryRoleList: any = [];
  reportingRoleList: any = [];
  userId: number;
  isEdit = false;
  relationTypeArray = [
    {
      id: 1,
      name: 'Father',
    },
    {
      id: 2,
      name: 'Mother',
    },
    {
      id: 3,
      name: 'Spouse',
    },
  ];
  minMode: BsDatepickerViewMode = 'year';
  maxDate: Date = new Date();
  bsConfig;
  todayDate: any = '';
  constructor(
    private formBuilder: FormBuilder,
    private apiService: ApiService,
    private http: HttpClient,
    private route: ActivatedRoute,
    private router: Router,
    private utils: UtilityService
  ) {
    this.bsConfig = Object.assign(
      {},
      {
        minMode: this.minMode,
        dateInputFormat: 'YYYY',
      }
    );
    this.todayDate = moment(new Date()).format('YYYY-MM-DD').toString();
  }

  async ngOnInit() {
    this.initFirstForm();
    this.initSecondForm(); // ------------------------------change--------------------------
    this.initThirdForm();
    this.initFourthForm();
    this.getroleList(); // ------------------------------change--------------------------
    this.initFifthForm();
    await this.getdocumentSettingsList();
    this.StaffRoomList();
    await this.getMediumList();
    this.getSubjectList();
    this.getStandardList();
    this.route.queryParamMap.subscribe((params) => {
      if (params) {
        const userIdParam = params.get('userId');
        if (userIdParam !== null) {
          this.userId = +userIdParam;
          this.onEdit();
        }
      }
    });
  }

  async getStandardList() {
    const queryList = `?skip_pagination=true&sort=DESC`;
    const response: any = await this.apiService.getStandardList(queryList);
    if (response.statusCode === 200) {
      this.standardList = response.data.result;
    }
  }

  async getSubjectList() {
    const queryList = `?skip_pagination=true&sort=DESC&isActive=true`;
    const response: any = await this.apiService.getSubjectList(queryList);
    if (response.statusCode === 200) {
      this.subjectList = response.data.result;
    }
  }

  async StaffRoomList() {
    const queryList = `?skip_pagination=true&sort=DESC`;
    const response: any = await this.apiService.StaffRoomList(queryList);
    if (response.statusCode === 200) {
      this.staffRoomList = response.data.result;
    }
  }

  async getMediumList() {
    const queryList = `?skip_pagination=${true}&sort=DESC`;
    const response: any = await this.apiService.getMediumList(queryList);
    if (response.statusCode === 200) {
      this.mediumList = response.data.result;
    }
  }

  async uploadStaffDocument(file) {
    let ImgUrl = '';
    const obj = {
      file_name: file.name,
      ContentType: file.type,
    };
    const response: any = await this.apiService.staffPresignedUrl(obj);
    if (response.statusCode == 200) {
      ImgUrl = response.data.url;
      const formData = new FormData();
      formData.append('file', file);
      return new Promise((resolve, reject) => {
        this.http.put(ImgUrl, file).subscribe(
          (res) => {
            resolve(response);
          },
          (err) => {
            reject();
          }
        );
      });
    }
  }

  removeUploadedFile(document, type) {
    document.controls[type].setValue();
  }

  async onPreviewFileSelect(event: any, document, type) {
    this.filesPreview = event.addedFiles;
    if (this.filesPreview.length) {
      const response: any = await this.uploadStaffDocument(event.addedFiles[0]);

      if (response?.data) {
        document.controls[type].setValue(response?.data?.accessUrl);
      }
    } else {
      this.utils.showErrorToast(ERROR.IMAGE_ERROR);
    }
  }

  async getdocumentSettingsList() {
    const queryList = `?skip_pagination=true&sort=DESC&type=STAFF`;
    const response: any = await this.apiService.DocumentSettingList(queryList);
    if (response.statusCode === 200) {
      this.createDocumentForm(response.data.result);
    }
  }

  createDocumentForm(array) {

    for (const item of array) {
      let obj: FormGroup = this.formBuilder.group({
        id: [item.id],
        name: [item.name],
        details: ['', item.is_required ? [Validators.required, NoSpace()] : []],
        front: ['', item.is_required ? [Validators.required] : []],
      });
      item.is_back
        ? obj.addControl(
          'back',
          new FormControl('', item.is_required ? [Validators.required] : [])
        )
        : null;
      this.documents().push(obj);
    }

    console.log(JSON.parse(JSON.stringify(this.documents().value)));

  }

  documents(): FormArray {
    return this.fifthFormGroup.get('document') as FormArray;
  }

  async getroleList() {
    const queryList = `?skip_pagination=true`;
    const response: any = await this.apiService.getRoleList(queryList);
    if (response.statusCode === 200) {
      this.primaryRoleList = response.data.result;
      this.secondaryRoleList = response.data.result;
      this.reportingRoleList = response.data.result;
    }
  }
  togglePasswordVisibility() {
    this.showPassword = !this.showPassword;
  }

  initFifthForm() {
    this.fifthFormGroup = this.formBuilder.group({
      document: this.formBuilder.array([]),
    });
  }

  initFirstForm() {
    this.firstFormGroup = this.formBuilder.group({
      first_name: ['', [Validators.required, NoSpace()]],
      middle_name: ['', [NoSpace()]],
      last_name: ['', [Validators.required, NoSpace()]],
      personal_email: [
        '',
        [Validators.required, Validators.pattern(RegexEnum.email)],
      ],
      email: ['', [Validators.required, Validators.pattern(RegexEnum.email)]],
      password: ['', [Validators.required, NoSpace(), Validators.minLength(8)]],
      birth_date: ['', [Validators.required, NoSpace()]],
      date_joining: ['', [Validators.required, NoSpace()]],
      enrollment_type: [null, [Validators.required, NoSpace()]],
      rfid_card_details: ['', [Validators.required, NoSpace()]],
      marital_status: [null, [Validators.required]],
      staff_room_id: [null],
      subject_allotment_ids: this.formBuilder.array([]),
      mobile: [
        '',
        [
          Validators.required,
          Validators.min(1000000000),
          Validators.max(9999999999),
        ],
      ],
      whatsapp_number: [
        '',
        [
          Validators.required,
          Validators.min(1000000000),
          Validators.max(9999999999),
        ],
      ],
    });
  }

  get firstform() {
    return this.firstFormGroup.controls;
  }

  get secondform() {
    return this.secondFormGroup.controls;
  }

  get thirdform() {
    return this.thirdFormGroup.controls;
  }

  get fourthform() {
    return this.fourthFormGroup.controls;
  }

  initSecondForm() {
    this.secondFormGroup = this.formBuilder.group({
      role_ids: this.formBuilder.array([
        this.formBuilder.group({ role_id: [null, [Validators.required]] }),
      ]),
      reporting_role_ids: this.formBuilder.array([
        this.formBuilder.group({ role_id: [null, [Validators.required]] }),
      ]),
      ice_ids: this.formBuilder.array([
      ]),
      primary_role_id: [null, [Validators.required]],
    });
  }

  get role_ids(): FormArray {
    return this.secondFormGroup.get('role_ids') as FormArray;
  }

  get reporting_role_ids(): FormArray {
    return this.secondFormGroup.get('reporting_role_ids') as FormArray;
  }

  ice_ids(): FormArray {
    return this.secondFormGroup.get('ice_ids') as FormArray;
  }

  subject_allotment_ids(): FormArray {
    return this.firstFormGroup.controls['subject_allotment_ids'] as FormArray;
  }

  addSubjectAllotment() {
    if (this.subject_allotment_ids().valid) {
      this.subject_allotment_ids().push(this.createSubjectAllotment());
    } else {
      this.isSubjectAllotmentSubmitted = true;
    }
  }

  removeSubjectAllotment(i: any) {
    this.subject_allotment_ids().removeAt(i);
  }

  createSubjectAllotment() {
    return this.formBuilder.group({
      medium_id: [null, [Validators.required]],
      subject_ids: [null, [Validators.required]],
      standard_ids: [null, [Validators.required]],
    });
  }

  getFinalSubjectData() {
    let obj: any = [];
    this.firstFormGroup.value.subject_allotment_ids.forEach((item: any) => {
      item.subject_ids.forEach(subjectId => {
        item.standard_ids.forEach(standardId => {
          obj.push({
            medium_id: item.medium_id,
            subject_id: subjectId,
            standard_id: standardId
          });
        });
      });
    });
    return obj;
  }

  createIceGroup() {
    return this.formBuilder.group({
      contact_name: ['', [Validators.required, NoSpace()]],
      relation: [null, [Validators.required]],
      contact_number: [
        '',
        [
          Validators.required,
          Validators.min(1000000000),
          Validators.max(9999999999),
        ],
      ],
      preference: ['', [Validators.required, NoSpace()]],
    });
  }

  addIceGroup() {
    if (this.ice_ids().valid) {
      this.ice_ids().push(this.createIceGroup());
    } else {
      this.isIceGroupSubmitted = true;
    }
  }

  removeIceGroup(i: any) {
    this.ice_ids().removeAt(i);
  }

  initThirdForm() {
    this.thirdFormGroup = this.formBuilder.group({
      correspondence_address_name: ['', [Validators.required, NoSpace()]],
      correspondence_street: ['', [Validators.required, NoSpace()]],
      correspondence_block: ['', [Validators.required, NoSpace()]],
      correspondence_building: ['', [Validators.required, NoSpace()]],
      correspondence_area: ['', [Validators.required, NoSpace()]],
      correspondence_city: ['', [Validators.required, NoSpace()]],
      correspondence_state: ['', [Validators.required, NoSpace()]],
      correspondence_country: ['', [Validators.required, NoSpace()]],
      correspondence_pincode: ['', [Validators.required, Validators.pattern('^[0-9]{6}$')]],
      parmanent_address_name: ['', [Validators.required, NoSpace()]],
      parmanent_street: ['', [Validators.required, NoSpace()]],
      parmanent_block: ['', [Validators.required, NoSpace()]],
      parmanent_building: ['', [Validators.required, NoSpace()]],
      parmanent_area: ['', [Validators.required, NoSpace()]],
      parmanent_city: ['', [Validators.required, NoSpace()]],
      parmanent_state: ['', [Validators.required, NoSpace()]],
      parmanent_country: ['', [Validators.required, NoSpace()]],
      parmanent_pincode: ['', [Validators.required, Validators.pattern('^[0-9]{6}$')]],
      degree: ['', [Validators.required, NoSpace()]],
      college: ['', [Validators.required, NoSpace()]],
      university_name: ['', [Validators.required, NoSpace()]],
      year_of_passing: ['', [Validators.required]],
      last_organisation_name: ['', [Validators.required, NoSpace()]],
      last_organisation_contact_number: [
        '',
        [
          Validators.required,
          Validators.min(1000000000),
          Validators.max(9999999999),
        ],
      ],
      reference_detail: [
        '',
        [
          Validators.required,
          Validators.min(1000000000),
          Validators.max(9999999999),
        ],
      ],
    });
  }

  initFourthForm() {
    this.fourthFormGroup = this.formBuilder.group({
      uan_number: ['', [Validators.required]],
      salary_account_number: ['', [Validators.required, Validators.min(100000000), Validators.max(999999999999999999)]],
      account_holder_name: ['', [Validators.required, NoSpace()]],
      bank_name: ['', [Validators.required, NoSpace()]],
      ifsc_code: ['', [Validators.required, Validators.pattern(RegexEnum.ifsc_code), NoSpace()]],
    });
  }

  onSubmitFirstForm() {
    try {
      this.isFirstFormSubmitted = true;
      this.isSubjectAllotmentSubmitted = true;
      if (this.firstFormGroup.invalid) {
        return;
      } else {
        this.addIceGroup();
      }
    } catch (error) { }
  }

  onSubmitSecondForm() {
    try {
      this.isSecondFormSubmitted = true;
      this.isIceGroupSubmitted = true
      if (this.secondFormGroup.invalid) {
        return;
      }
    } catch (error) { }
  }

  onSubmitThirdForm() {
    try {
      this.isThirdFormSubmitted = true;
      if (this.thirdFormGroup.invalid) {
        return;
      }
    } catch (error) { }
  }

  async onSubmitFourthForm() {
    try {
      this.isFourthFormSubmitted = true;
      if (this.fourthFormGroup.invalid) {
        return;
      }
    } catch (error) { }
  }

  async onSubmitFifthForm() {
    console.log(
      this.fifthFormGroup
    );

    try {
      this.isFifthFormSubmitted = true;
      if (this.fifthFormGroup.invalid) {
        return;
      }
      this.utils.showLoading();
      let role_ids = this.secondFormGroup.value.role_ids[0].role_id.map(
        (item: any) => {
          return { role_id: item, is_primary: false };
        }
      );
      role_ids.push({ role_id: +this.secondFormGroup.value.primary_role_id, is_primary: true })
      const reporting_role_ids =
        this.secondFormGroup.value.reporting_role_ids[0].role_id.map(
          (item: any) => {
            return { role_id: item };
          }
        );
      const obj = {
        ...this.firstFormGroup.getRawValue(),
        ...this.secondFormGroup.value,
        ...this.thirdFormGroup.value,
        ...this.fourthFormGroup.value,
        ...this.fifthFormGroup.value,
        mobile: this.firstFormGroup.value.mobile.toString(),
        whatsapp_number: this.firstFormGroup.value.whatsapp_number.toString(),
        // emergency_contact_number:
        //   this.secondFormGroup.value.emergency_contact_number.toString(),
        last_organisation_contact_number:
          this.thirdFormGroup.value.last_organisation_contact_number.toString(),
        reference_detail: this.thirdFormGroup.value.reference_detail.toString(),
        role_ids,
        reporting_role_ids,
        subject_allotment_ids: this.getFinalSubjectData(),
        salary_account_number: this.fourthFormGroup.value.salary_account_number.toString(),
        uan_number: this.fourthFormGroup.value.uan_number.toString()
      };
      this.isEdit ? (obj['user_id'] = this.userId) : '';
      obj.staff_room_id = obj.staff_room_id || 0;
      const response: any = await this.apiService.addStaff(obj);
      if (response.statusCode === 200) {
        this.router.navigate(['/admin/staff']);
        this.utils.showSuccessToast(response.message);
      }
      this.utils.hideLoading();
    } catch (error) {
      console.log(error);

      this.utils.hideLoading();
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

  async verifyEmail() {
    try {
      if (
        !(
          this.firstFormGroup.controls['email'].getError('required') ||
          this.firstFormGroup.controls['email'].getError('pattern')
        )
      ) {
        const obj = {
          email: this.firstFormGroup.value.email,
        };
        const response: any = await this.apiService.staffAddVerifyEmail(obj);
        if (response.data.emailExist == true) {
          this.firstFormGroup.controls['email'].setErrors({ emailExist: true });
        } else {
          this.firstFormGroup.controls['email'].setErrors(null);
        }
      }
    } catch (error) {
      this.firstFormGroup.controls['email'].setErrors({ emailExist: true });
    }
  }
  async onEdit() {
    if (this.userId) {
      this.utils.showLoading();
      const queryList = `?user_id=${this.userId}`;
      const response: any = await this.apiService.getStaffList(queryList);
      if (response.data) {
        this.firstFormGroup.patchValue({
          ...response.data,
          birth_date: moment(response.data.birth_date).format('YYYY-MM-DD'),
          date_joining: moment(response.data.date_joining).format('YYYY-MM-DD'),
          subject_allotment_ids: response.data.user_subject_allotment,
          staff_room_id: response.data.staff_room_id == 0 ? null : response.data.staff_room_id
        });
        this.secondFormGroup.patchValue({ ...response.data });

        this.thirdFormGroup.patchValue({ ...response.data });
        this.fourthFormGroup.patchValue({ ...response.data });
        // this.fifthFormGroup.patchValue({ ...response.data });
        this.firstFormGroup.controls['email'].disable();
        this.firstFormGroup.removeControl('password');
        this.isEdit = true;

        let user_ice = response.data.user_ice;

        user_ice?.forEach((user_ice: any, i) => {
          const obj = this.formBuilder.group({
            contact_name: [user_ice.contact_name, [Validators.required, NoSpace()]],
            relation: [user_ice.relation, [Validators.required]],
            contact_number: [
              user_ice.contact_number,
              [
                Validators.required,
                Validators.min(1000000000),
                Validators.max(9999999999),
              ],
            ],
            preference: [user_ice.preference, [Validators.required, NoSpace()]],

          });
          this.ice_ids().push(obj);
        });
        let roleArr: any = [];
        let roleIds = response.data.user_role;
        roleIds?.forEach((roleId: any) => {
          if (!roleId.is_primary) {
            roleArr.push(roleId.role_id);
          } else {
            this.secondFormGroup.controls['primary_role_id'].patchValue(roleId.role_id)
            const arr = this.secondaryRoleList.filter(item => item.id != roleId.role_id);
            this.secondaryRoleList = arr
          }
        });
        (
          this.secondFormGroup.controls['role_ids'] as any
        ).controls[0].patchValue({
          role_id: roleArr,
        });

        const arr = this.reportingRoleList.filter(item => ![...roleArr, this.secondFormGroup.controls['primary_role_id'].value].includes(item.id));
        this.reportingRoleList = arr

        let roleAuth: any = [];
        let authRoleIds = response.data.user_reporting_role;
        authRoleIds?.forEach((roleId: any) => {
          roleAuth.push(roleId.role_id);
        });
        (
          this.secondFormGroup.controls['reporting_role_ids'] as any
        ).controls[0].patchValue({
          role_id: roleAuth,
        });

        const groupedByMedium = response.data.user_subject_allotment?.reduce((acc, obj) => {
          const existingObj = acc.find(item => item.medium_id === obj.medium_id);

          if (existingObj) {
            if (!existingObj.subject_ids.includes(obj.subject_id)) {
              existingObj.subject_ids.push(obj.subject_id);
            }
            if (!existingObj.standard_ids.includes(obj.standard_id)) {
              existingObj.standard_ids.push(obj.standard_id);
            }
          } else {
            acc.push({
              medium_id: obj.medium_id,
              subject_ids: [obj.subject_id],
              standard_ids: [obj.standard_id]
            });
          }

          return acc;
        }, []);

        groupedByMedium?.forEach(async (item: any, i) => {
          const obj = this.formBuilder.group({
            medium_id: [item.medium_id, Validators.required],
            subject_ids: [item.subject_ids, Validators.required],
            standard_ids: [item.standard_ids, Validators.required],

          });
          this.subject_allotment_ids().push(obj);
        });
        this.documents().value.forEach((ele, index) => {
          response.data.document?.forEach((item: any, i) => {
            if (item.id == ele.id) {
              item.name = ele.name;
              this.documents().at(index).patchValue(item);
            }
          });
        })
        this.utils.hideLoading();
      } else {
        this.utils.hideLoading();
        this.router.navigate(['/admin/staff']);
      }
    } else {
      this.router.navigate(['/admin/staff']);
    }
  }

  getFileExtension(url) {
    if (url && url.split('.').pop() == 'pdf') {
      return 'pdf';
    }
    return 'img';
  }

  onPrimaryRoleChange(id) {
    (
      this.secondFormGroup.controls['role_ids'] as any
    ).controls[0].patchValue({
      role_id: null,
    });
    (
      this.secondFormGroup.controls['reporting_role_ids'] as any
    ).controls[0].patchValue({
      role_id: null,
    });
    this.secondaryRoleList = this.primaryRoleList
    const arr = this.secondaryRoleList.filter(item => item.id != id);
    this.secondaryRoleList = arr
  }

  onSecondaryRoleChange(value) {
    (
      this.secondFormGroup.controls['reporting_role_ids'] as any
    ).controls[0].patchValue({
      role_id: null,
    });
    let roleIds = value;
    roleIds.push(+this.secondFormGroup.value.primary_role_id)
    this.reportingRoleList = this.primaryRoleList
    const arr = this.reportingRoleList.filter(item => !roleIds.includes(item.id));
    this.reportingRoleList = arr
  }

  sameAsCorrespondenceAddress(e) {
    const obj = {
      parmanent_address_name: null,
      parmanent_street: null,
      parmanent_block: null,
      parmanent_building: null,
      parmanent_area: null,
      parmanent_city: null,
      parmanent_state: null,
      parmanent_country: null,
      parmanent_pincode: null
    }
    if (e.target.checked) {
      this.thirdFormGroup.patchValue({
        parmanent_address_name: this.thirdFormGroup.value.correspondence_address_name,
        parmanent_street: this.thirdFormGroup.value.correspondence_street,
        parmanent_block: this.thirdFormGroup.value.correspondence_block,
        parmanent_building: this.thirdFormGroup.value.correspondence_building,
        parmanent_area: this.thirdFormGroup.value.correspondence_area,
        parmanent_city: this.thirdFormGroup.value.correspondence_city,
        parmanent_state: this.thirdFormGroup.value.correspondence_state,
        parmanent_country: this.thirdFormGroup.value.correspondence_country,
        parmanent_pincode: this.thirdFormGroup.value.correspondence_pincode
      })
    } else {
      this.thirdFormGroup.patchValue(obj)
    }
  }
}
