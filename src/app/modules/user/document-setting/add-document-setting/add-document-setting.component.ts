import { Component, OnInit, TemplateRef, ViewChild } from '@angular/core';
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
  selector: 'app-add-document-setting',
  templateUrl: './add-document-setting.component.html',
  styleUrls: ['./add-document-setting.component.scss'],
})
export class AddDocumentSettingComponent {
  documentSettingsForm: FormGroup;
  isSubmitted = false;
  modalReference: NgbModalRef;
  pageLimit = Constants.PAGE_LIMIT;
  currentPage = Constants.STARTING_PAGE;
  find = '';
  totalItems: number;
  DocumentList: any = [];
  @ViewChild('DocumentSettings', { static: false })
  DocumentSettings: TemplateRef<any>;
  model1!: NgbDateStruct;
  EditId: any;
  searchString = '';
  orderBy: any = 'created_at';
  sort = 'DESC';
  isAscending = false;
  isUpdatingCheckboxes = false;
  config = {
    backdrop: true,
    ignoreBackdropClick: true,
    class: 'modal-md',
    centered: true,
    modalDialogClass: 'modal-xl',
  };

  constructor(
    private formBuilder: FormBuilder,
    private modalService: NgbModal,
    private apiService: ApiService,
    private exportService:ExportService,
    private utils: UtilityService
  ) { }
  async ngOnInit() {
    await this.getdocumentSettingsList();
  }
  formInit() {
    this.documentSettingsForm = this.formBuilder.group({
      name: ['', [Validators.required, NoSpace()]],
      Status: ['true', Validators.required],
      is_required: [false],
      backCheckbox: [''],
      forthCheckbox: [{ value: true, disabled: true }],
      type: [null, Validators.required],
    });
  }

  async onSubmit() {
    try {
      this.isSubmitted = true;
      if (this.documentSettingsForm.invalid) {
        return;
      }
      this.utils.showLoading();
      const obj = {
        name: this.documentSettingsForm.controls['name'].value,
        isActive:
          this.documentSettingsForm.controls['Status'].value == 'true'
            ? true
            : false,
        is_front: this.documentSettingsForm.controls['forthCheckbox'].value,
        is_back: this.documentSettingsForm.controls['backCheckbox'].value
          ? true
          : false,
        is_required: this.documentSettingsForm.controls['is_required'].value,
        type: this.documentSettingsForm.controls['type'].value
      };
      this.EditId ? (obj['id'] = this.EditId) : '';
      const response: any = await this.apiService.addDocumentSetting(obj);
      this.utils.hideLoading();
      if (response.statusCode === 200) {
        this.utils.showSuccessToast(response.message);
        this.onModalClose();
        this.getdocumentSettingsList();
      }
    } catch (error) {
      this.utils.hideLoading();
    }
  }

  get form() {
    return this.documentSettingsForm.controls;
  }

  onModalOpen() {
    this.formInit();
    this.modalReference = this.modalService.open(
      this.DocumentSettings,
      this.config
    );
    this.modalReference.hidden.subscribe(() => {
      this.onModalClose();
    });
  }
  onPageChange = async (page: any) => {
    this.currentPage = page;
    this.getdocumentSettingsList();
  };
  onModalClose() {
    this.isSubmitted = false;
    this.EditId = null;
    this.modalReference.close();
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
  async getdocumentSettingsList(isExport=false) {
    this.utils.showLoading();
    let queryList = `?search=${this.searchString}&page=${this.currentPage}&limit=${this.pageLimit}&sort=${this.sort}&orderby=${this.orderBy}`;
    if (isExport) {
      queryList += `&skip_pagination=true`;
    }
    const response: any = await this.apiService.DocumentSettingList(queryList);
    if (!isExport && response.statusCode === 200) {
      this.DocumentList = response.data.result;
      this.totalItems = response.data.totalCount;
    }
    else if (isExport && response.statusCode === 200) {
      this.utils.hideLoading();
      return response.data.result;
    }
    this.utils.hideLoading();
  }
  async editDocumentSettings(listId) {
    this.EditId = listId;
    this.onModalOpen();
    const response: any = await this.apiService.DocumentSettingId(listId);
    if ((response.statusCode = 200)) {
      this.documentSettingsForm.controls['name'].setValue(response.data.name);

      this.documentSettingsForm.controls['Status'].setValue(
        response.data.is_active.toString()
      );
      this.documentSettingsForm.controls['is_required'].setValue(
        response.data.is_required
      );
      this.documentSettingsForm.controls['forthCheckbox'].setValue(
        response.data.is_front
      );
      this.documentSettingsForm.controls['backCheckbox'].setValue(
        response.data.is_back
      );
      this.documentSettingsForm.controls['type'].setValue(
        response.data.type
      );
    }
  }
  deleteDocumentSettings(id) {
    Swal.fire({
      icon: 'warning',
      title: 'Are you sure?',
      text: 'You will not be able to recover Document !',
      showCancelButton: true,
      confirmButtonText: 'Yes, delete it!',
      confirmButtonColor: '#6259ca',
      cancelButtonText: 'No, cancel it!',
      cancelButtonColor: '#6259ca',
      reverseButtons: true,
    }).then(async (result: any) => {
      if (result.isConfirmed) {
        const response: any = await this.apiService.DocumentSettingDelete(id);
        if ((response.statusCode = 200)) {
          Swal.fire({
            title: 'Deleted!',
            text: 'Your Document been deleted.',
            icon: 'success',
            confirmButtonColor: '#6259ca',
          });
          await this.getdocumentSettingsList();
        }
      } else if (result.dismiss === Swal.DismissReason.cancel) {
        Swal.fire({
          title: 'Cancelled!',
          text: 'Your Document  is safe :)',
          icon: 'error',
          confirmButtonColor: '#6259ca',
        });
      }
    });
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
    this.getdocumentSettingsList();
  }
  async exportAll(exportType ){
    const data: any = [];
    const headerRow = [ 
      "Document Name",
      "Document Required",
      "Document Front",
      "Document Back",
      "Document Status",
      "Document Date "
   ]
    if (exportType != "pdf") {
      data.push(headerRow);
    }
    const arr: any = await this.getdocumentSettingsList(true);
    for (const item of arr) {
      const rowData = [
        item.name||"-",
        item.is_required? item.is_required:'false'||"-",
        item.is_front? item.is_front:'false',
        item.is_back? item.is_back:'false',
        item.is_active ? "Active" : "In Active"||"-",
        moment(item.created_at).format("YYYY-MM-DD hh:mm A")||"-",
      ]
      data.push(rowData);
    }
    this.exportService.exportData(
      exportType,
      headerRow,
      data,
      `Exported Document List${ moment().format("YYYY-MM-DD")}`
    );
  }
}
