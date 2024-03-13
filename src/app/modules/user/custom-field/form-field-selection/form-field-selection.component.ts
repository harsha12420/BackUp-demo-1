import { utils } from 'xlsx';
import { Component } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { API_PATH } from 'src/app/Constants/constants';
import { HttpRequestsService } from 'src/app/services/http-requests.service';
import { UtilityService } from 'src/app/services/utility.service';
import { CustomFieldApiService } from 'src/app/shared/services/custom-field-api.service';

@Component({
  selector: 'app-form-field-selection',
  templateUrl: './form-field-selection.component.html',
  styleUrls: ['./form-field-selection.component.scss'],
})
export class FormFieldSelectionComponent {
  fields: any[] = [];
  formOptions: any[] = [];
  formSteps: any[] = [];
  groupOptions: any[] = [];
  fieldSelectionForm: FormGroup;
  isSubmitted = false;
  isMultipleDisabled = true;
  formId = null;
  isEdit: boolean;
  constructor(
    private httpService: HttpRequestsService,
    private utility: UtilityService,
    private customFieldService: CustomFieldApiService
  ) { }

  ngOnInit() {
    this.initFieldSelectionFOrm();
    this.getFields();
    this.getFormList();
  }

  initFieldSelectionFOrm() {
    this.fieldSelectionForm = new FormGroup({
      formId: new FormControl('' || null, [Validators.required]),
      stepId: new FormControl('' || null),
      groupId: new FormControl('' || null),
      isMultiple: new FormControl(false),
    });
  }

  get formControls() {
    return this.fieldSelectionForm.controls;
  }

  async getFields() {
    const params = `?skip_pagination=true`;
    const data: any = await this.customFieldService.getCustomFields(
      true,
      params
    );
    if (data.statusCode === 200) {
      this.fields = data?.data?.result;
      if (this.fields.length > 0) {
        this.updateFiledsResponse();
      }
    }
  }

  updateFiledsResponse() {
    this.fields = this.fields.map((obj) => ({
      ...obj,
      isSelected: false,
      isFixed: false,
      isListView: false,
      isRequired: false,
    }));
  }

  async getFormList() {
    this.formOptions = await this.customFieldService.getFormList();
  }

  async getFormStepList() {
    this.formSteps = [];
    this.fieldSelectionForm.patchValue({ stepId: null, groupId: null });
    const formId = this.fieldSelectionForm.value['formId'];
    if (formId) {
      this.formSteps = await this.customFieldService.getFormStepList(formId);
      this.checkFieldSeletected(formId);
    }
  }

  getSelectedGroupField() {
    const formId = this.fieldSelectionForm.value['formId'];
    const stepId = this.fieldSelectionForm.value['stepId'];
    const groupId = this.fieldSelectionForm.value['groupId'];
    this.isMultipleDisabled = groupId ? false : true;
    this.checkFieldSeletected(formId, stepId, groupId);
  }

  async checkFieldSeletected(formId, stepId = '', groupId = '') {
    if (formId) {
      const res: any = await this.customFieldService.getSelectedFields(formId, stepId, groupId);
      const formFields = res.result;
      if (formFields.length === 0 && res.customFieldArray.length === 0) {
        this.formId = null;
        this.updateFiledsResponse();
        return;
      }
      for (let i = 0; i < this.fields.length; i++) {
        const element: any = this.fields[i];
        let foundInFieldArray = false;
        let foundStaticField = false
        foundInFieldArray = await this.setFieldSelection(formFields, element, foundInFieldArray, groupId, i);
        foundStaticField = await this.setStaticField(res.customFieldArray, element, foundStaticField, i)
        if (!foundInFieldArray && !foundStaticField) {
          this.updateFlag(i)
        }
      }
    }
    else {
      this.getFields();
    }
  }

  updateFlag(i) {
    this.fields[i].isSelected = false;
    this.fields[i].isRequired = false;
    this.fields[i].isFixed = false;
    this.fields[i].isListView = false;
  }

  setStaticField(customFieldArray, element, foundStaticField, i) {
    for (let index = 0; index < customFieldArray.length; index++) {
      const fieldElement = customFieldArray[index];
      const isExist = fieldElement._id === element._id || false;
      if (isExist) {
        this.fields[i].isSelected = true;
        this.fields[i].isRequired = fieldElement?.isRequired || false;
        this.fields[i].isFixed = fieldElement?.isFixed || false;
        this.fields[i].isListView = fieldElement?.isListView || false;
        foundStaticField = true;
      }
    }
    return foundStaticField;
  }

  async setFieldSelection(formFields, element, foundInFieldArray, groupId, i) {
    for (let index = 0; index < formFields.length; index++) {
      const fieldElement = formFields[index];
      const fieldArray = fieldElement.fields_array;
      this.formId = fieldElement._id;
      const isExist = fieldArray.length > 0 ? fieldArray.some((f) => f.field_id === element._id) : false;
      if (isExist) {
        const findIndex = fieldArray.findIndex((f) => f.field_id === element._id);
        this.fields[i].isSelected = true;
        this.fields[i].isRequired = fieldArray[findIndex]?.isRequired || false;
        this.fields[i].isFixed = fieldArray[findIndex]?.isFixed || false;
        this.fields[i].isListView = fieldArray[findIndex]?.isListView || false;
        foundInFieldArray = true;
      }
      if (groupId) {
        this.fieldSelectionForm.patchValue({
          isMultiple: fieldElement.isMultiple,
        });
      }
    }
    return foundInFieldArray;
  }

  async getGroupList() {
    this.groupOptions = [];
    this.fieldSelectionForm.patchValue({ groupId: null });
    const stepId = this.fieldSelectionForm.value['stepId'];
    if (stepId) {
      this.groupOptions = await this.customFieldService.getGroupList(stepId);
      this.checkFieldSeletected(
        this.fieldSelectionForm.value['formId'],
        stepId
      );
    }
  }

  setCheckedValue(i, key) {
    this.fields[i][key] = !this.fields[i][key];
  }

  async saveFields() {
    this.isSubmitted = true;
    this.fieldSelectionForm.markAllAsTouched();

    if (this.fieldSelectionForm.valid) {
      const allFalse = this.fields.every((item) => item.isSelected === false);
      if (!allFalse) {
        const data = {
          form_id: this.fieldSelectionForm.value['formId'],
          step_id: this.fieldSelectionForm.value['stepId'],
          group_id: this.fieldSelectionForm.value['groupId'],
          isMultiple: this.fieldSelectionForm.value['isMultiple'],
          fields_array: new Array(),
          id: this.formId,
        };
        for (let index = 0; index < this.fields.length; index++) {
          const element = this.fields[index];
          if (element.isSelected) {
            const selectedField = {
              field_id: element._id,
              isRequired: element.isRequired,
              fieldName: element.fieldName,
              name: element.name,
              formControlName: element.formControlName,
              isFixed: element.isFixed,
              isListView: element.isListView,
              reference_id: element.reference_id,
              dependentOn_id: element.dependentOn_id,
              options: element.options,
              optionsType: element.optionsType,
              isSearch: element.isSearch
            };
            data.fields_array.push(selectedField);
          }
        }
        this.utility.showLoading();
        const result: any = await this.httpService.post(
          `${API_PATH.USER.SAVE_GET_FROM_FIELD}`,
          data,
          false
        );
        if (result.statusCode === 200) {
          this.utility.showSuccessToast('Saved successfully!!');
        } else {
          this.utility.showErrorToast(result.message);
        }
      } else {
        this.utility.showErrorToast('Please select fields!!');
      }

      this.utility.hideLoading();
    }
  }
}
