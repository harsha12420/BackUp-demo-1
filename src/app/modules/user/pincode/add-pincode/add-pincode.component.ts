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
  selector: 'app-add-pincode',
  templateUrl: './add-pincode.component.html',
  styleUrls: ['./add-pincode.component.scss'],
})
export class AddPincodeComponent {
  pincodeForm: FormGroup;
  modalReference: NgbModalRef;
  pageLimit = Constants.PAGE_LIMIT;
  currentPage = Constants.STARTING_PAGE;
  find = '';
  totalItems: number;
  StateList: any = [];
  districtList: any = [];
  subDistrictList: any = [];
  districtId: any;
  vilageList: any = [];
  subDistrictId: any;
  pincodeList: any = [];
  villageId: any;

  @ViewChild('pincode', { static: false }) pincode: TemplateRef<any>;
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
  stateId: any;
  constructor(
    private modalService: NgbModal,
    private formBuilder: FormBuilder,
    private apiService: ApiService,
    private exportService:ExportService,
    private utils: UtilityService
  ) {}

  async ngOnInit() {
    await this.getPincodeList();
  }

  async getPincodeList(isExport=false) {
    this.utils.showLoading();
    let queryList = `?search=${this.searchString}&page=${this.currentPage}&limit=${this.pageLimit}&sort=${this.sort}&orderby=${this.orderBy}`;
    if (isExport) {
      queryList += `&skip_pagination=true`;
    }
    const response: any = await this.apiService.getByIdMasterPincode(queryList);
    if (!isExport && response.statusCode === 200) {
      this.pincodeList = response.data.result;
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
    this.getPincodeList();
  };
  onModalOpen() {
    this.formInit();
    this.modalReference = this.modalService.open(this.pincode, this.config);
    this.modalReference.hidden.subscribe(() => {
      this.onModalClose();
    });
    this.getStateList();
  }
  formInit() {
    this.pincodeForm = this.formBuilder.group({
      pincode: ['', [Validators.required, Validators.pattern('^[0-9]{6}$')]],
      Status: ['true', Validators.required],
      state_id: [null, Validators.required],
      district_id: [null, Validators.required],
      sub_district_id: [null, Validators.required],
      village_id: [null, Validators.required],
    });
  }
  get form() {
    return this.pincodeForm.controls;
  }
  async onSubmit() {
    try {
      this.isSubmitted = true;
      if (this.pincodeForm.invalid) {
        return;
      }
      this.utils.showLoading();

      const obj = {
        title: this.pincodeForm.controls['pincode'].value,
        isActive:
          this.pincodeForm.controls['Status'].value == 'true' ? true : false,
        state_id: this.stateId,
        district_id: this.districtId,
        sub_district_id: this.subDistrictId,
        village_id: this.villageId,
      };
      this.EditId ? (obj['id'] = this.EditId) : '';
      const response: any = await this.apiService.addMasterPincode(obj);
      this.utils.hideLoading();
      if (response.statusCode === 200) {
        this.utils.showSuccessToast(response.message);
        this.onModalClose();
        this.getPincodeList();
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
  async editPincode(listId) {
    this.EditId = listId;

    const queryList = `?pincode_id=${listId}`;

    this.onModalOpen();
    const response: any = await this.apiService.getByIdMasterPincode(queryList);
    if ((response.statusCode = 200)) {
      this.pincodeForm.controls['pincode'].setValue(
        response.data.result[0].pincode_name
      );
      this.pincodeForm.controls['Status'].setValue(
        response.data.result[0].pincode_active.toString()
      );
      this.pincodeForm.controls['state_id'].setValue(
        response.data.result[0].state_name
      );
      this.stateId = response.data.result[0].state_id;
      this.pincodeForm.controls['district_id'].setValue(
        response.data.result[0].district_name
      );
      this.districtId = response.data.result[0].district_id;
      this.pincodeForm.controls['sub_district_id'].setValue(
        response.data.result[0].sub_district_name
      );
      this.subDistrictId = response.data.result[0].sub_district_id;
      this.pincodeForm.controls['village_id'].setValue(
        response.data.result[0].village_name
      );
      this.villageId = response.data.result[0].village_id;
    }
    this.getDistrictList();
    this.getSubDistrictList();
    this.getVilageList();
  }

  deletePincode(id) {
    Swal.fire({
      icon: 'warning',
      title: 'Are you sure?',
      text: 'You will not be able to recover this Pincode !',
      showCancelButton: true,
      confirmButtonText: 'Yes, delete it!',
      confirmButtonColor: '#6259ca',
      cancelButtonText: 'No, cancel it!',
      cancelButtonColor: '#6259ca',
      reverseButtons: true,
    }).then(async (result: any) => {
      if (result.isConfirmed) {
        const response: any = await this.apiService.deleteMasterPincode(id);
        if ((response.statusCode = 200)) {
          Swal.fire({
            title: 'Deleted!',
            text: 'Your Pincode list  has been deleted.',
            icon: 'success',
            confirmButtonColor: '#6259ca',
          });
          await this.getPincodeList();
        }
      } else if (result.dismiss === Swal.DismissReason.cancel) {
        Swal.fire({
          title: 'Cancelled!',
          text: 'Your Pincode is safe :)',
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
    this.getPincodeList();
  }
  async getStateList() {
    const queryList = `?skip_pagination=${true}`;
    const response: any = await this.apiService.getByIdMasterState(queryList);
    if (response.statusCode === 200) {
      this.StateList = response.data.result;
    }
  }
  stateList(event) {
    this.pincodeForm.controls['district_id'].setValue(null);
    this.pincodeForm.controls['sub_district_id'].setValue(null);
    this.pincodeForm.controls['village_id'].setValue(null);

    this.stateId = +event;
    this.getDistrictList();
  }
  async getDistrictList() {
    const queryList = `?state_id=${this.stateId}`;
    const response: any = await this.apiService.getByIdMasterDistrict(
      queryList
    );
    if (response.statusCode === 200) {
      this.districtList = response.data.result;
    }
  }
  getdistrictList(event) {
    this.pincodeForm.controls['sub_district_id'].setValue(null);
    this.pincodeForm.controls['village_id'].setValue(null);

    this.districtId = +event;
    this.getSubDistrictList();
  }
  async getSubDistrictList() {
    const queryList = `?district_id=${this.districtId}`;
    const response: any = await this.apiService.getByIdMasterSubDistrict(
      queryList
    );
    if (response.statusCode === 200) {
      this.subDistrictList = response.data.result;
    }
  }
  getSubDistrictId(event) {
    this.pincodeForm.controls['village_id'].setValue(null);
    this.subDistrictId = +event;
    this.getVilageList();
  }
  async getVilageList() {
    const queryList = `?sub_district_id=${this.subDistrictId}`;
    const response: any = await this.apiService.getByIdMasterVillage(queryList);
    if (response.statusCode === 200) {
      this.vilageList = response.data.result;
    }
  }
  getVillageId(event) {
    this.villageId = +event;
  }
  async exportAll(exportType ){
    const data: any = [];
    const headerRow = [
      "Village",
      "Sub District",
      "District",
      "State ",
      "District Status",
      "District Date"
    ]

    if (exportType != "pdf") {
      data.push(headerRow);
    }
    const arr: any = await this.getPincodeList(true);
    for (const item of arr) {
      const rowData = [        
        item.village_name||"-",
        item.sub_district_name||"-",
        item.district_name||"-",
        item.state_name||"-",
        item.village_active ? "Active" : "In Active"||"-",
        moment(item.created_at).format("YYYY-MM-DD hh:mm A")||"-",
      ]
      data.push(rowData);
    }
    this.exportService.exportData(
      exportType,
      headerRow,
      data,
      `Exported Pin Code List${ moment().format("YYYY-MM-DD")}`
    );
  }
}
