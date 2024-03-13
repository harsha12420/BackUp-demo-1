import { Component, TemplateRef, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import {
  NgbDateStruct,
  NgbModal,
  NgbModalRef,
} from '@ng-bootstrap/ng-bootstrap';
import * as moment from 'moment';
import { Constants } from 'src/app/Constants/constants';
import { ApiService } from 'src/app/services/api.service';
import { ExportService } from 'src/app/services/export-service.service';
import { UtilityService } from 'src/app/services/utility.service';
import { NoSpace } from 'src/app/shared/validations/no-space.validator';
@Component({
  selector: 'app-division-transfe',
  templateUrl: './division-transfe.component.html',
  styleUrls: ['./division-transfe.component.scss'],
})
export class DivisionTransfeComponent {
  DivisionTransferForm: FormGroup;
  modalReference: NgbModalRef;
  pageLimit = Constants.PAGE_LIMIT;
  currentPage = Constants.STARTING_PAGE;
  find = '';
  totalItems: number;
  transferList: any = [];
  @ViewChild('DivisionTransfer', { static: false })
  DivisionTransfer: TemplateRef<any>;
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
    modalDialogClass: 'modal-lg',
  };
  TargetDivisionList: any;
  mediumId: any;
  mediumList: any;
  standardId: any;
  standardList: any;
  divisionList: any;
  TargetDivisionId: any;
  OldTargetDivisionId: any;
  studentId: any;
  constructor(
    private modalService: NgbModal,
    private formBuilder: FormBuilder,
    private apiService: ApiService,
    private exportService: ExportService,
    private utils: UtilityService,
    private router: Router
  ) {}
  async ngOnInit() {
    await this.getDivisionTransferList();
  }
  async getDivisionTransferList(isExport = false) {
    this.utils.showLoading();
    let queryList = `?search=${this.searchString}&page=${this.currentPage}&limit=${this.pageLimit}&sort=${this.sort}&orderby=${this.orderBy}`;
    if (isExport) {
      queryList += `&skip_pagination=true`;
    }
    const response: any = await this.apiService.getTransferStudentList('');
    if (!isExport && response.statusCode === 200) {
      response.data.studentData.forEach((ele) => {
        ele.division_transfer_date = ele.division_transfer_date
          ? moment
              .utc(ele.division_transfer_date)
              .local()
              .format('YYYY-MM-DD hh:mm A')
          : '-';
      });
      this.transferList = response.data.studentData;
      this.totalItems = response.data.totalCount;
    } else if (isExport && response.statusCode === 200) {
      response.data.studentData.forEach((ele) => {
        ele.division_transfer_date = ele.division_transfer_date
          ? moment
              .utc(ele.division_transfer_date)
              .local()
              .format('YYYY-MM-DD hh:mm A')
          : '-';
      });
      return response.data.result;
    }
    this.utils.hideLoading();
  }
  onPageChange = async (page: any) => {
    this.currentPage = page;
    this.getDivisionTransferList();
  };
  addDivision() {
    this.router.navigate(['/admin/student/division-transfer-list']);
  }
  onModalOpen() {
    this.formInit();
    this.modalReference = this.modalService.open(
      this.DivisionTransfer,
      this.config
    );
    this.modalReference.hidden.subscribe(() => {
      this.onModalClose();
    });
    this.getMediumList();
  }
  formInit() {
    this.DivisionTransferForm = this.formBuilder.group({
      StudentName: ['', [Validators.required, NoSpace()]],
      medium_id: [null, Validators.required],
      standard_id: [null, Validators.required],
      division_id: [null, Validators.required],
      transferReason: ['', NoSpace()],
    });
  }
  get form() {
    return this.DivisionTransferForm.controls;
  }
  async onSubmit() {
    try {
      this.isSubmitted = true;
      if (this.DivisionTransferForm.invalid) {
        return;
      }
      this.utils.showLoading();
      const obj = {
        student_data: [
          {
            student_id: this.EditId,
            target_division: this.TargetDivisionId,
            transfer_reason:
              this.DivisionTransferForm.controls['transferReason'].value,
            old_division_id: this.OldTargetDivisionId,
          },
        ],
      };

      // this.EditId ? (obj['student_id'] = this.EditId) : '';

      const response: any = await this.apiService.updateDivisionTransfer(obj);
      this.utils.hideLoading();
      if (response.statusCode === 200) {
        this.utils.showSuccessToast(response.message);
        this.onModalClose();
        this.getDivisionTransferList();
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
  async editDivisionTransferList(listId) {
    this.EditId = listId;
    this.onModalOpen();
    const response: any =
      await this.apiService.getByIdDivisionTransferStudentList(listId);
    if ((response.statusCode = 200)) {
      this.DivisionTransferForm.controls['StudentName'].setValue(
        response.data.studentData[0].first_name +
          ' ' +
          response.data.studentData[0].middle_name +
          ' ' +
          response.data.studentData[0].last_name
      );
      this.DivisionTransferForm.controls['medium_id'].setValue(
        response.data.studentData[0].medium
      );
      this.mediumId = response.data.studentData[0].medium_id;
      this.DivisionTransferForm.controls['standard_id'].setValue(
        response.data.studentData[0].target_standard
      );

      this.standardId = response.data.studentData[0].standard_id;
      this.DivisionTransferForm.controls['division_id'].setValue(
        response.data.studentData[0].division
      );

      this.TargetDivisionId = response.data.studentData[0].division_id;
      this.OldTargetDivisionId = response.data.studentData[0].division_id;
      this.DivisionTransferForm.controls['transferReason'].setValue(
        response.data.studentData[0].division_transfer_reason
      );
      this.getStandardList();
      this.getDivisionData(this.standardId);
    }
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
    this.getDivisionTransferList();
  }

  getTargetDivisionId(event) {
    this.TargetDivisionId = event;
  }
  getMediumId(event) {
    this.DivisionTransferForm.controls['standard_id'].setValue(null);
    this.mediumId = +event;
    this.getStandardList();
  }
  async getMediumList() {
    this.utils.showLoading();
    let queryList = `?skip_pagination=true`;

    const response: any = await this.apiService.getMediumList(queryList);
    if (response.statusCode === 200) {
      this.mediumList = response.data.result;
    }
    this.utils.hideLoading();
  }
  getstandardId(event) {
    this.standardId = +event;
    this.getDivisionData(this.standardId);
  }

  async getStandardList() {
    let queryList = this.mediumId;
    const response: any = await this.apiService.getStandardListById(queryList);
    if (response.statusCode === 200) {
      this.standardList = response.data.result;
    }
  }
  async getDivisionData(id) {
    const response: any = await this.apiService.getDivisionListById(id);
    if (response.statusCode === 200) {
      this.divisionList = response.data.result;
    }
  }

  async exportAll(exportType) {
    const data: any = [];
    const headerRow = [
      'Student ID',
      'Student Name',
      'Target Division',
      'Transfer Date',
      ' Transfer Reason',
    ];
    if (exportType != 'pdf') {
      data.push(headerRow);
    }
    const arr: any = await this.getDivisionTransferList(true);
    for (const item of arr) {
      const rowData = [
        item.student_id,
        item.first_name + ' ' + item.middle_name + ' ' + item.last_name,
        item.division,
        item.division_transfer_date,
        item.division_transfer_reason ? item.division_transfer_reason : '-',
      ];
      data.push(rowData);
    }
    this.exportService.exportData(
      exportType,
      headerRow,
      data,
      `Division Transfer List`
    );
  }
}
