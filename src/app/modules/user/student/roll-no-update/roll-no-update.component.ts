import { Component, TemplateRef, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import * as moment from 'moment';
import { ApiService } from 'src/app/services/api.service';
import { ExportService } from 'src/app/services/export-service.service';
import { UtilityService } from 'src/app/services/utility.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-roll-no-update',
  templateUrl: './roll-no-update.component.html',
  styleUrls: ['./roll-no-update.component.scss']
})
export class RollNoUpdateComponent {
  updateRollNo: any=[];
  selectedRollNo:any;
  mediumList: any = []
  standardList: any = []
  divisionList: any = []
  list: any = [];
  orderBy: any = "created_at";
  isAscending = false;
  currentPage = 1;
  sort = "DESC";
  totalItems = 0;
  isSubmitted=false;
  pageLimit = 10;
  @ViewChild("RollnoUpdate", { static: false })
  rollNoupdate: TemplateRef<any>;
  config = {
    backdrop: true,
    ignoreBackdropClick: true,
    class: "modal-md",
    centered: true,
    modalDialogClass: "modal-xl",
  };
  modalReference: NgbModalRef;
  rollNoUpdateForm:FormGroup;
  selectedMedium:number=0;
  selectedStandard:number=0;
  selectedDivision:number=0;
  constructor(private apiService: ApiService, private exportService: ExportService, private modalService: NgbModal, private formBuilder: FormBuilder,private utils: UtilityService,) { }
  async ngOnInit() {
    this.formInit();
    this.getMediumList();
  }
  async getMediumList() {
    const queryList = `?skip_pagination=${true}&sort=DESC`;
    const response: any = await this.apiService.getMediumList(queryList);
    if (response.statusCode === 200) {
      this.mediumList = response.data.result;
    }
  }
  async getUpdateRollNo(isExport=false) {
    this.utils.showLoading();
    let queryList = `?sort=DESC&page=${this.currentPage}&limit=${this.pageLimit}&sort=${this.sort}&orderby=${this.orderBy}&medium=${this.selectedMedium}&standard=${this.selectedStandard}&division=${this.selectedDivision}&isRollNo=true`;
    if(isExport)queryList+=`&skip_pagination=${true}`
    const response: any = await this.apiService.getRollNoRows(queryList);
    if (isExport && response.statusCode === 200) {
      this.utils.hideLoading();
      return  response.data.data;
    }
    else if (!isExport && response.statusCode === 200) {
      this.updateRollNo = response.data.data;
      this.totalItems = response.data.totalCount;
    }
    this.utils.hideLoading();
  }
  
