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
import { NoSpace } from 'src/app/shared/validations/no-space.validator';
import Swal from 'sweetalert2';
@Component({
  selector: 'app-lc-approval-with-fees-record',
  templateUrl: './lc-approval-with-fees-record.component.html',
  styleUrls: ['./lc-approval-with-fees-record.component.scss'],
})
export class LcApprovalWithFeesRecordComponent {
  lcApprovalForm: FormGroup;
  modalReference: NgbModalRef;
  pageLimit = Constants.PAGE_LIMIT;
  currentPage = Constants.STARTING_PAGE;
  find = '';
  totalItems: number;
  lcApprovalList: any = [];
  @ViewChild('lcApproval', { static: false })
  lcApproval: TemplateRef<any>;
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
  lcApplicationList: any;

  attendanceValue: any;
  lcApplicationId: any;
  showApprovalCheckbox = true;
  staffLists: any;
  adminId: any;
  approvalYesControl: any;

  constructor(
    private modalService: NgbModal,
    private formBuilder: FormBuilder,
    private apiService: ApiService,
    private utils: UtilityService
  ) {}

  async ngOnInit() {
    await this.getLcApprovalWithFeesList();
  }

  async getLcApprovalWithFeesList() {
    this.utils.showLoading();
    const queryList = `?search=${this.searchString}&page=${
      this.currentPage
    }&limit=${this.pageLimit}&sort=${this.sort}&orderby=${
      this.orderBy
    }&isApprove=${true}`;
    const response: any = await this.apiService.getLcApprocalFeeRecordList(
      queryList
    );
    if (response.statusCode === 200) {
      this.lcApprovalList = response.data.result;
      this.totalItems = response.data.totalCount;
    }
    this.utils.hideLoading();
  }

  onPageChange = async (page: any) => {
    this.currentPage = page;
    this.getLcApprovalWithFeesList();
  };
  onModalOpen() {
    this.formInit();
    this.modalReference = this.modalService.open(this.lcApproval, this.config);
    this.modalReference.hidden.subscribe(() => {
      this.onModalClose();
    });
    this.getLcApplicationList();
    this.getAllStaff();
  }
  formInit() {
    this.lcApprovalForm = this.formBuilder.group({
      lcApplication: ['', Validators.required],
      studentId: [null],
      studentName: [null],
      admin: ['', Validators.required],
      paidFees: [null],
      dueFees: [null],
      totalFees: [null],
      approvalYes: ['', Validators.required],
    });
  }
  get form() {
    return this.lcApprovalForm.controls;
  }
  async onSubmit() {
    try {
      this.isSubmitted = true;
      if (this.lcApprovalForm.invalid) {
        return;
      }
      this.utils.showLoading();
      const data = {
        is_approve: this.approvalYesControl,
        user_id: this.adminId,
      };

      const response: any = await this.apiService.updateLcApprocalFeeRecord(
        data,
        this.lcApplicationId
      );
      this.utils.hideLoading();
      if (response.statusCode === 200) {
        this.utils.showSuccessToast(response.message);
        this.onModalClose();
        this.getLcApprovalWithFeesList();
      }
    } catch (error) {
      this.utils.hideLoading();
    }
  }
  onModalClose() {
    this.isSubmitted = false;
    this.EditId = null;
    this.modalReference.close();
    this.showApprovalCheckbox = true;
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
    this.getLcApprovalWithFeesList();
  }
  async getLcApplicationList() {
    const queryList = `?isApprove=${false}&skip_pagination=${true}`;
    const response: any = await this.apiService.getlcList(queryList);
    if (response.statusCode === 200) {
      this.lcApplicationList = response.data.result;
    }
  }
  async lcApplicationNo(event) {
    const queryList = `?id=${event}`;

    if (event) {
      this.lcApplicationId = event;

      const response: any = await this.apiService.getLcApprocalFeeRecordList(
        queryList
      );
      if ((response.statusCode = 200)) {
        this.lcApprovalForm.controls['studentId'].setValue(
          response.data.result[0].lcApplication.student_id
        );
        this.lcApprovalForm.controls['studentName'].setValue(
          response.data.result[0].lcApplication.studentdetails.first_name +
            response.data.result[0].lcApplication.studentdetails.middle_name +
            response.data.result[0].lcApplication.studentdetails.last_name
        );
        this.lcApprovalForm.controls['paidFees'].setValue(
          response.data.result[0].lcApplication.fee_paid_amount
        );
        this.lcApprovalForm.controls['dueFees'].setValue(
          response.data.result[0].lcApplication.fee_due_amount
        );
        this.lcApprovalForm.controls['totalFees'].setValue(
          response.data.result[0].lcApplication.fee_total_amount
        );
      }
      // let dueFeesValue = response.data.result[0].lcApplication.fee_due_amount;
      let dueFeesValue = 0;
      console.log('test', dueFeesValue);

      if (dueFeesValue === 0) {
        this.showApprovalCheckbox = true;
      } else {
        this.showApprovalCheckbox = false;
      }
    }
  }

  handleCheckboxClick() {
    this.approvalYesControl =
      this.lcApprovalForm.controls['approvalYes']?.value;
  }
  async getAllStaff() {
    this.utils.showLoading();
    const response: any = await this.apiService.getAllStaff();
    if (response.statusCode === 200) {
      this.staffLists = response.data.findUser;
    }
    this.utils.hideLoading();
  }
  getadminId(event) {
    this.adminId = +event;
  }
}
