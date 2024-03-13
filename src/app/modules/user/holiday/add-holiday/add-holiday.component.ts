import { Component, TemplateRef, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import {
  NgbDateStruct,
  NgbModal,
  NgbModalRef,
} from '@ng-bootstrap/ng-bootstrap';
import { Constants } from 'src/app/Constants/constants';
import { ApiService } from 'src/app/services/api.service';
import { UtilityService } from 'src/app/services/utility.service';
import * as moment from 'moment';
import Swal from 'sweetalert2';
import { NgbDateParserFormatter } from '@ng-bootstrap/ng-bootstrap';
import { NoSpace } from 'src/app/shared/validations/no-space.validator';
import { ValidateDate } from 'src/app/shared/validations/date.validator';
import { ExportService } from 'src/app/services/export-service.service';

@Component({
  selector: 'app-add-holiday',
  templateUrl: './add-holiday.component.html',
  styleUrls: ['./add-holiday.component.scss'],
})
export class AddHolidayComponent {
  addHolidayForm: FormGroup;
  modalReference: NgbModalRef;
  pageLimit = Constants.PAGE_LIMIT;
  currentPage = Constants.STARTING_PAGE;
  totalItems: number;
  holidayList: any = [];
  searchString = '';

  @ViewChild('addHoliday', { static: false }) addHoliday: TemplateRef<any>;
  isSubmitted = false;
  model1!: NgbDateStruct;
  EditId: any;
  orderBy: any = 'created_at';
  sort = 'DESC'
  isAscending = false
  config = {
    backdrop: true,
    ignoreBackdropClick: true,
    class: 'modal-md',
    centered: true,
    modalDialogClass: 'modal-xl',
  };
  constructor(
    private modalService: NgbModal,
    private formBuilder: FormBuilder,
    private apiService: ApiService,
    private utils: UtilityService,
    private exportService:ExportService,
    private ngbDateParserFormatter: NgbDateParserFormatter
  ) { }

  async ngOnInit() {
    await this.getHolidayList();
  }

  async getHolidayList(isExport=false) {
    this.utils.showLoading();
    let queryList = `?search=${this.searchString}&page=${this.currentPage}&limit=${this.pageLimit}&sort=${this.sort}&orderby=${this.orderBy}`;
    const response: any = await this.apiService.getHolidayList(queryList);
    if (!isExport&&response.statusCode === 200) {
      this.holidayList = response.data.result;
      this.totalItems = response.data.totalCount;
    }
    else if (isExport&&response.statusCode === 200) {
      this.utils.hideLoading();
      return response.data.result;
    }
    this.utils.hideLoading();
  }

  onPageChange = async (page: any) => {
    this.currentPage = page;
    this.getHolidayList();
  };
  onModalOpen() {
    this.formInit();
    this.modalReference = this.modalService.open(this.addHoliday, this.config);
    this.modalReference.hidden.subscribe(() => {
      this.onModalClose();
    });
  }
  formInit() {
    this.addHolidayForm = this.formBuilder.group({
      name: ['', [Validators.required, NoSpace()]],
      holiday_date: ['', [Validators.required, ValidateDate()]],
    });
  }
  get form() {
    return this.addHolidayForm.controls;
  }
  async onSubmit() {
    try {
      this.isSubmitted = true;
      if (this.addHolidayForm.invalid) {
        return;
      }
      this.utils.showLoading();

      const holidayDate = this.addHolidayForm.value.holiday_date;
      const formattedDate = moment({
        year: holidayDate.year,
        month: holidayDate.month - 1,
        day: holidayDate.day,
      }).format('YYYY-MM-DD');
      const obj = {
        name: this.addHolidayForm.controls['name'].value,
        holiday_date: formattedDate,
      };
      this.EditId ? (obj['id'] = this.EditId) : '';
      const response: any = await this.apiService.addHoliday(obj);
      this.utils.hideLoading();
      if (response.statusCode === 200) {
        this.utils.showSuccessToast(response.message);
        this.onModalClose();
        this.getHolidayList();
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
  async editHoliday(listId) {
    this.EditId = listId;
    this.onModalOpen();
    const response: any = await this.apiService.getHolidayListId(listId);
    if ((response.statusCode = 200)) {
      const holidayDateFormatted = moment(response.data.holiday_date).format(
        'YYYY-MM-DD'
      );
      const parsedDate =
        this.ngbDateParserFormatter.parse(holidayDateFormatted);
      this.addHolidayForm.controls['name'].setValue(response.data.name);

      this.addHolidayForm.controls['holiday_date'].setValue(parsedDate);
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
          await this.getHolidayList();
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
      this.sort = this.isAscending ? 'ASC' : 'DESC'
    } else {
      this.isAscending = true;
      this.sort = 'ASC'
    }
    this.orderBy = columnName;
    this.getHolidayList();
  }

  async exportAll(exportType ){
    const data: any = [];
    const headerRow = [ 
      "Holiday Name",
      "Date",
   ]
    if (exportType != "pdf") {
      data.push(headerRow);
    }
    const arr: any = await this.getHolidayList(true);
    for (const item of arr) {
      const rowData = [
        item.name||"-",
        moment(item.date_joining).format("YYYY-MM-DD hh:mm A")||"-",
      ]
      data.push(rowData);
    }
    this.exportService.exportData(
      exportType,
      headerRow,
      data,
      `Exported Holiday List${ moment().format("YYYY-MM-DD")}`
    );
  }
}
