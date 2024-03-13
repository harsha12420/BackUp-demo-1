import { formatDate } from "@angular/common";
import { Component, TemplateRef, ViewChild } from "@angular/core";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { NgbModal, NgbModalRef } from "@ng-bootstrap/ng-bootstrap";
import * as moment from "moment";
import { ApiService } from "src/app/services/api.service";
import { ExportService } from "src/app/services/export-service.service";
import { UtilityService } from "src/app/services/utility.service";

@Component({
  selector: "app-freeze-roll-no",
  templateUrl: "./freeze-roll-no.component.html",
  styleUrls: ["./freeze-roll-no.component.scss"],
})
export class FreezeRollNoComponent {
  freezeRollNoForm: FormGroup;
  modalReference: NgbModalRef;
  currentPage = 1;
  pageLimit = 10;
  totalItems = 0;
  isSubmitted = false;
  list: any = [];
  currentDate = formatDate(new Date(), "yyyy-MM-dd", "en-US");
  @ViewChild("RollnoFreeze", { static: false })
  rollNoSet: TemplateRef<any>;
  searchString: string;
  mediumList: any = [];
  staffList: any;
  standardList: any = [];
  divisionList: any = [];
  config = {
    backdrop: true,
    ignoreBackdropClick: true,
    class: "modal-md",
    centered: true,
    modalDialogClass: "modal-xl",
  };
  editFlag=false;
  constructor(
    private formBuilder: FormBuilder,
    private apiService: ApiService,
    private modalService: NgbModal,
    private exportService: ExportService,
    private utils: UtilityService
  ) {}
  async ngOnInit() {
    this.getMediumList();
    this.getFreezeList();
    this.getStaffList();
    this.getStandardList();
    this.getDivisionList();
  }
  formInit() {
    this.freezeRollNoForm = this.formBuilder.group({
      medium: [, Validators.required],
      standard: [, Validators.required],
      division: [, Validators.required],
      freezeDate: [this.currentDate, Validators.required],
      administratorName: [],
      freezeReason: [],
    });
  }

  get form() {
    return this.freezeRollNoForm.controls;
  }
  onModalOpen(modalType:'Edit'|'Add'='Add',passedobj:any={}) {
    if(modalType=="Edit")this.editFlag=true;
    else this.editFlag=false;
    this.formInit();
    this.freezeRollNoForm.patchValue({
      medium:passedobj.medium_id,
standard:passedobj.standard_id,
division:passedobj.division_id,
freezeDate: formatDate(passedobj.freezeDate, "yyyy-MM-dd", "en-US"),
administratorName:passedobj.administratorId,
freezeReason:passedobj.freezeReason,
    })
    this.modalReference = this.modalService.open(this.rollNoSet, this.config);
  }
  onModalClose() {
    this.modalReference.close();
  }
  async onSubmit() {
    if (!this.editFlag) {
      const invalid = this.freezeRollNoForm.invalid;
      let Data = this.freezeRollNoForm.value;
      const arrayofObj: any = [];
      Data.medium.map((med) => {
        Data.standard.map((stan) => {
          Data.division.map((divi) => {
            arrayofObj.push({
              medium: +med,
              standard: +stan,
              division: +divi
            });
          });
        });
      });
      const restrctureRollFreeze = {
        freezeDate: Data.freezeDate,
        freezeReason: Data.freezeReason ? Data.freezeReason : "",
        administratorName: Data.administratorName,
        isFreeze: true,
        classInfo: arrayofObj,
      };
      this.utils.showLoading();
      const response: any = await this.apiService.postRollNoFreeze(
        restrctureRollFreeze
      );
      try {
        if (response.statusCode === 200) {
          this.utils.hideLoading();
          this.onModalClose()
          this.utils.showSuccessToast(response.message)
          this.getFreezeList()
        }
      } catch (error: any) {
        this.utils.showSuccessToast(response.message)
      }
    }
    else if(this.editFlag){
      let Data = this.freezeRollNoForm.value;
      const restrctureRollFreeze = {
        freezeDate: Data.freezeDate,
        freezeReason: Data.freezeReason ? Data.freezeReason : "",
        administratorName: Data.administratorName,
        isFreeze: true,
        medium: Data.medium,
        standard: Data.standard,
        division: Data.division,
      };
      this.utils.showLoading();
      try {
      const response: any = await this.apiService.patchRollNoFreeze(
        restrctureRollFreeze
      );
        if (response.statusCode === 200) {
          this.utils.hideLoading();
          this.onModalClose()
          this.utils.showSuccessToast(response.message)
          this.getFreezeList()
        }
        else if(response.statusCode === 400){
          throw new Error(response.message)
        }
      } catch (error: any) {
        this.utils.hideLoading();
        this.utils.showErrorToast(error.message)
      }
    }
  }
  mediumSelect(data: any) {
  }
  divisionSelect(data: any) {
  }
  standardSelect(data: any) {
  }
  onPageChange = async (page: any) => {
    this.currentPage = page;
  };
  async getMediumList() {
    const queryList = `?skip_pagination=${true}&sort=DESC`;
    const response: any = await this.apiService.getMediumList(queryList);
    if (response.statusCode === 200) {
      this.mediumList = response.data.result;
    }
  }
  async getStandardList() {
    const queryList = `?skip_pagination=${true}&sort=DESC`;
    const response: any = await this.apiService.getStandardList(queryList);
    if (response.statusCode === 200) {
      this.standardList = response.data.result;
    }
  }
  async getDivisionList() {
    const queryList = `?skip_pagination=${true}&sort=DESC`;
    const response: any = await this.apiService.getDivisionList(queryList);
    if (response.statusCode === 200) {
      this.divisionList = response.data.result;
    }
  }
  async getFreezeList(isExport=false) {
    this.utils.showLoading();
    let queryList = `?sort=DESC&page=${this.currentPage}&limit=${this.pageLimit}&isFreeze=true`;
    if(isExport)queryList+=`&skip_pagination=${true}&isRollNo=true`
    
  const response: any = await this.apiService.getRollNoRows(queryList);
    if(isExport && response.statusCode === 200){
      this.utils.hideLoading();
      return response.data.data;
    }
    else if(!isExport && response.statusCode === 200){
      this.utils.hideLoading();
      this.list = response.data.data;;
    }
  }
  async getStaffList() {
    const response: any = await this.apiService.getAllStaff();
    if (response.statusCode === 200) {
      this.staffList = response.data.findUser;
    }
  }
  async exportAll(exportType) {
    const data: any = [];
    const headerRow = [
      "Division",
      "Standard",
      "Medium",
      "Freeze Date ",
      "Reason for Freeze ",
      "Administrator Name",
    ];
    if (exportType != "pdf") {
      data.push(headerRow);
    }
    const arr: any = await this.getFreezeList(true);
    for (const item of arr) {
      const rowData = [
        item.division || "-",
        item.standard || "-",
        item.medium || "-",
        moment(item.freezeDate).format("YYYY-MM-DD hh:mm A") || "-",
        item.freezeReason || "-",
        item.administratorName || "-",
      ];
      data.push(rowData);
    }
    this.exportService.exportData(
      exportType,
      headerRow,
      data,
      `Exported Roll No Freeze List${moment().format("YYYY-MM-DD")}`
    );
  }
}
