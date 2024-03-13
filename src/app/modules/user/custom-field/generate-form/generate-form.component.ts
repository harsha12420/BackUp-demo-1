import { HttpClient } from '@angular/common/http';
import { ChangeDetectorRef, Component, ViewChild } from '@angular/core';
import { FormGroup, FormControl, Validators, FormArray, AbstractControl, FormBuilder } from '@angular/forms';
import { Router } from '@angular/router';
import AngularEditor from 'ckeditor/build/ckeditor';
import * as moment from 'moment';
import {
  Constants,
  InputFieldType,
  API_PATH,
  ERROR,
} from 'src/app/Constants/constants';
import { RegexEnum } from 'src/app/Constants/regex';
import { ApiService } from 'src/app/services/api.service';
import { HttpRequestsService } from 'src/app/services/http-requests.service';
import { UtilityService } from 'src/app/services/utility.service';
import { CustomFieldApiService } from 'src/app/shared/services/custom-field-api.service';
@Component({
  selector: 'app-generate-form',
  templateUrl: './generate-form.component.html',
  styleUrls: ['./generate-form.component.scss'],
})
export class GenerateFormComponent {
  @ViewChild('dp') dp;
  fields: any[] = [];
  addDaynamicTaskForm: FormGroup;
  validEmail: any = RegexEnum.email;
  isSubmitted = false;
  isFormVisible = false;
  min = moment().toDate();
  minTime = moment().format(Constants.TIME_FORMAT_HH_MM);
  datePickerConfig = {
    withTimepicker: true,
    keepDatepickerOpened: true,
    showWeekNumbers: false,
    dateInputFormat: 'dddd, MMMM DD, YYYY, h:mm:ss a',
    adaptivePosition: true,
  };
  inputFieldType = InputFieldType;
  apiData: any = [];
  isApiDataFetched: boolean = false;
  selectedFile: File | any;
  editorData = 'DemoCK';
  public Editor: any = AngularEditor;
  formOptions: any[] = [];
  createdFieldList: any = [];
  formId = '' || null;
  stepId = '' || null;
  formSteps: any[] = [];
  isLinear: boolean = true;
  ImgUrl: string;
  currentStepIndex = 0;
  fieldsCtrls = {};

  constructor(
    private httpService: HttpRequestsService,
    private utility: UtilityService,
    private router: Router,
    private customFieldService: CustomFieldApiService,
    public http: HttpClient,
    private formBuilder: FormBuilder,
    private apiService: ApiService,
    private ref: ChangeDetectorRef
  ) { }

  ngOnInit() {
    this.getFormList();
  }

  async getFormList() {
    this.formOptions = await this.customFieldService.getFormList();
  }

  async getFormStepList() {
    this.removeFormControls();
  }

  ngAfterContentChecked(): void {
    this.ref.detectChanges();
  }

  ngAfterViewInit() {
    this.ref.detectChanges();
  }

  async getFields() {
    this.fields = await this.customFieldService.getFormWiseFields(
      this.formId,
      this.stepId
    );
    this.fields.sort((a, b) => a.forms?.stepSequence - b.forms?.stepSequence)
  }

  async generateForm() {
    if (this.formId) {
      await this.removeFormControls();
      await this.getFields();
      if (this.fields.length > 0) {
        for (let index = 0; index < this.fields.length; index++) {
          const form = this.fields[index];
          const formGroupName = form.forms.stepName ? `${this.utility.toCamelCase(form.forms.stepName)}${index + 1}` : '';
          this.createFormObject(form, formGroupName);
        }
        this.addDaynamicTaskForm = new FormGroup(this.fieldsCtrls);
      } else {
        this.utility.showErrorToast('Custom fields not found!! Please add custom field...');
      }
    } else {
      this.utility.showErrorToast('Please select a form...');
    }
  }

  createFormObject(form, formGroupName) {
    const formObject = {
      formId: form.forms.formId,
      stepName: form.forms.stepName,
      stepSequence: form.forms.stepSequence,
      formGroups: new Array(),
      dynamicForm: formGroupName ? { [formGroupName]: new FormGroup({}) } : {},
      isStepExist: form.forms.stepName ? true : false,
      formGroupName: formGroupName
    };
    this.assignGroupObject(formObject, form);
    if (formGroupName) {
      formObject.dynamicForm[formGroupName] = new FormGroup(this.fieldsCtrls);
    }
    this.fieldsCtrls = formObject.isStepExist ? {} : this.fieldsCtrls;
  }