  async getStandardList() {
    const queryList = this.selectedMedium;
    const response: any = await this.apiService.getStandardListById(queryList);
    if (response.statusCode === 200) {
      this.standardList = response.data.result;
    }
  }
  async getDivisionList() {
    const queryList = this.selectedStandard;
    const response: any = await this.apiService.getDivisionListById(queryList);
    if (response.statusCode === 200) {
      this.divisionList = response.data.result;
    }
  }
  onPageChange = async (page: any) => {
    this.currentPage = page;
  };
  async editRollno(details) {
    this.onModalOpen()
    this.selectedRollNo= details;
    this.rollNoUpdateForm.patchValue({
      roll_number:  this.selectedRollNo.new_roll_number,
      medium: this.selectedRollNo.medium_id,
      standard: this.selectedRollNo.standard_id,
      division: this.selectedRollNo.division_id,
    })
  }
  onSubmitForm(){
    const restrcturedata={
      medium_id:this.rollNoUpdateForm.value.division,
standard_id:this.rollNoUpdateForm.value.standard,
division_id:this.rollNoUpdateForm.value.medium,
new_roll_no:+this.rollNoUpdateForm.value.new_roll_number,
studentId:this.selectedRollNo.studentId
    }
    this.rollNoUpdateForm.patchValue({newRollNo:restrcturedata.new_roll_no});
    this.onSubmit(restrcturedata);
  }
  getFieldByFieldId(item: any, data: any) {
    return item[data.id];
  }
  get form() {
    return this.rollNoUpdateForm.controls;
  }
  async onModalOpen() {
    this.formInit();
    this.modalReference = this.modalService.open(this.rollNoupdate, this.config);
  }
  onModalClose() {
    this.modalReference.close();
  }
  formInit() {
    this.rollNoUpdateForm = this.formBuilder.group({
      newRollNo: [],
      roll_number: [],
      new_roll_number: [],
      medium: [],
      standard: [],
      division: [],
    })
  }
  async listUpdateRollNo(isExport=false){
  this.utils.showLoading();
  let queryList = `?sort=DESC&page=${this.currentPage}&limit=${this.pageLimit}&sort=${this.sort}&orderby=${this.orderBy}&medium=${this.selectedMedium}&standard=${this.selectedStandard}&division=${this.selectedDivision}&isRollNo=true`;
  if(isExport)queryList+=`&skip_pagination=${true}`
  const response: any = await this.apiService.getRollNoRows(queryList);
  if (isExport && response.statusCode === 200) {
    this.utils.hideLoading();
    return  response.data.data;
  }
  else if (!isExport && response.statusCode === 200) {
    this.list = response.data.data;
    this.totalItems = response.data.totalCount;
  }
  this.utils.hideLoading();
}
standardSelect(da:any){
  this.selectedStandard=+da;
  this.getDivisionList()
}
divisionSelect(da:any){
 this.selectedDivision = +da;
 this.listUpdateRollNo()
 this.getUpdateRollNo()
}
  mediumSelect(da:any){
    this.selectedMedium = +da;
    this.getStandardList()
  }
  async onSubmit(item){
    const obj = {
      'new_roll_no' : this.rollNoUpdateForm.controls['newRollNo'].value  
    }
    const strcture={
      "medium": item.medium_id?+item.medium_id:+this.selectedMedium,
      "standard": item.standard_id?+item.standard_id:+this.selectedStandard,
      "division": item.division_id?+item.division_id:this.selectedDivision,
      "rollNumber":+obj.new_roll_no
    }
    try {
      this.utils.showLoading();
      this.rollNoUpdateForm.reset();
      const response:any=await this.apiService.postRollNoUpdate(strcture,`/${item.studentId}`)
      if (response.statusCode === 200) {
        this.utils.hideLoading();
        this.utils.showSuccessToast(response.message);
        this.getUpdateRollNo();
        this.listUpdateRollNo();
        this.onModalClose();
      }
      else if(response.statusCode === 400){
        this.onModalClose();
        throw new Error(response.message)
      }
    } catch (error:any) {
      this.utils.hideLoading();
      this.utils.showErrorToast(error.message);
    }
  }
  resetFormData(){
    this.rollNoUpdateForm.reset()
  }
  async exportAll(exportType: string, typeexport: 'StudentUpdateOperation' | 'studentUpdateList') {
    const data: any = [];
    let headerRow:any = []
    if (typeexport == 'studentUpdateList'){
      headerRow = [
        `Medium`,
        `Standard`,
        `Divsion`,
        `Student Name`,
        `Current Roll No`,
        `New Roll No`
      ]
    }
    else if (typeexport == 'StudentUpdateOperation'){
      headerRow = [
        `Student Name`,
        `Current Roll No`,
      ]
    }
    if (typeexport == 'studentUpdateList' && exportType != "pdf") {
      data.push(headerRow);
    }
    
    else if (typeexport == 'StudentUpdateOperation' && exportType != "pdf") {
      data.push(headerRow);
    }

    let arr: any

    if (typeexport == 'StudentUpdateOperation') {
      arr = await this.getUpdateRollNo(true);
    }
    else if (typeexport == 'studentUpdateList') {
      arr = await this.listUpdateRollNo(true);
    }
    if (typeexport == 'StudentUpdateOperation') {
      for (const item of arr) {
        const rowData = [
          item.firstName+item.middleName+item.lastName || "-",
          item.new_roll_number || "-",
        ];

        data.push(rowData);
      }
      this.exportService.exportData(
        exportType,
        headerRow,
        data,
        `Exported Update Roll Number List${moment().format("YYYY-MM-DD")}`
      );
    }
    else if (typeexport == 'studentUpdateList') {

      for (const item of arr) {
        const rowData = [
          item.medium || "-",
          item.standard || "-",
          item.division || "-",
          item.firstName + " " + item.middleName+ " " +item.lastName || "-",
          item.old_roll_number || "-",
          item.new_roll_number || "-",
        ];

        data.push(rowData);
      }
      this.exportService.exportData(
        exportType,
        headerRow,
        data,
        `Exported Update Roll Number List${moment().format("YYYY-MM-DD")}`
      );
    }
  }
  sortData(columnName) {
    if (this.orderBy === columnName) {
      this.isAscending = !this.isAscending;
      this.sort = this.isAscending ? "ASC" : "DESC";
    } else {
      this.isAscending = true;
      this.sort = "ASC";
    }
    this.orderBy = columnName;
    this.listUpdateRollNo();
  }
  async deleteRollNo(studentId){
    Swal.fire({
      icon: 'warning',
      title: 'Are you sure?',
      text: 'You will not be able to recover Roll No  !',
      showCancelButton: true,
      confirmButtonText: 'Yes, delete it!',
      confirmButtonColor: '#6259ca',
      cancelButtonText: 'No, cancel it!',
      cancelButtonColor: '#6259ca',
      reverseButtons: true,
    }).then(async (result: any) => {
      if (result.isConfirmed) {
        const response: any = await this.apiService.deleteRollNo(studentId);
        if ((response.statusCode = 200)) {
          Swal.fire({
            title: 'Deleted!',
            text: 'Student Roll No been deleted.',
            icon: 'success',
            confirmButtonColor: '#6259ca',
          });
          await  this.listUpdateRollNo();
          await  this.getUpdateRollNo();
        }
      } else if (result.dismiss === Swal.DismissReason.cancel) {
        Swal.fire({
          title: 'Cancelled!',
          text: 'Student Roll No  is safe :)',
          icon: 'error',
          confirmButtonColor: '#6259ca',
        });
      }
    });
}
}
