import { CdkDragDrop, moveItemInArray } from '@angular/cdk/drag-drop';
import { Component } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { ApiService } from 'src/app/services/api.service';
import { UtilityService } from 'src/app/services/utility.service';
import { CustomFieldApiService } from 'src/app/shared/services/custom-field-api.service';

@Component({
  selector: 'app-form-field-list',
  templateUrl: './form-field-list.component.html',
  styleUrls: ['./form-field-list.component.scss']
})
export class FormFieldListComponent {
  fields: any[] = [];
  formOptions: any[] = [];
  formSteps: any[] = [];
  groupOptions: any[] = [];
  fieldSelectionForm: FormGroup
  isSubmitted = false;
  formId = null;
  constructor(
    private utility: UtilityService,
    private customFieldService: CustomFieldApiService,
    private apiService: ApiService
  ) {
  }

  ngOnInit() {
    this.initFieldSelectionFOrm()
    this.getFormList();
  }

  initFieldSelectionFOrm() {
    this.fieldSelectionForm = new FormGroup({
      formId: new FormControl('' || null, [Validators.required]),
      stepId: new FormControl('' || null),
      groupId: new FormControl('' || null),
    });
  }

  get formControls() {
    return this.fieldSelectionForm.controls;
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
    this.checkFieldSeletected(formId, stepId, groupId)
  }

  async checkFieldSeletected(formId, stepId = '', groupId = '') {
    if (formId) {
      const res: any = await this.customFieldService.getFormFieldsBySequence(formId, stepId, groupId);
      this.fields = res;
    }
  }

  async getGroupList() {
    this.groupOptions = [];
    this.fieldSelectionForm.patchValue({ groupId: null })
    const stepId = this.fieldSelectionForm.value['stepId'];
    if (stepId) {
      this.groupOptions = await this.customFieldService.getGroupList(stepId);
      this.checkFieldSeletected(this.fieldSelectionForm.value['formId'], stepId)
    }
  }

  async drop(event: CdkDragDrop<any[]>) {
    try {
      console.log(event);

      moveItemInArray(this.fields, event.previousIndex, event.currentIndex);
      let data: any = {
        form_id: this.fieldSelectionForm.value['formId'],
        sequenceIds: []
      }
      this.fields.forEach((element, index) => {
        let json = {
          id: element._id,
          sequence: index + 1
        }
        data.sequenceIds.push(json);
      });
      const response: any = await this.apiService.addFieldSequence(data);
      if ((response.statusCode = 200)) {
        this.getSelectedGroupField();
        this.utility.showSuccessToast(response.message);
      }
    } catch (error) {
      this.utility.hideLoading();
    }
  }
}