  assignGroupObject(formObject: any, form) {
    for (const group of form.forms.groups) {
      const groupObject = {
        groupId: group.groupId,
        groupName: group.groupName,
        groupFields: this.createGroupFields(group),
        isMultiple: group.isMultiple,
      };
      formObject.formGroups.push(groupObject);
    }
    this.createdFieldList.push(formObject);
    this.createdFieldList[0].isStepExist = form.forms.stepName ? true : false;

    return formObject;
  }

  createFormControl(fieldName: any): AbstractControl {
    if (fieldName.fieldName === this.inputFieldType.Email) {
      return this.createEmailControl(fieldName);
    } else if (fieldName.fieldName === this.inputFieldType.Checkbox) {
      return this.createCheckBoxControl(fieldName);
    } else if (fieldName.fieldName === this.inputFieldType.Reference) {
      return this.createRefernceControl(fieldName);
    } else if (fieldName.fieldName === this.inputFieldType.Datepicker) {
      return new FormControl(null, fieldName.isRequired ? [Validators.required] : []);
    } else {
      return new FormControl('' || null, fieldName.isRequired ? [Validators.required] : []);
    }
  }

  createEmailControl(fieldName: any): AbstractControl<any, any> {
    return new FormControl('', fieldName.isRequired ? [Validators.required, Validators.pattern(this.validEmail)] : [Validators.pattern(this.validEmail)]);
  }

  createCheckBoxControl(fieldName: any): AbstractControl<any, any> {
    const checkboxArray: FormArray<any> = new FormArray<any>([]);
    for (const option of fieldName.options) {
      checkboxArray.push(new FormControl(false));
    }
    fieldName['isViewDependent'] = false;
    return checkboxArray;
  }

  createRefernceControl(fieldName: any): AbstractControl<any, any> {
    const referenceFormControl = new FormControl(null, fieldName.isRequired ? [Validators.required] : []);
    if (fieldName.dependentOn_id === null) {
      (async () => {
        const options = await this.setReferenceData(fieldName.referenceData.name);
        fieldName.options = options;
      })();
    }
    return referenceFormControl;
  }

  togglePasswordVisibility(stepIndex, groupIndex, fieldIndex) {
    this.createdFieldList[stepIndex].formGroups[groupIndex].groupFields[fieldIndex].isViewPassword = !this.createdFieldList[stepIndex].formGroups[groupIndex].groupFields[fieldIndex].isViewPassword;
  }

  // Define a function to create group fields
  createGroupFields(group: any): any[] {
    const groupFields: any[] = [];
    const formGroup: FormGroup = this.formBuilder.group({});
    for (const field of group.groupFields) {
      field.fieldName.sort((a, b) => a.sequence - b.sequence);
      if (group.isMultiple) {
        for (const fieldName of field.fieldName) {
          const createdField = this.createFormControl(fieldName);
          formGroup.addControl(fieldName.field_id, createdField);
          fieldName['isViewPassword:'] = false;
          groupFields.push(fieldName);
        }
        this.fieldsCtrls[group.groupId] = this.formBuilder.array(new Array(formGroup));
      } else {
        for (const fieldName of field.fieldName) {
          const createdField = this.createFormControl(fieldName);
          this.fieldsCtrls[fieldName.field_id] = createdField;
          fieldName['isViewPassword:'] = false;
          groupFields.push(fieldName);
        }
      }
    }
    return groupFields;
  }

  onNext(s) {
    s.dynamicForm[s.formGroupName].markAllAsTouched();
  }

  getArrayControls(groupId, stepData): FormArray {
    const form = stepData.isStepExist ? stepData.dynamicForm[stepData.formGroupName].controls[groupId] : this.addDaynamicTaskForm.controls[groupId];
    return form as FormArray;
  }

  addControl(group, stepData) {
    const formGroup: FormGroup = this.formBuilder.group({});
    for (const field of group.groupFields) {
      if (group.isMultiple) {
        const createdField = this.createFormControl(field);
        formGroup.addControl(field.field_id, createdField);
      }
    }
    stepData.isStepExist ? stepData.dynamicForm[stepData.formGroupName].controls[group.groupId].push(formGroup) : this.fieldsCtrls[group.groupId].push(formGroup);
  }

  removeGroup(i, groupId, stepData) {
    stepData.isStepExist ? stepData.dynamicForm[stepData.formGroupName].controls[groupId].removeAt(i) : this.fieldsCtrls[groupId].removeAt(i);
  }

  areFormControlsValid(formData: any): boolean {
    for (const formGroupData of formData.formGroups) {
      for (const field of formGroupData.groupFields) {
        const id = formGroupData.isMultiple ? formGroupData.groupId : field.field_id
        const formControl = this.addDaynamicTaskForm.get(id);
        if (!formControl) {
          return false;
        }
        if (formControl.invalid) {
          return false;
        }
      }
    }
    return true;
  }

