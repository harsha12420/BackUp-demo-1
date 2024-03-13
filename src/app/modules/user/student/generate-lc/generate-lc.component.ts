import { Component, TemplateRef, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import {
  NgbDateStruct,
  NgbModal,
  NgbModalRef,
} from '@ng-bootstrap/ng-bootstrap';
import * as moment from 'moment';
import { Constants } from 'src/app/Constants/constants';
import { ApiService } from 'src/app/services/api.service';
import { UtilityService } from 'src/app/services/utility.service';
import { NoSpace } from 'src/app/shared/validations/no-space.validator';
import { environment } from 'src/environments/environment';
import Swal from 'sweetalert2';
@Component({
  selector: 'app-generate-lc',
  templateUrl: './generate-lc.component.html',
  styleUrls: ['./generate-lc.component.scss'],
})
export class GenerateLcComponent {
  GenerateLcForm: FormGroup;
  modalReference: NgbModalRef;
  pageLimit = Constants.PAGE_LIMIT;
  currentPage = Constants.STARTING_PAGE;
  find = '';
  totalItems: number;
  mediaUrl = environment.MEDIA_URL;
  getGenerateLcList: any = [];
  @ViewChild('GenerateLc', { static: false })
  GenerateLc: TemplateRef<any>;
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
  lcApplicationId: any;

  constructor(
    private modalService: NgbModal,
    private formBuilder: FormBuilder,
    private apiService: ApiService,
    private utils: UtilityService
  ) {}

  async ngOnInit() {
    await this.getGenerateList();
  }

  async getGenerateList() {
    this.utils.showLoading();
    const queryList = `?search=${this.searchString}&page=${this.currentPage}&limit=${this.pageLimit}&sort=${this.sort}&orderby=${this.orderBy}`;
    const response: any = await this.apiService.getGenerateLcList(queryList);
    if (response.statusCode === 200) {
      response.data.result.forEach((ele) => {
        ele.lc_issue_date = moment
          .utc(ele.lc_issue_date)
          .local()
          .format('YYYY-MM-DD');
      });
      this.getGenerateLcList = response.data.result;
      this.totalItems = response.data.totalCount;
    }
    this.utils.hideLoading();
  }

  onPageChange = async (page: any) => {
    this.currentPage = page;
    this.getGenerateList();
  };
  onModalOpen() {
    this.formInit();
    this.modalReference = this.modalService.open(this.GenerateLc, this.config);
    this.modalReference.hidden.subscribe(() => {
      this.onModalClose();
    });
    this.getLcApplicationList();
  }
  formInit() {
    this.GenerateLcForm = this.formBuilder.group({
      lcApplication: ['', Validators.required],
      date: ['', [Validators.required]],
      lCBookNumber: ['', [Validators.required, NoSpace()]],
      lCNumber: ['', [Validators.required, NoSpace()]],
    });
  }
  get form() {
    return this.GenerateLcForm.controls;
  }
  async onSubmit() {
    try {
      this.isSubmitted = true;
      if (this.GenerateLcForm.invalid) {
        return;
      }
      this.utils.showLoading();

      const obj = {
        lc_application_id: this.lcApplicationId,
        lc_issue_date: this.GenerateLcForm.controls['date'].value,
        lc_book_number: this.GenerateLcForm.controls['lCBookNumber'].value,
        lc_number: this.GenerateLcForm.controls['lCNumber'].value,
      };
      this.EditId ? (obj['id'] = this.EditId) : '';
      const response: any = await this.apiService.updateGenerateLc(obj);
      this.utils.hideLoading();
      if (response.statusCode === 200) {
        this.utils.showSuccessToast(response.message);
        this.onModalClose();
        this.getGenerateList();
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
  // async editGenerateLc(listId) {
  //   this.EditId = listId;
  //   this.onModalOpen();
  //   // const response: any = await this.apiService.getDepartmentId(listId);
  //   // if ((response.statusCode = 200)) {
  //   //   this.GenerateLcForm.controls["name"].setValue(response.data.name);
  //   // }
  // }

  // deleteGenerateLc(id) {
  //   Swal.fire({
  //     icon: "warning",
  //     title: "Are you sure?",
  //     text: "You will not be able to recover  Department !",
  //     showCancelButton: true,
  //     confirmButtonText: "Yes, delete it!",
  //     confirmButtonColor: "#6259ca",
  //     cancelButtonText: "No, cancel it!",
  //     cancelButtonColor: "#6259ca",
  //     reverseButtons: true,
  //   }).then(async (result: any) => {
  //     if (result.isConfirmed) {
  //       // const response: any = await this.apiService.DepartmentDelete(id);
  //       // if ((response.statusCode = 200)) {
  //       //   Swal.fire({
  //       //     title: "Deleted!",
  //       //     text: "Your Department been deleted.",
  //       //     icon: "success",
  //       //     confirmButtonColor: "#6259ca",
  //       //   });
  //       //   await this.getGenerateList();
  //       // }
  //     } else if (result.dismiss === Swal.DismissReason.cancel) {
  //       Swal.fire({
  //         title: "Cancelled!",
  //         text: "Your Department  is safe :)",
  //         icon: "error",
  //         confirmButtonColor: "#6259ca",
  //       });
  //     }
  //   });
  // }
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
    this.getGenerateList();
  }
  async getLcApplicationList() {
    this.utils.showLoading();
    const queryList = `?skip_pagination=${true}`;
    const response: any = await this.apiService.getLcApprocalFeeRecordList(
      queryList
    );
    if (response.statusCode === 200) {
      this.lcApplicationList = response.data.result;
    }
    this.utils.hideLoading();
  }
  lcApplicationNo(event) {
    this.lcApplicationId = event;
  }
  downloadGenerateLc(url) {
    let a = document.createElement('a');
    a.href = this.mediaUrl + url;
    a.target = '_blank';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  }
}
