import { formatDate } from "@angular/common";
import { Component, TemplateRef, ViewChild } from "@angular/core";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { Router } from "@angular/router";
import { NgbModal, NgbModalRef } from "@ng-bootstrap/ng-bootstrap";
import * as moment from "moment";
import { Constants } from "src/app/Constants/constants";
import { ApiService } from "src/app/services/api.service";
import { ExportService } from "src/app/services/export-service.service";
import { UtilityService } from "src/app/services/utility.service";
import Swal from "sweetalert2";

@Component({
  selector: "app-roll-no",
  templateUrl: "./roll-no.component.html",
  styleUrls: ["./roll-no.component.scss"],
})

export class RollNoComponent {
  pageLimit = Constants.PAGE_LIMIT;
  currentPage = Constants.STARTING_PAGE;
  @ViewChild("RollnoSet", { static: false })
  rollNoSet: TemplateRef<any>;
  @ViewChild("EditRollno", { static: false })
  EditrollNo: TemplateRef<any>;
  modalReference: NgbModalRef;
  totalItems: number = 0;
  list: any = [];
  newStudentList: any = [];
  preferences={
    date_of_admission:"dateOfAdmission",
  middle_name:"middleName",
  last_name:"lastName",
  first_name:"firstName",
  }
  searchString = "";
  isSubmitted = false;
  orderBy: any = "created_at";
  sort = "DESC";
  config = {
    backdrop: true,
    ignoreBackdropClick: true,
    class: "modal-md",
    centered: true,
    modalDialogClass: "modal-xl",
  };
  selectedPreferance = [
    "firstName asc",
    "lastName asc"
  ]
  isAscending = false;
  rollNoSetForm: FormGroup;
  EditrollNoForm: FormGroup;
  tableHeader: any = [];
  mediumList: any = [];
  standardList: any = [];
  divisionList: any = [];
  isrollNoSetFormSubmitted = false;
  selectedMedium:number=0;
  selectedStandard:number=0;
  selectedDivision:number=0;
  constructor(
    private apiService: ApiService,
    private utils: UtilityService,
    private modalService: NgbModal,
    private exportService: ExportService,
    private formBuilder: FormBuilder,
    private router: Router
  ) {}
  async ngOnInit() {
    this.onMediumLoad()
  }
  async onMediumLoad() {
    const queryList = `?skip_pagination=${true}&sort=DESC`;
    const response: any = await this.apiService.getMediumList(queryList);
    if (response.statusCode === 200) {
      this.mediumList = response.data.result;
    }
  }
  onPageChange = async (page: any) => {
    this.currentPage = page;
    this.getList();
  };