  async removeFormControls() {
    if (this.addDaynamicTaskForm) {
      for (const controlName of Object.keys(this.addDaynamicTaskForm.controls)) {
        this.addDaynamicTaskForm.removeControl(controlName);
      }
      this.createdFieldList = [];
    }
    return;
  }

  get formControls() {
    return this.addDaynamicTaskForm.controls;
  }

  dynamicFormControls(i, formGroupName, id) {
    return this.createdFieldList[i].dynamicForm[formGroupName].controls[id];
  }

  getSelectedCheckboxValues(controlName: string, fieldsData) {
    const selectedOptions: any = [];
    const formControl = this.addDaynamicTaskForm.get(controlName);
    if (formControl && formControl.value && formControl.value.length > 0) {
      for (let i = 0; i < formControl.value.length; i++) {
        if (formControl.value[i]) {
          selectedOptions.push(this.getFieldByControlName(controlName, fieldsData).options[i]);
        }
      }
    }
    return selectedOptions;
  }

  getFieldByControlName(controlName: string, fieldsData) {
    return fieldsData.find((field) => field.field_id === controlName);
  }

  selectedCheckBoxValues(controlName, fieldsData) {
    const selectedOptions: any = [];
    const values = this.getSelectedCheckboxValues(controlName, fieldsData);
    selectedOptions.push(...values);
    return selectedOptions;
  }

  async setSelectedFile(event) {
    const inputElement = event.target as HTMLInputElement;
    if (inputElement.files && inputElement.files.length > 0) {
      this.selectedFile = inputElement.files[0];
      await this.getPresignUrl();
    }
  }

