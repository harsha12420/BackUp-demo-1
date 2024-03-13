import { CdkDragDrop, moveItemInArray } from '@angular/cdk/drag-drop';
import { Component } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { API_PATH } from 'src/app/Constants/constants';
import { ApiService } from 'src/app/services/api.service';
import { HttpRequestsService } from 'src/app/services/http-requests.service';
import { UtilityService } from 'src/app/services/utility.service';
import { CustomFieldApiService } from 'src/app/shared/services/custom-field-api.service';

@Component({
  selector: 'app-add-view-steps',
  templateUrl: './add-view-steps.component.html',
  styleUrls: ['./add-view-steps.component.scss']
})
export class AddViewStepsComponent {
  stepForm: FormGroup;
  isSubmitted = false;
  formOptions: any[] = [];
  formSteps: any[] = [];

  constructor(
    private httpService: HttpRequestsService,
    private utlity: UtilityService,
    private customFieldService: CustomFieldApiService,
    private apiService: ApiService
  ) { }

  ngOnInit() {
    this.initStepForm();
    this.getFormList()
  }

  initStepForm() {
    this.stepForm = new FormGroup({
      formId: new FormControl('' || null, [Validators.required]),
      stepName: new FormControl('', [Validators.required])
    });
  }

  async getFormList() {
    this.formOptions = await this.customFieldService.getFormList();
  }

  async getFormStepList() {
    this.formSteps = [];
    const formId = this.stepForm.value['formId'];
    if (formId) {
      this.formSteps = await this.customFieldService.getFormStepList(formId);
      this.formSteps.sort((a, b) => a.sequence - b.sequence);
    }
  }

  get formControls() {
    return this.stepForm.controls;
  }

  async onSubmit() {
    this.isSubmitted = true;
    this.stepForm.markAllAsTouched();
    if (this.stepForm.valid) {
      this.utlity.showLoading();
      const data = {
        "stepName": this.stepForm.value['stepName'],
        "form_id": this.stepForm.value['formId'],
        "isActive": true,
        "sequence": this.formSteps.length + 1
      }
      const result: any = await this.httpService.post(API_PATH.USER.STEP_LIST, data, false);
      if (result.statusCode === 200) {
        this.utlity.showSuccessToast(result.message)
        this.stepForm.patchValue({ stepName: '' })
        this.isSubmitted = false;
        this.stepForm.markAsUntouched();
        this.getFormStepList();
      } else {
        this.utlity.showErrorToast(result.message)
      }
      this.utlity.hideLoading();
    }
  }

  async drop(event: CdkDragDrop<any[]>) {
    try {
      moveItemInArray(this.formSteps, event.previousIndex, event.currentIndex);
      let data: any = {
        form_id: this.stepForm.value['formId'],
        sequenceIds: []
      }
      this.formSteps.forEach((element, index) => {
        let json = {
          id: element._id,
          sequence: index + 1
        }
        data.sequenceIds.push(json);
      });
      const response: any = await this.apiService.addStepSequence(data);
      if ((response.statusCode = 200)) {
        this.getFormStepList();
        this.utlity.showSuccessToast(response.message);
      }
    } catch (error) {
      this.utlity.hideLoading();
    }
  }
}