  onSearch(userSearch = false) {
    if (this.searchString.trim() !== "" || userSearch) {
      this.onPageChange(1);
    }
  }
  async getList(isExport = false) {
    this.utils.showLoading();
    let queryList = `?page=${this.currentPage}&limit=${this.pageLimit}&search=${this.searchString}&sort=${this.sort}&orderby=${this.orderBy}&medium=${this.selectedMedium}&standard=${this.selectedStandard}&division=${this.selectedDivision}&isRollNo=true`;
    if(isExport)queryList+=`pagination=false`
    const response: any = await this.apiService.getRollNoRows(queryList);
    if (isExport && response.statusCode === 200) {
      
      this.utils.hideLoading();
      return response.data.data;
    }
    else if (!isExport && response.statusCode === 200) {
      this.list =response.data.data;
      // .data.data;
      this.totalItems =response.data.totalCount;
    }
    this.utils.hideLoading();
  }
  async getNewAdmissionList(isExport = false) {
    this.utils.showLoading();
    let queryList = `?sort=DESC&page=${this.currentPage}&limit=${this.pageLimit}&search=${this.searchString}&sort=${this.sort}&orderby=${this.orderBy}&medium=${this.selectedMedium}&standard=${this.selectedStandard}&division=${this.selectedDivision}`;
    queryList+=`&isRollNo=false`;
    if(isExport)queryList+=`&skip_pagination=${true}`
    const response: any = await this.apiService.getRollNoRows(queryList);
    if (isExport && response.statusCode === 200) {
      this.utils.hideLoading();
      return  response.data.data;
    }
    else if (!isExport && response.statusCode === 200) {
      this.newStudentList = response.data.data;
      this.totalItems = response.data.totalCount;
    }
    this.utils.hideLoading();
  }
  formInit() {
    this.rollNoSetForm = this.formBuilder.group({
      Gender:["Male",Validators.required],
      date_of_admission:['',Validators.max(4)],
      middle_name:['',Validators.max(4)],
      last_name:['',Validators.max(4)],
      first_name:['',Validators.max(4)],
      standard:[],
      division:[],
      medium:[]
    });
    this.EditrollNoForm = this.formBuilder.group({
      Gender: ['',],
      date_of_admission: ['',],
      middle_name: ['',],
      last_name: ['',],
      first_name: ['',],
      roll_no: [''],
      studentId:['',Validators.required]
    });
  }
  onModalClose() {
    this.modalReference.close();
  }
  async onModalOpen() {
    this.formInit();
    this.modalReference = this.modalService.open(this.rollNoSet, this.config);
  }
  onClear() {
    this.searchString = "";
    this.onPageChange(1);
  }
  async onSubmit(formname) {
    if (formname === 'setCriteria') {
      if(this.rollNoSetForm.invalid){
        return
      }
      
      const dataFormList = this.rollNoSetForm.value;
    let customMap = {}
    customMap['first_name']= dataFormList.first_name;
    customMap['last_name']= dataFormList.last_name;
    customMap['date_of_admission']= dataFormList.date_of_admission;
    customMap['middle_name']= dataFormList.middle_name;
    let sortedObj:any = Object.fromEntries(
      Object.entries(customMap).sort(([,a]:any, [,b]:any) => a - b)
    );
    let sortobject:string[]=[]
    for (const [key,value] of  Object.entries(sortedObj)) {
      sortobject.push(`${this.preferences[key]} asc`)
    }
    this.selectedPreferance=sortobject;
     }
     else if(formname ==="singleRollno"){
      const editStudentValues=this.EditrollNoForm.value;
      const strcture={
        "medium": +this.selectedMedium,
        "standard": +this.selectedStandard,
        "division": +this.selectedDivision,
        "rollNumber":+editStudentValues.roll_no
      }
      try {
        this.utils.showLoading();
        this.EditrollNoForm.reset();
        const response:any=await this.apiService.postRollNoUpdate(strcture,`/${editStudentValues.studentId}`)
        if (response.statusCode === 200) {
          this.utils.hideLoading();
          this.utils.showSuccessToast(response.message);
          this.onModalClose();
          this.getNewAdmissionList()
          this.getList();
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
  }
  async onSubmitGenerateRollNumber(studentId) {
    this.utils.showLoading();
    if( this.rollNoSetForm?.invalid||!this.selectedMedium||!this.selectedDivision||!this.selectedStandard){
      return 
    }
    const dataFormList = this.rollNoSetForm?.value;
    const dataStrcture = {
      medium: this.selectedMedium,
      standard: this.selectedStandard,
      division: this.selectedDivision,
      "alreadyGenerated": this.list.length>0?true:false,
      "singleStudent": true,
      "studentId": studentId,
      maleFirst: dataFormList?.Gender === "Male" ? true : false,
      preferences: [
        ...this.selectedPreferance
      ]
    }
    const response: any = await this.apiService.postRollNoRows(dataStrcture);
    if (response.statusCode === 200) {
      this.utils.hideLoading();
      this.utils.showSuccessToast(response.message);
      this.onModalClose();
      await this.getList();
      await this.getNewAdmissionList();
    }
    this.utils.hideLoading();
  }
  
  get form() {
    return this.rollNoSetForm.controls;
  }
  async editRollnoGenerated(details) {
    this.formInit();
    this.modalReference = this.modalService.open(this.EditrollNo, this.config);
    this.EditrollNoForm.patchValue({
      Gender: details.gender,
      date_of_admission:details.dateOfAdmission? formatDate(
        new Date(details.dateOfAdmission),
        "yyyy-MM-dd",
        "en-US"
      ):'',
      middle_name: details.middleName,
      last_name: details.lastName,
      first_name: details.firstName,
      roll_no: details.new_roll_number,
      studentId:details.studentId
    });
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
  standardSelect(da:any){
     this.selectedStandard=+da;
     this.getDivisionList()
  }
  divisionSelect(da:any){
    this.selectedDivision = +da;
    this.listTabels()
  }
  mediumSelect(da:any){
    this.selectedMedium = +da;
    this.getStandardList()
  }
  listTabels(){
    this.getNewAdmissionList();
    this.getList();
  }
  async exportAll(exportType: string,typeexport:'StudentRollno'|'newStudent') {
    const data: any = [];
    const headerRow = [
      "Student First Name",
      "Middle Name",
      "Last Name",
      "Gender",
      "Date Of Admission",
    ];
    let arr: any 
    if(typeexport=='newStudent'){
      arr= await this.getNewAdmissionList(true);
    }
    else if(typeexport=='StudentRollno'){
      arr= await this.getList(true);
    }
    if(typeexport=='newStudent'){
    for (const item of arr) {
      const rowData = [
        item.firstName || "-",
        item.middleName || "-",
        item.lastName || "-",
        item.gender || "-",
        moment(item.dateOfAdmission).format("YYYY-MM-DD hh:mm A") || "-",
      ];

      data.push(rowData);
    }
    this.exportService.exportData(
      exportType,
      headerRow,
      data,
      `Exported Roll Number Generation List${moment().format("YYYY-MM-DD")}`
    );
    }
    else if(typeexport=='StudentRollno'){
      for (const item of arr) {
        const rowData = [
          item.firstName || "-",
          item.middleName || "-",
          item.lastName || "-",
          item.gender || "-",
          moment(item.dateOfAdmission).format("YYYY-MM-DD hh:mm A") || "-",
          item.new_roll_number || "-",
        ];
  
        data.push(rowData);
      }
      this.exportService.exportData(
        exportType,
        headerRow,
        data,
        `Exported Roll Number Generation List${ moment().format("YYYY-MM-DD")}`
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
    this.getList();
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
            await this.getNewAdmissionList()
            await this.getList();
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
