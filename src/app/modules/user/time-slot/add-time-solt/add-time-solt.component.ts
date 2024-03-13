import { Component, TemplateRef, ViewChild } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  ValidatorFn,
  Validators,
} from '@angular/forms';
import {
  NgbDateStruct,
  NgbModal,
  NgbModalRef,
} from '@ng-bootstrap/ng-bootstrap';
import * as moment from 'moment';
import {
  BsDatepickerViewMode,
  BsDaterangepickerConfig,
} from 'ngx-bootstrap/datepicker';
import { Constants } from 'src/app/Constants/constants';
import { ApiService } from 'src/app/services/api.service';
import { ExportService } from 'src/app/services/export-service.service';
import { UtilityService } from 'src/app/services/utility.service';
import { NoSpace } from 'src/app/shared/validations/no-space.validator';
import Swal from 'sweetalert2';
@Component({
  selector: 'app-add-time-solt',
  templateUrl: './add-time-solt.component.html',
  styleUrls: ['./add-time-solt.component.scss'],
})
export class AddTimeSoltComponent {
  timeSlotForm: FormGroup;
  modalReference: NgbModalRef;
  pageLimit = Constants.PAGE_LIMIT;
  currentPage = Constants.STARTING_PAGE;
  find = '';
  totalItems: number;
  timeSlotList: any = [];
  @ViewChild('Department', { static: false })
  Department: TemplateRef<any>;
  isSubmitted = false;
  model1!: NgbDateStruct;
  EditId: any;
  searchString = '';
  orderBy: any = 'created_at';
  sort = 'DESC';
  isAscending = false;
  config = {
    backdrop: true,
    ignoreBackdropClick: true,
    class: 'modal-md',
    centered: true,
    modalDialogClass: 'modal-xl',
  };
  public mindate: Date;
  public maxdate: Date;
  sessionlist: any;
  sessionId: any;

  constructor(
    private modalService: NgbModal,
    private formBuilder: FormBuilder,
    private apiService: ApiService,
    private exportService: ExportService,
    private utils: UtilityService
  ) {}

  async ngOnInit() {
    await this.getTimeSlotList();
  }

  async getTimeSlotList(isExport = false) {
    this.utils.showLoading();
    let queryList = `?search=${this.searchString}&page=${this.currentPage}&limit=${this.pageLimit}&sort=${this.sort}&orderby=${this.orderBy}`;
    if (isExport) {
      queryList += `&skip_pagination=true`;
    }
    const response: any = await this.apiService.getByIdTimeSlot(queryList);
    if (!isExport && response.statusCode === 200) {
      this.timeSlotList = response.data.result.map((item) => {
        const fromTime = moment(item.from_time).format('hh:mm A');
        const toTime = moment(item.to_time).format('hh:mm A');

        return {
          ...item,
          from_time: fromTime,
          to_time: toTime,
        };
      });
      this.totalItems = response.data.totalCount;
    } else if (isExport && response.statusCode === 200) {
      this.utils.hideLoading();
      return response.data.result.map((item) => {
        const fromTime = moment(item.from_time).format('hh:mm A');
        const toTime = moment(item.to_time).format('hh:mm A');

        return {
          ...item,
          from_time: fromTime,
          to_time: toTime,
        };
      });
    }
    this.utils.hideLoading();
  }

  onPageChange = async (page: any) => {
    this.currentPage = page;
    this.getTimeSlotList();
  };
  onModalOpen() {
    this.formInit();
    this.modalReference = this.modalService.open(this.Department, this.config);
    this.modalReference.hidden.subscribe(() => {
      this.onModalClose();
    });
    this.getList();
  }
  formInit() {
    this.timeSlotForm = this.formBuilder.group(
      {
        Start_Time: [null, Validators.required],
        End_Time: [null, Validators.required],
        range: ['', Validators.required],
        Session: [null, Validators.required],
        Capacity: ['', [Validators.required]],
        Status: ['true', Validators.required],
      },
      {
        validator: this.minMaxValidator(),
      }
    );
  }
  get form() {
    return this.timeSlotForm.controls;
  }
  async onSubmit() {
    try {
      this.isSubmitted = true;
      if (this.timeSlotForm.invalid) {
        return;
      }
      this.utils.showLoading();
      const from_time = moment(this.timeSlotForm.value.Start_Time)
        .utc()
        .format('HH:mm:ss');
      const End_Time = moment(this.timeSlotForm.value.End_Time)
        .utc()
        .format('HH:mm:ss');

      const obj = {
        session_id: this.sessionId,
        start_date: moment(this.timeSlotForm.value.range[0])
          .utc()
          .format('YYYY-MM-DD'),
        end_date: moment(this.timeSlotForm.value.range[1])
          .utc()
          .format('YYYY-MM-DD'),
        from_time: from_time,
        to_time: End_Time,
        capacity: this.timeSlotForm.controls['Capacity'].value,
        isActive:
          this.timeSlotForm.controls['Status'].value == 'true' ? true : false,
      };
      this.EditId ? (obj['id'] = this.EditId) : '';
      const response: any = await this.apiService.addTimeSlot(obj);

      this.utils.hideLoading();
      if (response.statusCode === 200) {
        this.utils.showSuccessToast(response.message);
        this.onModalClose();
        this.getTimeSlotList();
      }
    } catch (error) {
      this.utils.hideLoading();
    }
  }
  onModalClose() {
    this.isSubmitted = false;
    this.EditId = null;
    this.modalReference.close();
  }
  async editTimeSlot(listId) {
    this.EditId = listId;
    const queryList = `?id=${listId}`;

    this.onModalOpen();
    const response: any = await this.apiService.getByIdTimeSlot(queryList);
    if ((response.statusCode = 200)) {
      this.timeSlotForm.controls['Session'].setValue(
        response.data.list.session_id._id
      );

      this.sessionId = response.data.list.session_id._id;
      this.timeSlotForm.controls['Status'].setValue(
        response.data.list.isActive.toString()
      );
      const fromtime = moment(response.data.list.from_time);
      const selectedTime = {
        hour: fromtime.hour(),
        minute: fromtime.minutes(),
      };

      this.timeSlotForm.controls['Start_Time'].setValue(selectedTime);

      this.timeSlotForm.controls['Capacity'].setValue(
        response.data.list.capacity
      );
      const endTime = moment(response.data.list.to_time);

      const selectedEndTime = {
        hour: endTime.hour(),
        minute: endTime.minutes(),
      };
      this.timeSlotForm.controls['End_Time'].setValue(selectedEndTime);
      const momentObject = moment(response.data.list.slot_date);
      const startDate = momentObject.toDate();
      const endDate = momentObject.toDate();
      this.timeSlotForm.controls['range'].setValue([startDate, endDate]);
    }
  }