  async getPresignUrl() {
    this.ImgUrl = '';
    const obj = {
      file_name: this.selectedFile.name,
      ContentType: this.selectedFile.type,
    };
    const response: any = await this.customFieldService.presignedUrl(obj);
    if (response.statusCode == 200) {
      this.ImgUrl = response.data.url;
      const formData = new FormData();
      formData.append('file', this.selectedFile);
      return new Promise((resolve, reject) => {
        this.http.put(this.ImgUrl, this.selectedFile).subscribe(
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

  redirectTo() {
    this.router.navigateByUrl('custom-field');
  }

  async onSubmit() {
    this.isSubmitted = true;
    this.addDaynamicTaskForm.markAllAsTouched();
    let isValid = this.addDaynamicTaskForm.valid;
    if (this.createdFieldList[0].isStepExist) {
      const dynamicLastForm: any = Object.values(this.createdFieldList[this.createGroupFields.length].dynamicForm)[0];
      isValid = dynamicLastForm.valid;
      dynamicLastForm.markAllAsTouched()
    } else {
      this.addDaynamicTaskForm.markAllAsTouched();
    }
    if (isValid) {
      const formData = this.addDaynamicTaskForm.value;
      this.apiData = this.buildApiData(formData);
      this.isApiDataFetched = this.apiData ? true : false;
      const result: any = await this.httpService.post(
        API_PATH.USER.SAVE_CF_FORM_VALUES,
        this.apiData
      );
      if (result.statusCode === 200) {
        this.utility.showSuccessToast('Data saved successfully!!');
        window.location.reload();
      }
    } else {
      this.isApiDataFetched = false;
    }
  }

  buildApiData(formData: any) {
    const apiData: any[] = [];
    let obj: any = {};
    for (let form of this.createdFieldList) {
      formData = form.isStepExist ? form.dynamicForm[form.formGroupName].value : formData;
      for (let group of form.formGroups) {
        let groupData: any = {};
        for (let field of group.groupFields) {
          if (formData[field.field_id] !== undefined || formData[group.groupId] !== undefined) {
            let data: any = { field_array_id: field._id };
            if (!group.isMultiple) {
              data.field_id = field.field_id;
              data.name = field.name;
              data.fieldName = field.fieldName;
              data.isListView = field.isListView;
            }
            if (field.fieldName === InputFieldType.Checkbox) data.options = field.options;
            if (field.referenceData) {
              data.referenceData = field.referenceData;
              data.reference_id = field.reference_id
            }
            data.formControlName = field.formControlName;
            if (field.isFixed) obj[field.formControlName] = formData[field.field_id];
            if (field.fieldName === InputFieldType.Checkbox && !group.isMultiple) {
              data['fieldValue'] = this.selectedCheckBoxValues(field.field_id, group.groupFields);
            } else {
              if (group.isMultiple) {
                const arrayData = formData[group.groupId].map(item => {
                  return Object.keys(item).map(key => {
                    const fieldObj = group.groupFields.find(f => f.field_id === key);
                    if (fieldObj.fieldName === InputFieldType.Checkbox) {
                      let value = fieldObj.options.filter((element, index) => item[key][index])
                      return {
                        "field_array_id": key,
                        "fieldValue": value,
                        "field_id": fieldObj.field_id,
                        "name": fieldObj.name,
                        "formControlName": fieldObj.formControlName,
                        "fieldName": fieldObj.fieldName,
                        "isListView": fieldObj.isListView,
                        "options": fieldObj.options
                      };
                    } else {
                      return {
                        "field_array_id": key,
                        "fieldValue": item[key],
                        "field_id": fieldObj.field_id,
                        "name": fieldObj.name,
                        "formControlName": fieldObj.formControlName,
                        "fieldName": fieldObj.fieldName,
                        "isListView": fieldObj.isListView,
                      };
                    }
                  });
                });

                data["multipleFieldArray"] = arrayData;
                delete data['field_array_id'];

                data.groupId = group.groupId;
                data.groupName = group.groupName;
                data.isMultiple = group.isMultiple;
              } else {
                data['fieldValue'] = formData[field.field_id];
              }
            }
            if (!group.isMultiple) {
              apiData.push(data);
            } else {
              groupData = data;
            }
          }
        }

        if (group.isMultiple && Object.keys(groupData).length > 0) {
          apiData.push(groupData);
        }
      }
    }

    return {
      form_id: this.formId,
      fieldValueArray: apiData,
      ...obj
    };
  }

  changeTimeFormat(event, control) {
    this.addDaynamicTaskForm.value[control] = moment(event).format(
      Constants.TIME_STAMP_FORMAT
    );
  }

  async setReferenceDropdownData(data, event, stepData) {
    const depData: any = await this.findDependentData(data.reference_id);
    if (Object.values(depData.dependentData).length > 0) {
      let options: any = await this.setReferenceData(depData.dependentData.referenceData.name, event.id);
      options = Array.isArray(options) ? options : new Array(options);
      const groupFields = this.createdFieldList[depData.stepIndex].formGroups[depData.groupIndex].groupFields[depData.fieldIndex];
      this.createdFieldList[depData.stepIndex].formGroups[depData.groupIndex].groupFields[depData.fieldIndex].options = options;
      this.createdFieldList[depData.stepIndex].formGroups[depData.groupIndex].groupFields[depData.fieldIndex]['isViewDependent'] = true;
      this.setDefaultValueToRefernce(options, groupFields, stepData);
    }
  }

  setDefaultValueToRefernce(options, groupFields, stepData) {
    if (options.length > 0) {
      const keyName = groupFields.field_id;
      const defaultSelection = options[0];
      if (stepData.isStepExist) {
        stepData.dynamicForm[stepData.formGroupName].patchValue({
          [keyName]: defaultSelection.id,
        });
      } else {
        this.addDaynamicTaskForm.patchValue({
          [keyName]: defaultSelection.id,
        });
      }
      this.setReferenceDropdownData(groupFields, defaultSelection, stepData);
    }
  }

  async findDependentData(referenceIdToFind) {
    let dependentData = {};
    let groupIndex;
    let fieldIndex;
    let stepIndex;
    for (let i = 0; i < this.createdFieldList.length; i++) {
      const step = this.createdFieldList[i];
      for (let index = 0; index < step.formGroups.length; index++) {
        const group = step.formGroups[index];
        for (let j = 0; j < group.groupFields.length; j++) {
          const field = group.groupFields[j];
          if (field.dependentOn_id === referenceIdToFind) {
            dependentData = field;
            stepIndex = i;
            groupIndex = index;
            fieldIndex = j;
            break;
          }
        }
        if (Object.values(dependentData).length > 0) {
          break;
        }
      }
    }
    return {
      dependentData,
      groupIndex,
      fieldIndex,
      stepIndex,
    };
  }

  async setReferenceData(referenceType, id = null) {
    let data = [];
    switch (referenceType) {
      case 'Pincode':
        data = await this.getPincodeData(id);
        break;

      case 'Village':
        data = await this.getVillageData(id);
        break;

      case 'Sub-district':
        data = await this.getSubDistrictData(id);
        break;

      case 'District':
        data = await this.getDistrictData(id);
        break;

      case 'State':
        data = await this.getStateData(id);
        break;

      case 'Medium':
        data = await this.getMediumData();
        break;

      case 'Standard':
        data = await this.getStandardData(id);
        break;

      case 'Academic year':
        data = await this.getAcademicYearData();
        break;

      default:
        break;
    }
    return data;
  }

  async getPincodeData(id = null) {
    this.utility.showLoading();
    const params = `?skip_pagination=true`;
    const idParams = id !== null ? `&pincode_id=${id}` : '';
    const result: any = await this.httpService.get(
      `${API_PATH.USER.PInCODE_LIST_MASTER}${params}${idParams}`
    );
    let pincodeData = [];
    if (result.statusCode === 200) {
      pincodeData = result.data.result;
    }
    this.utility.hideLoading();
    return pincodeData;
  }

  async getVillageData(id = null) {
    this.utility.showLoading();
    const params = `?skip_pagination=true`;
    const idParams = id !== null ? `&pincode_id=${id}` : '';
    const result: any = await this.httpService.get(
      `${API_PATH.USER.VILLAGE_LIST_MASTER}${params}${idParams}`
    );
    let pincodeData = [];
    if (result.statusCode === 200) {
      pincodeData = result.data.result;
    }
    this.utility.hideLoading();
    return pincodeData;
  }

  async getSubDistrictData(id = null) {
    this.utility.showLoading();
    const params = `?skip_pagination=true`;
    const idParams = id !== null ? `&village_id=${id}` : '';
    const result: any = await this.httpService.get(
      `${API_PATH.USER.SUB_DISTRICT_LIST_MASTER}${params}${idParams}`
    );
    let pincodeData = [];
    if (result.statusCode === 200) {
      pincodeData = result.data.result;
    }
    this.utility.hideLoading();
    return pincodeData;
  }

  async getDistrictData(id = null) {
    this.utility.showLoading();
    const params = `?skip_pagination=true`;
    const idParams = id !== null ? `&sub_district_id=${id}` : '';
    const result: any = await this.httpService.get(
      `${API_PATH.USER.DISTRICT_LIST_MASTER}${params}${idParams}`
    );
    let pincodeData = [];
    if (result.statusCode === 200) {
      pincodeData = result.data.result;
    }
    this.utility.hideLoading();
    return pincodeData;
  }

  async getStateData(id = null) {
    this.utility.showLoading();
    const params = `?skip_pagination=true`;
    const idParams = id !== null ? `&district_id=${id}` : '';
    const result: any = await this.httpService.get(
      `${API_PATH.USER.STATE_LIST_MASTER}${params}${idParams}`
    );
    let pincodeData = [];
    if (result.statusCode === 200) {
      pincodeData = result.data.result;
    }
    this.utility.hideLoading();
    return pincodeData;
  }

  async getMediumData() {
    this.utility.showLoading();
    let mediumData = [];
    const queryList = `?skip_pagination=${true}&sort=DESC`;
    const response: any = await this.apiService.getMediumList(queryList);
    if (response.statusCode === 200) {
      mediumData = response.data.result;
    }
    this.utility.hideLoading();
    return mediumData;
  }

  async getStandardData(id) {
    this.utility.showLoading();
    let stdData = [];
    const response: any = await this.apiService.getStandardListById(id);
    if (response.statusCode === 200) {
      stdData = response.data.result;
    }
    this.utility.hideLoading();
    return stdData;
  }

  async getAcademicYearData() {
    this.utility.showLoading();
    let data = [];
    const queryList = `?skip_pagination=${true}&sort=DESC`;
    const response: any = await this.apiService.getAcademicYearList(queryList);
    if (response.statusCode === 200) {
      data = response.data.result;
    }
    this.utility.hideLoading();
    return data;
  }

  async onPreviewFileSelect(event: any, item: any, stepData) {
    if (event.addedFiles.length) {
      this.selectedFile = event.addedFiles[0];
      const response: any = await this.getPresignUrl();

      if (response?.data) {

        if (stepData.isStepExist) {
          stepData.dynamicForm[stepData.formGroupName].patchValue({
            [item.field_id]: response?.data?.accessUrl,
          });
        } else {
          this.addDaynamicTaskForm.controls[item.field_id].patchValue(response?.data?.accessUrl);
        }
      }
    } else {
      this.utility.showErrorToast(ERROR.IMAGE_ERROR);
    }
  }

  getFileExtension(url) {
    if (url && url.split('.').pop() == 'pdf') {
      return 'pdf';
    }
    return 'img';
  }

  removeUploadedFile(item, stepData) {
    if (stepData.isStepExist) {
      stepData.dynamicForm[stepData.formGroupName].patchValue({
        [item.field_id]: null,
      });
    } else {
      this.addDaynamicTaskForm.controls[item.field_id].patchValue(null);
    }
  }
}
