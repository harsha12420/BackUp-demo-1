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
import { environment } from 'src/environments/environment';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-add-observation',
  templateUrl: './add-observation.component.html',
  styleUrls: ['./add-observation.component.scss'],
})
export class AddObservationComponent {
  observationForm: FormGroup;
  modalReference: NgbModalRef;
  pageLimit = Constants.PAGE_LIMIT;
  currentPage = Constants.STARTING_PAGE;
  find = '';
  totalItems: number;
  observationList: any = [];
  @ViewChild('Observation', { static: false }) Observation: TemplateRef<any>;
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
  mediaUrl = environment.MEDIA_URL;

  constructor(
    private modalService: NgbModal,
    private formBuilder: FormBuilder,
    private apiService: ApiService,
    private utils: UtilityService,
    private exportService: ExportService
  ) { }

  async ngOnInit() {
    await this.getObservationList();
  }

  async getObservationList(isExport = false) {
    this.utils.showLoading();

    let queryList = `?search=${this.searchString}&page=${this.currentPage}&limit=${this.pageLimit}&sort=${this.sort}&orderby=${this.orderBy}`;

    if (isExport) queryList += `&skip_pagination=true`;
    const response: any = await this.apiService.getObservationMasterList(
      queryList
    );
    if (isExport && response.statusCode === 200) {
      this.utils.hideLoading();
      return response.data.result;
    }
    if (response.statusCode === 200) {
      this.observationList = response.data.result;
      this.totalItems = response.data.totalCount;
    }
    this.utils.hideLoading();
  }

  onPageChange = async (page: any) => {
    this.currentPage = page;
    this.getObservationList();
  };
  onModalOpen() {
    this.formInit();
    this.modalReference = this.modalService.open(this.Observation, this.config);
    this.modalReference.hidden.subscribe(() => {
      this.onModalClose();
    });
  }
  formInit() {
    this.observationForm = this.formBuilder.group({
      name: ['', [Validators.required, NoSpace()]],
      short_code: ['', [Validators.required, NoSpace()]],

      Status: ['true', Validators.required],
    });
  }
  get form() {
    return this.observationForm.controls;
  }
  async onSubmit() {
    try {
      this.isSubmitted = true;
      if (this.observationForm.invalid) {
        return;
      }
      this.utils.showLoading();

      const obj = {
        name: this.observationForm.controls['name'].value,
        short_code: this.observationForm.controls['short_code'].value,
        isActive:
          this.observationForm.controls['Status'].value == 'true'
            ? true
            : false,
      };
      this.EditId ? (obj['id'] = this.EditId) : '';
      const response: any = await this.apiService.addObservationMaster(obj);
      this.utils.hideLoading();
      if (response.statusCode === 200) {
        this.utils.showSuccessToast(response.message);
        this.onModalClose();
        this.getObservationList();
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
  async editObservation(listId) {
    this.EditId = listId;
    this.onModalOpen();
    const response: any = await this.apiService.getObservationMasterId(listId);
    if ((response.statusCode = 200)) {
      this.observationForm.controls['name'].setValue(response.data.name);
      this.observationForm.controls['short_code'].setValue(
        response.data.short_code
      );

      this.observationForm.controls['Status'].setValue(
        response.data.is_active.toString()
      );
    }
  }

  deleteObservation(id) {
    Swal.fire({
      icon: 'warning',
      title: 'Are you sure?',
      text: 'You will not be able to recover this task list !',
      showCancelButton: true,
      confirmButtonText: 'Yes, delete it!',
      confirmButtonColor: '#6259ca',
      cancelButtonText: 'No, cancel it!',
      cancelButtonColor: '#6259ca',
      reverseButtons: true,
    }).then(async (result: any) => {
      if (result.isConfirmed) {
        const response: any = await this.apiService.ObservationMasterDelete(id);
        if ((response.statusCode = 200)) {
          Swal.fire({
            title: 'Deleted!',
            text: 'Your task list  has been deleted.',
            icon: 'success',
            confirmButtonColor: '#6259ca',
          });
          await this.getObservationList();
        }
      } else if (result.dismiss === Swal.DismissReason.cancel) {
        Swal.fire({
          title: 'Cancelled!',
          text: 'Your task list  is safe :)',
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
    this.getObservationList();
  }

  async exportAllObservation(exportType: string) {
    const data: any = [];

    const headerRow = [
      'Id',
      'Observation Memo',
      'Observation Short Code',
      'Observation Status',
      'Date & Time',
    ];

    if (exportType != 'pdf') {
      data.push(headerRow);
    }
    const arr: any = await this.getObservationList(true);

    for (const item of arr) {
      const rowData = [
        item.id,
        item.name,
        item.short_code,
        item.is_active,
        moment(item.created_at).format('YYYY-MM-DD hh:mm A'),
      ];
      data.push(rowData);
    }
    this.exportService.exportData(
      exportType,
      headerRow,
      data,
      ` Observation Memo `
    );
  }
}
