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
  selector: 'app-add-point',
  templateUrl: './add-point.component.html',
  styleUrls: ['./add-point.component.scss'],
})
export class AddPointComponent {
  pointForm: FormGroup;
  modalReference: NgbModalRef;
  pageLimit = Constants.PAGE_LIMIT;
  currentPage = Constants.STARTING_PAGE;
  find = '';
  totalItems: number;
  pointRep: any = [];
  @ViewChild('Point', { static: false })
  Point: TemplateRef<any>;
  isSubmitted = false;
  model1!: NgbDateStruct;
  EditId: any;
  searchString = '';
  stateList: any;
  standardId: any;
  config = {
    backdrop: true,
    ignoreBackdropClick: true,
    class: 'modal-md',
    centered: true,
    modalDialogClass: 'modal-xl',
  };
  cityList: any;
  cityId: any;
  areaList: any;
  areaId: any;
  stateId: any;
  orderBy: any = 'created_at';
  sort = 'DESC'
  isAscending = false
  constructor(
    private modalService: NgbModal,
    private formBuilder: FormBuilder,
    private apiService: ApiService,
    private exportService:ExportService,
    private utils: UtilityService
  ) { }

  async ngOnInit() {
    await this.getPointList();
    this.getStateList();
  }

  async getPointList(isExport=false) {
    this.utils.showLoading();
    let queryList = `?search=${this.searchString}&page=${this.currentPage}&limit=${this.pageLimit}&sort=${this.sort}&orderby=${this.orderBy}`;
    if (isExport) {
      queryList += `&skip_pagination=true`;
    } 
    const response: any = await this.apiService.getPointList(queryList);
    if (!isExport && response.statusCode === 200) {
      this.pointRep = response.data.result;
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
    this.getPointList();
  };
  onModalOpen() {
    this.formInit();
    this.modalReference = this.modalService.open(this.Point, this.config);
    this.modalReference.hidden.subscribe(() => {
      this.onModalClose();
    });
  }
  formInit() {
    this.pointForm = this.formBuilder.group({
      name: ['', [Validators.required, NoSpace()]],
      fee_monthly: ['', [Validators.required, NoSpace()]],
      area_id: [null, Validators.required],
      city_id: [null, Validators.required],
      state_id: [null, Validators.required],
    });
  }
  get form() {
    return this.pointForm.controls;
  }
  async onSubmit() {
    try {
      this.isSubmitted = true;
      if (this.pointForm.invalid) {
        return;
      }
      this.utils.showLoading();

      const obj = {
        name: this.pointForm.controls['name'].value,
        fee_monthly: Number(this.pointForm.controls['fee_monthly'].value),
        area_id: this.areaId,
        city_id: this.cityId,
      };
      this.EditId ? (obj['id'] = this.EditId) : '';
      const response: any = await this.apiService.addPoint(obj);
      this.utils.hideLoading();
      if (response.statusCode === 200) {
        this.utils.showSuccessToast(response.message);
        this.onModalClose();
        this.getPointList();
      }
    } catch (error) {
      this.utils.hideLoading();
    }
  }
  onModalClose() {
    this.isSubmitted = false;
    this.EditId = null;
    this.cityList = null;
    this.areaList = null;
    this.modalReference.close();
  }
  async editPoint(listId) {
    this.EditId = listId;
    this.onModalOpen();
    const response: any = await this.apiService.getPointId(listId);
    if ((response.statusCode = 200)) {
      this.pointForm.controls['name'].setValue(response.data.name);
      this.pointForm.controls['fee_monthly'].setValue(
        response.data.fee_monthly
      );
      this.pointForm.controls['area_id'].setValue(response.data.area_name);
      this.cityId = response.data.city_id;
      this.pointForm.controls['city_id'].setValue(response.data.city_name);
      this.getArea();
      this.stateId = response.data.state_id;
      this.getCity();
      this.pointForm.controls['state_id'].setValue(response.data.state_name);

      this.cityId = response.data.city_id;
      this.areaId = response.data.area_id;
    }
  }

  deletePoint(id) {
    Swal.fire({
      icon: 'warning',
      title: 'Are you sure?',
      text: 'You will not be able to recover City  !',
      showCancelButton: true,
      confirmButtonText: 'Yes, delete it!',
      confirmButtonColor: '#6259ca',
      cancelButtonText: 'No, cancel it!',
      cancelButtonColor: '#6259ca',
      reverseButtons: true,
    }).then(async (result: any) => {
      if (result.isConfirmed) {
        const response: any = await this.apiService.PointDelete(id);
        if ((response.statusCode = 200)) {
          Swal.fire({
            title: 'Deleted!',
            text: 'Your City been deleted.',
            icon: 'success',
            confirmButtonColor: '#6259ca',
          });
          await this.getPointList();
        }
      } else if (result.dismiss === Swal.DismissReason.cancel) {
        Swal.fire({
          title: 'Cancelled!',
          text: 'Your City  is safe :)',
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

  async getArea() {
    this.utils.showLoading();

    const response: any = await this.apiService.getAreaListId(this.cityId);
    if (response.statusCode === 200) {
      this.areaList = response.data.result;
    }
    this.utils.hideLoading();
  }
  area(event) {
    this.areaId = +event;
  }
  onPressAllowNumber(event: any) {
    if (event.key == 'Tab') {
      return true;
    } else {
      let keyChar = String.fromCharCode(event.keyCode);
      let re = /[0-9]/;
      return re.test(keyChar);
    }
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
  state(event) {
    if (event) {
      this.pointForm.controls['city_id'].setValue(null);
      this.pointForm.controls['area_id'].setValue(null);
      this.stateId = +event;
      this.getCity();
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
  city(event) {
    if (event) {
      this.pointForm.controls['area_id'].setValue(null);
      this.cityId = +event;
      this.getArea();
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
    this.getPointList();
  }
  async exportAll(exportType ){
    const data: any = [];
    const headerRow = [ 
      "Name",
      "feeMonthly",
      "State",
      "City",
      "Area",
      "Date",
   ]
    if (exportType != "pdf") {
      data.push(headerRow);
    }
    const arr: any = await this.getPointList(true);
    for (const item of arr) {
      const rowData = [
        item.name||"-",
        item.fee_monthly||"-",
        item.state_name||"-",
        item.city_name||"-",
        item.area_name||"-",
        moment(item.created_at).format("YYYY-MM-DD hh:mm A")||"-",
      ]
      data.push(rowData);
    }
    this.exportService.exportData(
      exportType,
      headerRow,
      data,
      `Exported Point List${ moment().format("YYYY-MM-DD")}`
    );
  }
}
