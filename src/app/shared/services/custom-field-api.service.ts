import { Injectable } from '@angular/core';
import { API_PATH } from 'src/app/Constants/constants';
import { HttpRequestsService } from 'src/app/services/http-requests.service';
import { UtilityService } from 'src/app/services/utility.service';

@Injectable({
  providedIn: 'root',
})
export class CustomFieldApiService {
  constructor(
    private httpService: HttpRequestsService,
    private utility: UtilityService
  ) { }

  async getCustomFields(isActive = false, params) {
    this.utility.showLoading();
    let customFields = [];
    const activeParams = isActive ? `&isActive=${isActive}` : '';
    const result: any = await this.httpService.get(
      `${API_PATH.USER.CUSTOM_FIELD}${params}${activeParams}`,
      false
    );
    if (result.statusCode === 200) {
      customFields = result;
    }
    this.utility.hideLoading();
    return customFields;
  }

  async getFormStepList(formId) {
    this.utility.showLoading();
    let formStepList = [];
    const result: any = await this.httpService.get(
      `${API_PATH.USER.STEP_LIST}?form_id=${formId}`,
      false
    );
    if (result.statusCode === 200) {
      formStepList = result.data.result;
    }
    this.utility.hideLoading();
    return formStepList;
  }

  async getFormList() {
    this.utility.showLoading();
    let formList = [];
    const result: any = await this.httpService.get(
      `${API_PATH.USER.FORM_LIST}`,
      false
    );
    if (result.statusCode === 200) {
      formList = result.data.result;
    }
    this.utility.hideLoading();
    return formList;
  }

  async getGroupList(stepId) {
    this.utility.showLoading();
    let groupList = [];
    const result: any = await this.httpService.get(
      `${API_PATH.USER.FORM_GROUP_LIST}?step_id=${stepId}`,
      false
    );
    if (result.statusCode === 200) {
      groupList = result.data.result;
    }
    this.utility.hideLoading();
    return groupList;
  }

  async getFormWiseFields(formId, stepId = '' || null) {
    this.utility.showLoading();
    let customFields = [];
    const stepParams = stepId ? `&step_id=${stepId}` : '';
    const result: any = await this.httpService.get(
      `${API_PATH.USER.SAVE_GET_FROM_FIELD}?form_id=${formId}${stepParams}`,
      false
    );
    if (result.statusCode === 200) {
      customFields = result.data.result;
    }
    this.utility.hideLoading();
    return customFields;
  }

  async getSelectedFields(formId, stepId = '', groupId = '') {
    this.utility.showLoading();
    let customFields = [];
    const formIdParams = `form_id=${formId}`;
    const stepIdParams = stepId ? `&step_id=${stepId}` : '';
    const groupIdParams = groupId ? `&group_id=${groupId}` : '';
    const result: any = await this.httpService.get(
      `${API_PATH.USER.SELECTED_FIELDS}?${formIdParams}${stepIdParams}${groupIdParams}`,
      false
    );
    if (result.statusCode === 200) {
      customFields = result.data;
    }
    this.utility.hideLoading();
    return customFields;
  }

  async getFormFieldsBySequence(formId, stepId = '', groupId = '') {
    this.utility.showLoading();
    let customFields = [];
    const formIdParams = `form_id=${formId}`;
    const stepIdParams = stepId ? `&step_id=${stepId}` : '';
    const groupIdParams = groupId ? `&group_id=${groupId}` : '';
    const result: any = await this.httpService.get(
      `${API_PATH.USER.CUSTOM_FORM_FIELDS}?${formIdParams}${stepIdParams}${groupIdParams}`,
      false
    );
    if (result.statusCode === 200) {
      customFields = result.data.result;
    }
    this.utility.hideLoading();
    return customFields;
  }

  presignedUrl = async (data) => {
    return this.httpService.post(
      API_PATH.USER.CUSTOM_FIELD_PRESIGNED_URL,
      data
    );
  };
}
