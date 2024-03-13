import { Component, ViewChild } from '@angular/core';
import { FormGroup, FormControl, Validators, FormArray } from '@angular/forms';
import { Router } from '@angular/router';
import AngularEditor from 'ckeditor/build/ckeditor';
import * as moment from 'moment';
import { API_PATH, Constants, InputFieldType } from 'src/app/Constants/constants';
import { HttpRequestsService } from 'src/app/services/http-requests.service';
import { UtilityService } from 'src/app/services/utility.service';
import { CustomFieldApiService } from 'src/app/shared/services/custom-field-api.service';

@Component({
  selector: 'app-field-list',
  templateUrl: './field-list.component.html',
  styleUrls: ['./field-list.component.scss']
})
export class FieldListComponent {
  @ViewChild('dp') dp;
  fields: any[] = [];
  addDaynamicTaskForm: FormGroup;
  validEmail = Constants.validEmail;
  isSubmitted = false;
  isFormVisible = false;
  min = moment().toDate();
  minTime = moment().format(Constants.TIME_FORMAT_HH_MM);
  datePickerConfig = {
    withTimepicker: true, keepDatepickerOpened: true, showWeekNumbers: false,
    dateInputFormat: 'dddd, MMMM DD, YYYY, h:mm:ss a', adaptivePosition: true,
  };
  inputFieldType = InputFieldType
  apiData: any;
  isApiDataFetched: boolean = false;
  selectedFile: File | undefined;
  editorData = 'DemoCK';
  public Editor: any = AngularEditor;
  pageLimit = Constants.PAGE_LIMIT;
  currentPage = Constants.STARTING_PAGE;
  totalItems: number = 0;

  constructor(
    private httpService: HttpRequestsService,
    private utility: UtilityService,
    private router: Router,
    private customFieldService: CustomFieldApiService
  ) {
  }

  ngOnInit() {
    this.getFields();
  }

  async getFields() {
    const params = `?page=${this.currentPage}&limit=${this.pageLimit}`
    const data: any = await this.customFieldService.getCustomFields(false, params);
    if (data.statusCode === 200) {
      this.fields = data?.data?.result;
      this.totalItems = data?.data.totalCount;
    }
  }

  redirectTo() {
    this.router.navigateByUrl('/admin/custom-field/add')
  }

  async enableDisableField(field, i) {
    const result = await this.httpService.post(API_PATH.USER.CHNAGE_STATUS, { id: field._id });
    if (result) {
      this.fields[i].isActive = !this.fields[i].isActive
      const message = this.fields[i].isActive ? 'Enabled successfully!!' : 'Disabled Successfully!!'
      this.utility.showSuccessToast(message)
    }
  }

  onPageChange = async (page: any) => {
    this.currentPage = page;
    this.getFields();
  };
}
