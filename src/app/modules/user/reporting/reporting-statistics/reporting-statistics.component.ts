import { Component } from "@angular/core";
import { FormBuilder, FormGroup, ValidatorFn, Validators } from "@angular/forms";
import * as moment from "moment";
import { Constants } from "src/app/Constants/constants";
import { ApiService } from "src/app/services/api.service";
import { ExportService } from "src/app/services/export-service.service";
import { UtilityService } from "src/app/services/utility.service";
@Component({
  selector: "app-reporting-statistics",
  templateUrl: "./reporting-statistics.component.html",
  styleUrls: ["./reporting-statistics.component.scss"],
})
export class ReportingStatisticsComponent {
  pageLimit = Constants.PAGE_LIMIT;
  currentPage = Constants.STARTING_PAGE;
  totalItems: number;
  list: any = [];
  searchString = "";
  orderBy: any = 'created_at';
  sort = 'DESC'
  isAscending = false
  dateForm: FormGroup;
  isSubmitted = false;
  reportType = "ALL"
  dateFilter: any = "null";
  staffList: any = []
  userIds: any = [];
  constructor(private apiService: ApiService, private utils: UtilityService, private exportService: ExportService, private formBuilder: FormBuilder,) { }

  async ngOnInit() {
    this.formInit();
    await this.getList();
    this.getAllStaff();
  }
  async getAllStaff() {
    this.utils.showLoading();
    const response: any = await this.apiService.getAllStaff();
    if (response.statusCode === 200) {
      this.staffList = response.data.staffs;
    }
    this.utils.hideLoading();
  }

  formInit() {
    this.dateForm = this.formBuilder.group({
      startDate: ["", [Validators.required]],
      endDate: ["", [Validators.required]],
    }, {
      validator: this.dateRangeValidator()
    });
  }

  dateRangeValidator(): ValidatorFn {
    return (control: any): { [key: string]: boolean } | null => {
      const startDate = control.get('startDate').value;
      const endDate = control.get('endDate').value;
      if (startDate && endDate && new Date(startDate) > new Date(endDate)) {
        return { 'dateRange': true };
      }
      return null;
    };
  }

  get form() {
    return this.dateForm.controls;
  }

  async getList(isExport = false) {
    this.utils.showLoading();
    let queryList = `?page=${this.currentPage}&limit=${this.pageLimit}&search=${this.searchString}&sort=${this.sort}&orderby=${this.orderBy}`;
    if (this.dateForm.valid) {
      const startDate: any = this.dateForm.value.startDate;
      const endDate: any = this.dateForm.value.endDate;
      queryList += `&start_date=${startDate}&end_date=${endDate}`;
    }
    if (isExport) queryList += `&skip_pagination=true`
    if (this.userIds.length) queryList += `&userIds=${this.userIds.toString()}`
    const response: any = await this.apiService.getStatisticsReporting(queryList);
    if (isExport && response.statusCode === 200) {
      this.utils.hideLoading();
      return response.data.result
    }
    if (response.statusCode === 200) {
      this.list = response.data.result;
      this.totalItems = response.data.totalCount;
    }
    this.utils.hideLoading();
  }

  async onDateClear() {
    this.dateForm.reset();
    this.isSubmitted = false;
    this.dateFilter = 'null';
    await this.getList();
  }

  async onSubmit() {
    this.isSubmitted = true;
    try {
      if (!this.dateForm.valid) return;
      await this.getList();
    } catch (error) {
      this.utils.hideLoading();
    }
  }

  changeDateFilter() {
    let today: any = moment().format('YYYY-MM-DD');
    switch (this.dateFilter) {
      case '1':
        this.dateForm.patchValue({ startDate: today, endDate: today })
        break;
      case '2':
        const startOfWeek = moment(today).startOf('week').format('YYYY-MM-DD');
        const endOfWeek = moment(today).endOf('week').format('YYYY-MM-DD');
        this.dateForm.patchValue({ startDate: startOfWeek, endDate: endOfWeek })
        break;
      case '3':
        const startDate = moment(today).startOf('month').format('YYYY-MM-DD');
        const endDate = moment(today).endOf('month').format('YYYY-MM-DD');
        this.dateForm.patchValue({ startDate: startDate, endDate: endDate })
        break;
    }
    this.getList();
  }

  onPageChange = async (page: any) => {
    this.currentPage = page;
    this.getList();
  };

  onSearch(userSearch = false) {
    if (this.searchString.trim() !== "" || userSearch) {
      this.onPageChange(1);
    }
  }

  onClear() {
    this.searchString = "";
    this.userIds = []
    this.onPageChange(1);
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
    this.getList();
  }

  async exportReportingStatistics(exportType: string) {
    const data: any = [];

    const headerRow = [
      'Reportee Designation',
      'Reported By',
      'Answered By',
      'Total Reports',
      'Unanswered Reports',
      'Answered Reports',
    ];

    if (exportType != 'pdf') {
      data.push(headerRow)
    }

    const arr: any = await this.getList(true);

    for (const item of arr) {
      const rowData = [
        item.role_name,
        item.created_first_name + " " + item.created_middle_name + " " + item.created_last_name,
        item.take_first_name + " " + item.take_middle_name + " " + item.take_last_name,
        +item.total_count,
        +item.answer_no,
        +item.answer_yes,
      ];
      data.push(rowData);
    }
    this.exportService.exportData(exportType, headerRow, data, 'Reporting Statistics')
  }
}
