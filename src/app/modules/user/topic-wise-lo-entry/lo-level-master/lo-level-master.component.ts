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
import { CdkDragDrop, moveItemInArray } from '@angular/cdk/drag-drop';
import { ExportService } from 'src/app/services/export-service.service';
import * as moment from 'moment';

@Component({
  selector: 'app-lo-level-master',
  templateUrl: './lo-level-master.component.html',
  styleUrls: ['./lo-level-master.component.scss'],
})
export class LoLevelMasterComponent {
  loLevelForm: FormGroup;
  modalReference: NgbModalRef;
  pageLimit = Constants.PAGE_LIMIT;
  currentPage = Constants.STARTING_PAGE;
  find = '';
  totalItems: number;
  loLevelRep: any = [];
  @ViewChild('Subject', { static: false })
  Subject: TemplateRef<any>;
  isSubmitted = false;
  model1!: NgbDateStruct;
  EditId: any;
  searchString = '';
  orderBy: any = 'sequence';
  sort = 'ASC';
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
    await this.getLOLevelList();
  }

  async getLOLevelList(isExport=false) {
    this.utils.showLoading();
    let queryList = `?search=${this.searchString}&sort=${this.sort}&orderby=${this.orderBy}`;
    if (isExport) {
      queryList += `&skip_pagination=true`;
    }
    const response: any = await this.apiService.getLOLevelList(queryList);
    if (!isExport && response.statusCode === 200) {
      this.loLevelRep = response.data.result;
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
    this.getLOLevelList();
  };
  onModalOpen() {
    this.formInit();
    this.modalReference = this.modalService.open(this.Subject, this.config);
    this.modalReference.hidden.subscribe(() => {
      this.onModalClose();
    });
  }
  formInit() {
    this.loLevelForm = this.formBuilder.group({
      name: ['', [Validators.required, NoSpace()]],
      status: ['true', Validators.required],
    });
  }
  get form() {
    return this.loLevelForm.controls;
  }
  async onSubmit() {
    try {
      this.isSubmitted = true;
      if (this.loLevelForm.invalid) {
        return;
      }
      this.utils.showLoading();

      const obj = {
        name: this.loLevelForm.controls['name'].value,
        isActive:
          this.loLevelForm.controls['status'].value == 'true' ? true : false,
      };
      this.EditId ? (obj['id'] = this.EditId) : '';
      const response: any = await this.apiService.addLOLevel(obj);
      this.utils.hideLoading();
      if (response.statusCode === 200) {
        this.utils.showSuccessToast(response.message);
        this.onModalClose();
        this.getLOLevelList();
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
  async editLOLevel(listId) {
    this.EditId = listId;
    this.onModalOpen();
    const response: any = await this.apiService.getLOLevelById(listId);
    if ((response.statusCode = 200)) {
      this.loLevelForm.controls['name'].setValue(response.data.name);

      this.loLevelForm.controls['status'].setValue(
        response.data.is_active.toString()
      );
    }
  }

  deleteLOLevel(id) {
    Swal.fire({
      icon: 'warning',
      title: 'Are you sure?',
      text: 'You will not be able to recover LO Level !',
      showCancelButton: true,
      confirmButtonText: 'Yes, delete it!',
      confirmButtonColor: '#6259ca',
      cancelButtonText: 'No, cancel it!',
      cancelButtonColor: '#6259ca',
      reverseButtons: true,
    }).then(async (result: any) => {
      if (result.isConfirmed) {
        const response: any = await this.apiService.LOLevelDelete(id);
        if ((response.statusCode = 200)) {
          Swal.fire({
            title: 'Deleted!',
            text: 'Your LO Level has been deleted.',
            icon: 'success',
            confirmButtonColor: '#6259ca',
          });
          await this.getLOLevelList();
        }
      } else if (result.dismiss === Swal.DismissReason.cancel) {
        Swal.fire({
          title: 'Cancelled!',
          text: 'Your LO Level is safe :)',
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
    this.getLOLevelList();
  }

  async drop(event: CdkDragDrop<any[]>) {
    try {
      moveItemInArray(this.loLevelRep, event.previousIndex, event.currentIndex);
      let data: any = []
      this.loLevelRep.forEach((element, index) => {
        let json = {
          id: element.id,
          sequence: index + 1
        }
        data.push(json);
      });

      let json = {
        lolevel_ids: data
      }
      const response: any = await this.apiService.addLOLevelSequence(json);
      if ((response.statusCode = 200)) {
        this.getLOLevelList();
        this.utils.showSuccessToast(response.message);
      }
    } catch (error) {
      this.utils.hideLoading();
    }
  }
  async exportAll(exportType ){
    const data: any = [];
    const headerRow = [ 
      "LO Level",
      "Status",
      "Date & Time"
   ]
    if (exportType != "pdf") {
      data.push(headerRow);
    }
    const arr: any = await this.getLOLevelList(true);
    for (const item of arr) {
      const rowData = [
        item.name||"-",
        item.is_active ? "Active" : "In Active"||"-",
        moment(item.created_at).format("YYYY-MM-DD hh:mm A")||"-",
      ]
      data.push(rowData);
    }
    this.exportService.exportData(
      exportType,
      headerRow,
      data,
      `Exported Subject Material Type Category List${ moment().format("YYYY-MM-DD")}`
    );
  }
}
