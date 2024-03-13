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
  selector: 'app-add-area',
  templateUrl: './add-area.component.html',
  styleUrls: ['./add-area.component.scss'],
})
export class AddAreaComponent {
  areaForm: FormGroup;
  modalReference: NgbModalRef;
  pageLimit = Constants.PAGE_LIMIT;
  currentPage = Constants.STARTING_PAGE;
  find = '';
  totalItems: number;
  areaRep: any = [];
  @ViewChild('Area', { static: false })
  Area: TemplateRef<any>;
  isSubmitted = false;
  model1!: NgbDateStruct;
  EditId: any;
  searchString = '';
  cityList: any;
  stateList: any;
  standardId: any;
  config = {
    backdrop: true,
    ignoreBackdropClick: true,
    class: 'modal-md',
    centered: true,
    modalDialogClass: 'modal-xl',
  };
  cityId: any;
  stateId: any;
  orderBy: any = 'created_at';
  sort = 'DESC';
  isAscending = false;
  constructor(
    private modalService: NgbModal,
    private formBuilder: FormBuilder,
    private apiService: ApiService,
    private exportService:ExportService,
    private utils: UtilityService
  ) {}

  async ngOnInit() {
    await this.getAreaList();
    this.getStateList();
  }

  async getAreaList(isExport=false) {
    this.utils.showLoading();
    let queryList = `?search=${this.searchString}&page=${this.currentPage}&limit=${this.pageLimit}&sort=${this.sort}&orderby=${this.orderBy}`;
    if (isExport) {
      queryList += `&skip_pagination=true`;
    } 
    const response: any = await this.apiService.getAreaList(queryList);
    if (!isExport && response.statusCode === 200) {
      this.areaRep = response.data.result;
      this.totalItems = response.data.totalCount;
    }
    else if (isExport && response.statusCode === 200) {
      this.utils.hideLoading();
      return response.data.result;
    }
    this.utils.hideLoading();
  }

  onPageChange = async (page: any) => {
    this.currentPage = page;
    this.getAreaList();
  };
  onModalOpen() {
    this.formInit();
    this.modalReference = this.modalService.open(this.Area, this.config);
    this.modalReference.hidden.subscribe(() => {
      this.onModalClose();
    });
  }
  formInit() {
    this.areaForm = this.formBuilder.group({
      name: ['', [Validators.required, NoSpace()]],
      city_id: [null, Validators.required],
      state_id: [null, Validators.required],
    });
  }
  get form() {
    return this.areaForm.controls;
  }
  async onSubmit() {
    try {
      this.isSubmitted = true;
      if (this.areaForm.invalid) {
        return;
      }
      this.utils.showLoading();

      const obj = {
        name: this.areaForm.controls['name'].value,

        city_id: this.cityId,
      };
      this.EditId ? (obj['id'] = this.EditId) : '';
      const response: any = await this.apiService.addArea(obj);
      this.utils.hideLoading();
      if (response.statusCode === 200) {
        this.utils.showSuccessToast(response.message);
        this.onModalClose();
        this.getAreaList();
      }
    } catch (error) {
      this.utils.hideLoading();
    }
  }
  onModalClose() {
    this.isSubmitted = false;
    this.EditId = null;
    this.cityList = null;
    this.modalReference.close();
  }
  async editArea(listId) {
    this.EditId = listId;
    this.onModalOpen();

    const response: any = await this.apiService.getAreaId(listId);
    if ((response.statusCode = 200)) {
      this.areaForm.controls['name'].setValue(response.data.name);
      this.areaForm.controls['city_id'].setValue(response.data.city_name);
      this.cityId = response.data.city_id;
      this.areaForm.controls['state_id'].setValue(response.data.state_name);
    }
  }

  deleteArea(id) {
    Swal.fire({
      icon: 'warning',
      title: 'Are you sure?',
      text: 'You will not be able to recover Area  !',
      showCancelButton: true,
      confirmButtonText: 'Yes, delete it!',
      confirmButtonColor: '#6259ca',
      cancelButtonText: 'No, cancel it!',
      cancelButtonColor: '#6259ca',
      reverseButtons: true,
    }).then(async (result: any) => {
      if (result.isConfirmed) {
        const response: any = await this.apiService.areaDelete(id);
        if ((response.statusCode = 200)) {
          Swal.fire({
            title: 'Deleted!',
            text: 'Your Area been deleted.',
            icon: 'success',
            confirmButtonColor: '#6259ca',
          });
          await this.getAreaList();
        }
      } else if (result.dismiss === Swal.DismissReason.cancel) {
        Swal.fire({
          title: 'Cancelled!',
          text: 'Your Area  is safe :)',
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
  async getCity() {
    this.utils.showLoading();
    const response: any = await this.apiService.getCityListById(this.stateId);
    if (response.statusCode === 200) {
      this.cityList = response.data.result;
    }
    this.utils.hideLoading();
  }
  async getStateList() {
    this.utils.showLoading();
    const queryList = `?skip_pagination=${true}&sort=DESC`;
    const response: any = await this.apiService.getStateList(queryList);
    if (response.statusCode === 200) {
      this.stateList = response.data.result;
    }
    this.utils.hideLoading();
  }
  city(event) {
    this.cityId = +event;
  }

  state(event) {
    if (event) {
      this.areaForm.controls['city_id'].setValue(null);
      this.stateId = +event;
      this.getCity();
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
    this.getAreaList();
  }
  async exportAll(exportType ){
    const data: any = [];
    const headerRow = [ 
      "Area Name",
      "State",
      "City",
      "Area Date"
   ]
    if (exportType != "pdf") {
      data.push(headerRow);
    }
    const arr: any = await this.getAreaList(true);
    for (const item of arr) {
      const rowData = [
        item.name||"-",
        item.state_name||"-",
        item.city_name||"-",
        moment(item.created_at).format("YYYY-MM-DD hh:mm A")||"-",
      ]
      data.push(rowData);
    }
    this.exportService.exportData(
      exportType,
      headerRow,
      data,
      `Exported Area List${ moment().format("YYYY-MM-DD")}`
    );
  }
}