  deleteTimeSlot(id) {
    Swal.fire({
      icon: 'warning',
      title: 'Are you sure?',
      text: 'You will not be able to recover  Time Slot !',
      showCancelButton: true,
      confirmButtonText: 'Yes, delete it!',
      confirmButtonColor: '#6259ca',
      cancelButtonText: 'No, cancel it!',
      cancelButtonColor: '#6259ca',
      reverseButtons: true,
    }).then(async (result: any) => {
      if (result.isConfirmed) {
        const response: any = await this.apiService.deleteTimeSlot(id);
        if ((response.statusCode = 200)) {
          Swal.fire({
            title: 'Deleted!',
            text: 'Your Time Slot been deleted.',
            icon: 'success',
            confirmButtonColor: '#6259ca',
          });
          await this.getTimeSlotList();
        }
      } else if (result.dismiss === Swal.DismissReason.cancel) {
        Swal.fire({
          title: 'Cancelled!',
          text: 'Your Department  is safe :)',
          icon: 'error',
          confirmButtonColor: '#6259ca',
        });
      }
    });
  }
  onSearch() {
    if (this.searchString.trim() !== '') {
      this.onPageChange(1);
    }
  }
  onClear() {
    if (this.searchString) {
      this.searchString = '';
      this.onPageChange(1);
    }
  }

  sortData(columnName) {
    if (this.orderBy === columnName) {
      this.isAscending = !this.isAscending;
      this.sort = this.isAscending ? 'ASC' : 'DESC';
    } else {
      this.isAscending = true;
      this.sort = 'ASC';
    }
    this.orderBy = columnName;
    this.getTimeSlotList();
  }
  async getList() {
    const queryList = `?sort=DESC&skip_pagination=true&isActive=true`;
    const response: any = await this.apiService.getSessionList(queryList);

    if (response.statusCode === 200) {
      this.sessionlist = response.data.result;
    }
  }
  getSessionId(event) {
    this.sessionId = event;
  }
  async exportAll(exportType) {
    const data: any = [];
    const headerRow = [
      'Session Name',
      'Date',
      'Time (Start--End)',
      'Capacity',
      'Date & Time',
    ];
    if (exportType != 'pdf') {
      data.push(headerRow);
    }
    const arr: any = await this.getTimeSlotList(true);
    for (const item of arr) {
      const rowData = [
        item.session.name || '-',
        moment(item.slot_date).format('YYYY-MM-DD hh:mm A') || '-',
        item.from_time + ' - ' + item.to_time || '-',
        item.capacity || '-',
        moment(item.created_at).format('YYYY-MM-DD hh:mm A') || '-',
      ];
      data.push(rowData);
    }
    this.exportService.exportData(
      exportType,
      headerRow,
      data,
      `Exported Time Slot List${moment().format('YYYY-MM-DD')}`
    );
  }
  minMaxValidator(): ValidatorFn {
    return (control: any): { [key: string]: boolean } | null => {
      const startTime = control.get('Start_Time').value;
      const endTime = control.get('End_Time').value;
      if (startTime && endTime) {
        const start_time = startTime.hour + ':' + startTime.minute;
        const end_time = endTime.hour + ':' + endTime.minute;

        const momentStartTime = moment(start_time, 'HH:mm');
        const momentEndTime = moment(end_time, 'HH:mm');

        if (momentStartTime.isSameOrAfter(momentEndTime)) {
          return { timemax: true };
        }
      }
      return null;
    };
  }
}
