import { Component } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { API_PATH } from 'src/app/Constants/constants';
import { HttpRequestsService } from 'src/app/services/http-requests.service';
import { UtilityService } from 'src/app/services/utility.service';
import { CustomFieldApiService } from 'src/app/shared/services/custom-field-api.service';
import { utils } from 'xlsx';

@Component({
  selector: 'app-add-view-groups',
  templateUrl: './add-view-groups.component.html',
  styleUrls: ['./add-view-groups.component.scss']
})
export class AddViewGroupsComponent {
  groupForm: FormGroup;
  isSubmitted = false;
  formOptions: any[] = [];
  formSteps: any[] = [];
  groupOptions: any[] = [];

  constructor(
    private httpService: HttpRequestsService,
    private utlity: UtilityService,
    private customFieldService: CustomFieldApiService
  ) { }

  ngOnInit() {
    this.initGroupForm();
    this.getFormList()
  }

  initGroupForm() {
    this.groupForm = new FormGroup({
      formId: new FormControl('' || null, [Validators.required]),
      stepId: new FormControl('' || null, [Validators.required]),
      groupName: new FormControl('', [Validators.required])
    });
  }

  async getFormList() {
    this.formOptions = await this.customFieldService.getFormList();
  }

  async getFormStepList() {
    this.formSteps = [];
    this.groupOptions = [];
    const formId = this.groupForm.value['formId'];
    this.groupForm.patchValue({stepId: null});
    if (formId) {
      this.formSteps = await this.customFieldService.getFormStepList(formId);
    }
    // this.formSteps = [];
    // if (steps.length > 0) {
    //   for (let index = 0; index < steps.length; index++) {
    //     const element: any = steps[index];
    //     if (element.form_id === formId) {
    //       this.formSteps = [...this.formSteps, element]
    //     }
    //   }
    // }
  }

  async getGroupList() {
    this.groupOptions = [];
    const stepId = this.groupForm.value['stepId']
    if (stepId) {
      this.groupOptions = await this.customFieldService.getGroupList(stepId);
    }
  }

  get formControls() {
    return this.groupForm.controls;
  }

  async onSubmit() {
    this.isSubmitted = true;
    this.groupForm.markAllAsTouched();
    if (this.groupForm.valid) {
      this.utlity.showLoading();
      const data = {
        "groupName": this.groupForm.value['groupName'],
        "form_id": this.groupForm.value['formId'],
        "step_id": this.groupForm.value['stepId'],
        "isActive": true
      }
      const result: any = await this.httpService.post(API_PATH.USER.FORM_GROUP_LIST, data, false);
      if (result.statusCode === 200) {
        this.utlity.showSuccessToast(result.message)
        this.groupForm.patchValue({ groupName: '' })
        this.isSubmitted = false;
        this.groupForm.markAsUntouched();
        this.getGroupList();
      } else {
        this.utlity.showErrorToast(result.message)
      }
      this.utlity.hideLoading();
    }
  }
}
