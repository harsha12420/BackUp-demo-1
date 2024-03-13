import { Component } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  ValidatorFn,
  Validators,
} from '@angular/forms';
import * as moment from 'moment';
import { ApiService } from 'src/app/services/api.service';
import { UtilityService } from 'src/app/services/utility.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-add-delete-attachment',
  templateUrl: './add-delete-attachment.component.html',
  styleUrls: ['./add-delete-attachment.component.scss'],
})
export class AddDeleteAttachmentComponent {
  addForm: FormGroup;
  list: any = [];
  isSubmitted = false;
  todayDate: any = '';

  constructor(
    private formBuilder: FormBuilder,
    private apiService: ApiService,
    private utils: UtilityService
  ) {}

  async ngOnInit() {
    this.todayDate = moment(new Date()).format('YYYY-MM-DD').toString();
    this.formInit();
    await this.getList();
  }

  async getList() {
    this.utils.showLoading();
    const response: any = await this.apiService.getdeleteAttachment();
    if (response.statusCode === 200) {
      this.list = response.data.DeleteAttachment;
    }
    this.utils.hideLoading();
  }

  formInit() {
    this.addForm = this.formBuilder.group(
      {
        start_date: ['', [Validators.required]],
        end_date: ['', [Validators.required]],
        reporting_types: [null, [Validators.required]],
      },
      {
        validator: this.dateRangeValidator(),
      }
    );
  }

  dateRangeValidator(): ValidatorFn {
    return (control: any): { [key: string]: boolean } | null => {
      const start_date = control.get('start_date').value;
      const end_date = control.get('end_date').value;
      if (start_date && end_date && new Date(start_date) > new Date(end_date)) {
        return { dateRange: true };
      }
      return null;
    };
  }

  get form() {
    return this.addForm.controls;
  }
  async onSubmit() {
    try {
      this.isSubmitted = true;
      if (this.addForm.invalid) {
        return;
      }
      this.utils.showLoading();
      const response: any = await this.apiService.deleteAttachment(
        this.addForm.value
      );
      this.utils.hideLoading();
      if (response.statusCode === 200) {
        this.utils.showSuccessToast(response.message);
        this.isSubmitted = false;
        this.addForm.reset();
      }
    } catch (error) {
      this.utils.hideLoading();
    }
  }

  deleteHoliday(id) {
    Swal.fire({
      icon: 'warning',
      title: 'Are you sure?',
      text: 'You will not be able to recover this holiday list!',
      showCancelButton: true,
      confirmButtonText: 'Yes, delete it!',
      confirmButtonColor: '#6259ca',
      cancelButtonText: 'No, cancel it!',
      cancelButtonColor: '#6259ca',
      reverseButtons: true,
    }).then(async (result: any) => {
      if (result.isConfirmed) {
        const response: any = await this.apiService.HolidayDelete(id);
        if ((response.statusCode = 200)) {
          Swal.fire({
            title: 'Deleted!',
            text: 'Your holiday list has been deleted.',
            icon: 'success',
            confirmButtonColor: '#6259ca',
          });
          await this.getList();
        }
      } else if (result.dismiss === Swal.DismissReason.cancel) {
        Swal.fire({
          title: 'Cancelled!',
          text: 'Your holiday list is safe :)',
          icon: 'error',
          confirmButtonColor: '#6259ca',
        });
      }
    });
  }
}
