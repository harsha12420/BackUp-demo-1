import { Component } from '@angular/core';
import { FormGroup, FormControl, Validators, FormArray } from '@angular/forms';
import { HttpRequestsService } from 'src/app/services/http-requests.service';
import { UtilityService } from 'src/app/services/utility.service';
import { InputFieldType } from '../../../../shared/enum/input-field-type.enum';
import {
  API_PATH,
  CUSTOM_FIELD_FORM_TYPES,
  CUSTOM_FIELD_STEPS,
  CUSTOM_FIELD_STEPS_COUNT,
} from 'src/app/Constants/constants';
@Component({
  selector: 'app-add-field',
  templateUrl: './add-field.component.html',
  styleUrls: ['./add-field.component.scss'],
})
export class AddFieldComponent {
  selectedFields: {
    fieldType?: InputFieldType;
    isRequired: boolean;
    name: string;
    options: [];
    formControlName: string;
    optionsType: string;
    isSearch: boolean;
  }[] = [];
  fieldForm: FormGroup;
  optionArray: any = new FormArray([]);
  fieldTypes = [];
  isGeneratedFomVisible = false;
  isSubmitted = false;
  formOptions = CUSTOM_FIELD_FORM_TYPES;
  formSteps = CUSTOM_FIELD_STEPS_COUNT;
  referenceList = [];
  constructor(
    private httpService: HttpRequestsService,
    private utlity: UtilityService
  ) { }

  ngOnInit() {
    this.initFieldForm();
    this.getInputTypes();
  }

  initFieldForm() {
    this.fieldForm = new FormGroup({
      name: new FormControl('', [Validators.required]),
      field_id: new FormControl('', [Validators.required, Validators.min(1)]),
      // isMandatory: new FormControl(false),
      controlName: new FormControl(''),
      optionsType: new FormControl(''),
      referenceType: new FormControl(''),
      dependentOn: new FormControl(''),
      isDynamic: new FormControl(false),
      isSearch: new FormControl(false),
    });
  }

  async getInputTypes() {
    this.utlity.showLoading();
    const result: any = await this.httpService.get(
      API_PATH.USER.INPUT_FIELD,
      false
    );
    if (result.statusCode === 200) {
      this.fieldTypes = result.data.result;
    }
    this.utlity.hideLoading();
  }

  onCheckboxChange() {
    this.fieldForm
      .get('customField')
      ?.setValidators(
        this.fieldForm.value['isMandatory'] ? Validators.required : null
      );
    this.fieldForm.get('customField')?.updateValueAndValidity();
  }

  get getTypeValue() {
    const id = this.fieldForm.value['field_id'];
    const fieldType = this.fieldTypes.find((f) => f['_id'] == id);
    return fieldType ? fieldType['fieldName'] : '';
  }

  get formControls() {
    return this.fieldForm.controls;
  }

  setValue() {
    if (
      this.getTypeValue === 'dropdown' ||
      this.getTypeValue === 'checkbox' ||
      this.getTypeValue === 'radio'
    ) {
      this.optionArray = new FormArray([]);
      this.addFieldValue();
    } else if (this.getTypeValue === 'reference') {
      this.optionArray = new FormArray([]);
      this.setValidator('referenceType');
      this.getReferenceList();
    } else {
      this.optionArray = new FormArray([]);
    }
    const isSearch = this.getTypeValue === 'dropdown' || this.getTypeValue === 'reference' ? true : false;
    this.fieldForm.patchValue({'isSearch': isSearch});
  }
  setValidator(key) {
    this.fieldForm.get(key)?.setValidators(Validators.required);
    this.fieldForm.get('customField')?.updateValueAndValidity();
  }

  async getReferenceList() {
    const result: any = await this.httpService.get(
      API_PATH.USER.REFRENCE_LIST,
      false
    );
    if (result.statusCode === 200) {
      this.referenceList = result.data.result;
    }
  }

  addFieldValue() {
    this.optionArray.push(new FormControl('', [Validators.required]));
  }

  removeFieldvalue(i) {
    this.optionArray.removeAt(i);
  }

  async onSubmit() {
    this.isSubmitted = true;
    this.fieldForm.markAllAsTouched();

    if (this.fieldForm.valid && this.optionArray.valid) {
      this.utlity.showLoading();
      const controlName = this.utlity.convertSpacedString(this.fieldForm.value['name']);
      const data = {
        field_id: this.fieldForm.value['field_id'],
        isRequired: true,
        name: this.fieldForm.value['name'],
        formControlName: controlName,
        options: this.optionArray.value,
        optionsType: this.fieldForm.value['optionsType'] || null,
        isSearch: this.fieldForm.value['isSearch'] ? true : false,
        isDynamic: this.getTypeValue === 'reference' ? true : false,
        reference_id: this.fieldForm.value['referenceType'] || null,
        dependentOn_id: this.fieldForm.value['dependentOn'] || null,
      };

      const result: any = await this.httpService.post(
        API_PATH.USER.CUSTOM_FIELD,
        data,
        false
      );
      if (result.statusCode === 200) {
        this.utlity.showSuccessToast('Saved successfully!!');
        this.fieldForm.reset();
        this.initFieldForm();
        this.fieldForm.patchValue({
          field_id: '',
          referenceType: '',
          dependentOn: '',
          optionsType: '',
        });
        this.optionArray = new FormArray([]);
        this.isSubmitted = false;
        this.fieldForm.markAsUntouched();
      } else {
        this.utlity.showErrorToast(result.message);
      }
      this.utlity.hideLoading();
    }
  }
}
