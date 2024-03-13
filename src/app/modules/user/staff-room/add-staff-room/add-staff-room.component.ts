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
import Swal from 'sweetalert2';
import { NoSpace } from 'src/app/shared/validations/no-space.validator';
import * as moment from 'moment';
import { ExportService } from 'src/app/services/export-service.service';

@Component({
  selector: 'app-add-staff-room',
  templateUrl: './add-staff-room.component.html',
  styleUrls: ['./add-staff-room.component.scss'],
})
export class AddStaffRoomComponent {
  staffRoomForm: FormGroup;
  modalReference: NgbModalRef;
  pageLimit = Constants.PAGE_LIMIT;
  currentPage = Constants.STARTING_PAGE;
  find = '';
  totalItems: number;
  staffRoomList: any = [];
  @ViewChild('staffRoom', { static: false })
  staffRoom: TemplateRef<any>;
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
  constructor(
    private modalService: NgbModal,
    private formBuilder: FormBuilder,
    private apiService: ApiService,
    private exportService:ExportService,
    private utils: UtilityService
  ) { }

  async ngOnInit() {
    await this.getStaffRoomList();
  }

  async getStaffRoomList(isExport=false) {
    this.utils.showLoading();
    let queryList = `?search=${this.searchString}&page=${this.currentPage}&limit=${this.pageLimit}&sort=${this.sort}&orderby=${this.orderBy}`;
    if (isExport) {
      queryList += `&skip_pagination=true`;
    } 
    const response: any = await this.apiService.StaffRoomList(queryList);
    if (!isExport && response.statusCode === 200) {
      this.staffRoomList = response.data.result;
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
    this.getStaffRoomList();
  };
  onModalOpen() {
    this.formInit();
    this.modalReference = this.modalService.open(this.staffRoom, this.config);
    this.modalReference.hidden.subscribe(() => {
      this.onModalClose();
    });
  }
  formInit() {
    this.staffRoomForm = this.formBuilder.group({
      name: ['', [Validators.required, NoSpace()]],
      room_number: ['', [Validators.required, NoSpace()]],
      inercom_number: ['', [Validators.required, NoSpace()]],
      Status: ['true', Validators.required],
    });
  }
  get form() {
    return this.staffRoomForm.controls;
  }
  async onSubmit() {
    try {
      this.isSubmitted = true;
      if (this.staffRoomForm.invalid) {
        return;
      }
      this.utils.showLoading();

      const obj = {
        name: this.staffRoomForm.controls['name'].value,
        room_number: this.staffRoomForm.controls['room_number'].value,
        inercom_number: this.staffRoomForm.controls['inercom_number'].value,
        isActive:
          this.staffRoomForm.controls['Status'].value == 'true' ? true : false,
      };
      this.EditId ? (obj['id'] = this.EditId) : '';
      const response: any = await this.apiService.addStaffRoom(obj);
      this.utils.hideLoading();
      if (response.statusCode === 200) {
        this.utils.showSuccessToast(response.message);
        this.onModalClose();
        this.getStaffRoomList();
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
  async editStaffRoom(listId) {
    this.EditId = listId;
    this.onModalOpen();
    const response: any = await this.apiService.StaffRoomId(listId);
    if ((response.statusCode = 200)) {
      this.staffRoomForm.controls['name'].setValue(response.data.name);
      this.staffRoomForm.controls['room_number'].setValue(
        response.data.room_number
      );

      this.staffRoomForm.controls['inercom_number'].setValue(
        response.data.inercom_number
      );

      this.staffRoomForm.controls['Status'].setValue(
        response.data.is_active.toString()
      );
    }
  }

  deleteStaffRoom(id) {
    Swal.fire({
      icon: 'warning',
      title: 'Are you sure?',
      text: 'You will not be able to recover medium  !',
      showCancelButton: true,
      confirmButtonText: 'Yes, delete it!',
      confirmButtonColor: '#6259ca',
      cancelButtonText: 'No, cancel it!',
      cancelButtonColor: '#6259ca',
      reverseButtons: true,
    }).then(async (result: any) => {
      if (result.isConfirmed) {
        const response: any = await this.apiService.StaffRoomDelete(id);
        if ((response.statusCode = 200)) {
          Swal.fire({
            title: 'Deleted!',
            text: 'Your medium been deleted.',
            icon: 'success',
            confirmButtonColor: '#6259ca',
          });
          await this.getStaffRoomList();
        }
      } else if (result.dismiss === Swal.DismissReason.cancel) {
        Swal.fire({
          title: 'Cancelled!',
          text: 'Your medium  is safe :)',
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
    this.getStaffRoomList();
  }
  async exportAll(exportType ){
    const data: any = [];
    const headerRow = [ 
      "Staff Room Name",
      "Staff Inercom Number",
      "Staff Room Number",
      "Staff Room Status",
      "Staff Room Date"
   ]
    if (exportType != "pdf") {
      data.push(headerRow);
    }
    const arr: any = await this.getStaffRoomList(true);
    for (const item of arr) {
      const rowData = [
        item.name||"-",
        item.inercom_number||"-",
        item.room_number||"-",
        item.is_active ? "Active" : "In Active"||"-",
        moment(item.created_at).format("YYYY-MM-DD hh:mm A")||"-",
      ]
      data.push(rowData);
    }
    this.exportService.exportData(
      exportType,
      headerRow,
      data,
      `Exported Staff Room List${ moment().format("YYYY-MM-DD")}`
    );
  }
}
