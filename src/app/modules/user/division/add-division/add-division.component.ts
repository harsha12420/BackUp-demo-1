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
import { ExportService } from 'src/app/services/export-service.service';
import { UtilityService } from 'src/app/services/utility.service';
import { NoSpace } from 'src/app/shared/validations/no-space.validator';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-add-division',
  templateUrl: './add-division.component.html',
  styleUrls: ['./add-division.component.scss'],
})
export class AddDivisionComponent {
  addDivisionForm: FormGroup;
  modalReference: NgbModalRef;
  pageLimit = Constants.PAGE_LIMIT;
  currentPage = Constants.STARTING_PAGE;
  find = '';
  totalItems: number;
  divisionList: any = [];
  @ViewChild('Division', { static: false })
  Division: TemplateRef<any>;
  isSubmitted = false;
  model1!: NgbDateStruct;
  EditId: any;
  searchString = '';
  orderBy: any = 'created_at';
  sort = 'DESC';
  isAscending = false;
  mediumList: any;
  config = {
    backdrop: true,
    ignoreBackdropClick: true,
    class: 'modal-md',
    centered: true,
    modalDialogClass: 'modal-xl',
  };
  mediumId: any;
  standardList: any;
  standardId: any;
  constructor(
    private modalService: NgbModal,
    private formBuilder: FormBuilder,
    private apiService: ApiService,
    private exportService: ExportService,
    private utils: UtilityService
  ) {}

  async ngOnInit() {
    await this.getDivisionList();
  }

  async getDivisionList(isExport=false) {
    this.utils.showLoading();
    let queryList = `?search=${this.searchString}&page=${this.currentPage}&limit=${this.pageLimit}&sort=${this.sort}&orderby=${this.orderBy}`;
    if (isExport) {
      queryList += `&skip_pagination=true`;
    }
    const response: any = await this.apiService.getDivisionList(queryList);
    if (!isExport&&response.statusCode === 200) {
      this.divisionList = response.data.result;
      this.totalItems = response.data.totalCount;
    } else if (isExport && response.statusCode === 200) {
      this.utils.hideLoading();
      return response.data.result;
    }
    else if (isExport&&response.statusCode === 200) {
      this.utils.hideLoading();
      return response.data.result;
    }
    this.utils.hideLoading();
  }

  onPageChange = async (page: any) => {
    this.currentPage = page;
    this.getDivisionList();
  };
  onModalOpen() {
    this.formInit();
    this.modalReference = this.modalService.open(this.Division, this.config);
    this.modalReference.hidden.subscribe(() => {
      this.onModalClose();
    });
    this.getMediumList();
  }
  formInit() {
    this.addDivisionForm = this.formBuilder.group({
      name: ['', [Validators.required, NoSpace()]],
      Status: ['true', Validators.required],
      strength: ['', [Validators.required]],
      medium_id: [null, Validators.required],
      standard_id: [null, Validators.required],
    });
  }
  get form() {
    return this.addDivisionForm.controls;
  }
  async onSubmit() {
    try {
      this.isSubmitted = true;
      if (this.addDivisionForm.invalid) {
        return;
      }
      this.utils.showLoading();

      const obj = {
        name: this.addDivisionForm.controls['name'].value,
        isActive:
          this.addDivisionForm.controls['Status'].value == 'true'
            ? true
            : false,
        medium_id: this.mediumId,
        strength: this.addDivisionForm.controls['strength'].value,
        standard_id: this.standardId,
      };
      this.EditId ? (obj['id'] = this.EditId) : '';
      const response: any = await this.apiService.addDivision(obj);
      this.utils.hideLoading();
      if (response.statusCode === 200) {
        this.utils.showSuccessToast(response.message);
        this.onModalClose();
        this.getDivisionList();
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
  async editDivision(listId) {
    this.EditId = listId;
    this.onModalOpen();
    const response: any = await this.apiService.getDivisionId(listId);
    if ((response.statusCode = 200)) {
      this.addDivisionForm.controls['name'].setValue(response.data[0].name);

      this.addDivisionForm.controls['Status'].setValue(
        response.data[0].is_active.toString()
      );
      this.addDivisionForm.controls['medium_id'].setValue(
        response.data[0].medium_name
      );
      this.mediumId = response.data[0].medium_id;
      this.addDivisionForm.controls['standard_id'].setValue(
        response.data[0].standard_name
      );

      this.standardId = response.data[0].standard_id;
      this.addDivisionForm.controls['strength'].setValue(
        response.data[0].strength
      );
    }
    this.getStandardList();
  }

  deleteDivision(id) {
    Swal.fire({
      icon: 'warning',
      title: 'Are you sure?',
      text: 'You will not be able to recover Division  !',
      showCancelButton: true,
      confirmButtonText: 'Yes, delete it!',
      confirmButtonColor: '#6259ca',
      cancelButtonText: 'No, cancel it!',
      cancelButtonColor: '#6259ca',
      reverseButtons: true,
    }).then(async (result: any) => {
      if (result.isConfirmed) {
        const response: any = await this.apiService.DivisionDelete(id);
        if ((response.statusCode = 200)) {
          Swal.fire({
            title: 'Deleted!',
            text: 'Your Division been deleted.',
            icon: 'success',
            confirmButtonColor: '#6259ca',
          });
          await this.getDivisionList();
        }
      } else if (result.dismiss === Swal.DismissReason.cancel) {
        Swal.fire({
          title: 'Cancelled!',
          text: 'Your Division  is safe :)',
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
    this.getDivisionList();
  }

  async exportAll(exportType) {
    const data: any = [];
    const headerRow = [
      ' Medium Name',
      ' Standard Name',
      'Division Name',
      'Strength',
      'Division Status',
      'Division Date',
    ];
    if (exportType != 'pdf') {
      data.push(headerRow);
    }
    const arr: any = await this.getDivisionList(true);
    for (const item of arr) {
      const rowData = [
        item.medium_name,
        item.standard_name,
        item.name || '-',
        item.strength,

        item.is_active ? 'Active' : 'In Active' || '-',
        moment(item.created_at).format('YYYY-MM-DD hh:mm A') || '-',
      ];
      data.push(rowData);
    }
    this.exportService.exportData(
      exportType,
      headerRow,
      data,
      `Exported Division List${moment().format('YYYY-MM-DD')}`
    );
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
  getMediumId(event) {
    this.addDivisionForm.controls['standard_id'].setValue(null);
    this.mediumId = +event;
    this.getStandardList();
  }
  getstandardId(event) {
    this.standardId = +event;
  }

  async getStandardList() {
    let queryList = this.mediumId;
    const response: any = await this.apiService.getStandardListById(queryList);
    if (response.statusCode === 200) {
      this.standardList = response.data.result;
    }
  }
}
