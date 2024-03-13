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
  selector: 'app-add-city',
  templateUrl: './add-city.component.html',
  styleUrls: ['./add-city.component.scss'],
})
export class AddCityComponent {
  cityForm: FormGroup;
  modalReference: NgbModalRef;
  pageLimit = Constants.PAGE_LIMIT;
  currentPage = Constants.STARTING_PAGE;
  find = '';
  totalItems: number;
  cityRep: any = [];
  @ViewChild('City', { static: false })
  City: TemplateRef<any>;
  isSubmitted = false;
  model1!: NgbDateStruct;
  EditId: any;
  searchString = '';
  stateList: any;
  standardId: any;
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
  stateId: any;
  constructor(
    private modalService: NgbModal,
    private formBuilder: FormBuilder,
    private apiService: ApiService,
    private exportService:ExportService,
    private utils: UtilityService
  ) { }

  async ngOnInit() {
    await this.getCityList();
    this.getState();
  }

  async getCityList(isExport=false) {
    this.utils.showLoading();
    let queryList = `?search=${this.searchString}&page=${this.currentPage}&limit=${this.pageLimit}&sort=${this.sort}&orderby=${this.orderBy}`;
    if (isExport) {
      queryList += `&skip_pagination=true`;
    }
    const response: any = await this.apiService.getCityList(queryList);
    if (!isExport && response.statusCode === 200) {
      this.cityRep = response.data.result;
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
    this.getCityList();
  };
  onModalOpen() {
    this.formInit();
    this.modalReference = this.modalService.open(this.City, this.config);
    this.modalReference.hidden.subscribe(() => {
      this.onModalClose();
    });
  }
  formInit() {
    this.cityForm = this.formBuilder.group({
      name: ['', [Validators.required, NoSpace()]],
      state_id: [null, Validators.required],
    });
  }
  get form() {
    return this.cityForm.controls;
  }
  async onSubmit() {
    try {
      this.isSubmitted = true;
      if (this.cityForm.invalid) {
        return;
      }
      this.utils.showLoading();

      const obj = {
        name: this.cityForm.controls['name'].value,
        state_id: this.stateId,
      };
      this.EditId ? (obj['id'] = this.EditId) : '';
      const response: any = await this.apiService.addCity(obj);
      this.utils.hideLoading();
      if (response.statusCode === 200) {
        this.utils.showSuccessToast(response.message);
        this.onModalClose();
        this.getCityList();
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
  async editCity(listId) {
    this.EditId = listId;
    this.onModalOpen();
    const response: any = await this.apiService.getCityId(listId);
    if ((response.statusCode = 200)) {
      this.cityForm.controls['name'].setValue(response.data.name);
      this.cityForm.controls['state_id'].setValue(response.data.state_id);
      this.stateId = response.data.state_id;
    }
  }

  deleteCity(id) {
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
        const response: any = await this.apiService.cityDelete(id);
        if ((response.statusCode = 200)) {
          Swal.fire({
            title: 'Deleted!',
            text: 'Your City been deleted.',
            icon: 'success',
            confirmButtonColor: '#6259ca',
          });
          await this.getCityList();
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
  async getState() {
    this.utils.showLoading();
    const queryList = `?skip_pagination=${true}&sort=DESC`;
    const response: any = await this.apiService.getStateList(queryList);
    if (response.statusCode === 200) {
      this.stateList = response.data.result;
    }
    this.utils.hideLoading();
  }
  state(event) {
    this.stateId = +event;
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
    this.getCityList();
  }
  async exportAll(exportType ){
    const data: any = [];
    const headerRow = [ 
      "City Name",
      "State",
      "Date "
   ]
    if (exportType != "pdf") {
      data.push(headerRow);
    }
    const arr: any = await this.getCityList(true);
    for (const item of arr) {
      const rowData = [
        item.name||"-",
        item.state_name? item.state_name:'-',
        moment(item.created_at).format("YYYY-MM-DD hh:mm A")||"-",
      ]
      data.push(rowData);
    }
    this.exportService.exportData(
      exportType,
      headerRow,
      data,
      `Exported City List${ moment().format("YYYY-MM-DD")}`
    );
  }
}
