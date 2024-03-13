import { Component,TemplateRef, ViewChild } from '@angular/core';
import { FormArray, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
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
import Swal from 'sweetalert2';


@Component({
  selector: 'app-std-category-wise-mapping',
  templateUrl: './std-category-wise-mapping.component.html',
  styleUrls: ['./std-category-wise-mapping.component.scss']
})
export class StdCategoryWiseMappingComponent {
  uniqueIdentifer:any;
  isEdit:any = false;
  mediumList:any;
  selectedMedium:any;
  percentageValue:any;
  subWiseCategoryWiseList:any;
  lastFeeDateVal:any;
  feesCategoryList:any;
  standardList:any;
  addStdCategoryForm: FormGroup;
  modalReference: NgbModalRef;
  pageLimit = Constants.PAGE_LIMIT;
  currentPage = Constants.STARTING_PAGE;
  find = '';
  totalItems: number;
  headGroupMasterList: any = [];
  @ViewChild('stdCategoryModel', { static: false })
  stdCategoryModel: TemplateRef<any>;
  headGroupMasterListing:any = [];
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
  groupMasterList :any;
  selectedItems:any = [];
  
  constructor(
    private modalService: NgbModal,
    private formBuilder: FormBuilder,
    private apiService: ApiService,
    private utils: UtilityService,
    private exportService: ExportService
  ) {
   }

  async ngOnInit() {
    await this.getHeadGroupListing();
    await this.getMediumList();
    await this.getFeesCategory();
    await this.getStandardWiseCategoryWiseMapping();
  }

  handleInput(event, i, type){
    i || i == 0 ? this.disableIntegerInput(i) : this.disableIntegerInput(null);
    i || i == 0 ? this.validatePer(event,i,type) : this.validatePer(event,null,type);
  }

  createServiceGroup(){    
    return this.formBuilder.group({
      fee_date : ['', [Validators.required]],
      late_fee_date: ['', [Validators.nullValidator]],
      tenDaysDelayAmount: ['', [Validators.nullValidator]],
      tenDaysDelayPercentage: ['', [Validators.nullValidator]],
      tenToTwentyDaysDelayAmount: ['', [Validators.nullValidator]],
      tenToTwentyDaysDelayPercentage: ['', [Validators.nullValidator]],
      twentyDaysDelayAmount: ['', [Validators.nullValidator]],
      twentyDaysDelayPercentage: ['', [Validators.nullValidator]],
      installment_serial_no: [this.serviceGroups.controls.length + 1, [Validators.required]],
      installment_amount : ['' , [Validators.required]]
    });
  }

  onAdd(){
    if(this.serviceGroups.valid){
      this.serviceGroups.push(this.createServiceGroup());
    }else{
      this.isSubmitted = true;
    }
    this.lastFeeDateVal = this.serviceGroups.at(this.serviceGroups.value.length -1 ).get('lastFeeDate')?.value;
    const feeHeadAmount = this.addStdCategoryForm.get('feeHeadAmount')?.value;

    const totalAmount = this.divideAndRound(feeHeadAmount, this.serviceGroups.value.length);
    for(let i=0;i < totalAmount.length;i++){
      this.serviceGroups.at(i).get('installment_amount')?.setValue(totalAmount[i]);
    }
  }

  divideAndRound(initialValue: number, numberOfParts: number): number[] {
    const partValue = Math.round(initialValue / numberOfParts);
    const lastPart = initialValue - (numberOfParts - 1) * partValue;
    const result = Array(numberOfParts - 1).fill(partValue).concat(lastPart);
    return result;
  }
  

  get serviceGroups(): FormArray {
    return this.addStdCategoryForm.controls['serviceGroups'] as FormArray;
  }
  
  getControl(index: number, controlName: string) {
    return this.serviceGroups.at(index).get(controlName);
  }

  async getMediumList() {
    this.utils.showLoading();
    let queryList = `?search=${this.searchString}&page=${this.currentPage}&limit=${this.pageLimit}&sort=${this.sort}&orderby=${this.orderBy}`;
    const response: any = await this.apiService.getMediumList(queryList);
    if (response.statusCode === 200) {
      this.mediumList = response.data.result;
    }
    this.utils.hideLoading();
  }

  async getStandardList() {
    this.utils.showLoading();
    const queryList = this.selectedMedium;
    const response: any = await this.apiService.getStandardListById(queryList);
    if (response.statusCode === 200) {
      this.standardList = response.data.result;
    }
    this.utils.hideLoading();
  }

  async getFeesCategory(){
    this.utils.showLoading();
    let queryList = `?search=${this.searchString}&page=${this.currentPage}&limit=${this.pageLimit}&sort=${this.sort}&orderby=${this.orderBy}`;
    const response: any = await this.apiService.getFeesCategory(queryList);
    if (response.statusCode === 200) {
      this.feesCategoryList = response.data.result;
    }
    this.utils.hideLoading();
  }

  async getHeadGroupListing() {
    this.utils.showLoading();
    const queryList = `?search=${this.searchString}&page=${this.currentPage}&limit=${this.pageLimit}&sort=${this.sort}&orderby=${this.orderBy}`;
    const response: any = await this.apiService.getHeadGroupMaster(queryList);
    if (response.statusCode === 200) {
      this.headGroupMasterListing = response.data.result;
    }
    this.utils.hideLoading();
  }

  async getStandardWiseCategoryWiseMapping(isExport = false) {
    try{
      this.utils.showLoading();
      let queryList = `?search=${this.searchString}&page=${this.currentPage}&limit=${this.pageLimit}&sort=${this.sort}`;
      if (isExport) {
        queryList += `&skip_pagination=true`;
      }
      const response: any = await this.apiService.getStandardWiseCategoryWiseMapping(queryList);
      if (!isExport && response.statusCode === 200) {
        this.subWiseCategoryWiseList = response.data.result;
        this.totalItems = response.data.totalCount;
      } else if (isExport && response.statusCode === 200) {
        this.utils.hideLoading();
        return response.data.result;
      }
      this.utils.hideLoading();
    }catch(e){
      this.utils.hideLoading();
    }
  }

  onPageChange = async (page: any) => {
    this.currentPage = page;
    this.getStandardWiseCategoryWiseMapping();
  };
  onModalOpen() {
    this.formInit();
    this.modalReference = this.modalService.open(this.stdCategoryModel, this.config);
    this.modalReference.hidden.subscribe(() => {
      this.onModalClose();
    });
  }
    formInit() {
      this.addStdCategoryForm = this.formBuilder.group({
        medium : ['' || null, [Validators.required]],
        standard : ['' || null, [Validators.required]],
        feeCategory : ['' || null, [Validators.required]],
        feeHeadDetail : ['' || null, [Validators.required]],
        feeHeadAmount : ['' || null, [Validators.required]],
        serviceGroups: this.formBuilder.array([]),
        Status: ['true', Validators.required]
      });
    }
  get form() {
    return this.addStdCategoryForm.controls;
  }

  feeAmountCalculate(event){
    const value = event.target.value;
    for(let i=0;i < this.serviceGroups.value.length;i++){
      const installmentAmount = Math.round(value / this.serviceGroups.length);
      this.serviceGroups.at(i).get('installment_amount')?.setValue(installmentAmount);
    }
  }

  deleteInstallment(i){
    this.serviceGroups.removeAt(i);
    const feeHeadAmount = this.addStdCategoryForm.get('feeHeadAmount')?.value;
    
    if(this.serviceGroups.value.length){
      const totalAmount = this.divideAndRound(feeHeadAmount, this.serviceGroups.value.length);
      for(let i=0;i < totalAmount.length;i++){
        this.serviceGroups.at(i).get('installment_amount')?.setValue(totalAmount[i]);
      }
    }
    
    for (let i = 0; i < this.serviceGroups.length; i++) {
      this.serviceGroups.at(i).get('installment_serial_no')?.setValue(i + 1);
    }
  }

  disableIntegerInput(i) {
    const tenDaysDelayAmount:any =  (i || i==0) ?this.serviceGroups.at(i).get('tenDaysDelayAmount') : this.addStdCategoryForm.get('tenDaysDelayAmount');
    const tenDaysDelayPercentage:any=  (i || i==0) ?this.serviceGroups.at(i).get('tenDaysDelayPercentage') : this.addStdCategoryForm.get('tenDaysDelayPercentage');
    const tenToTwentyDaysDelayAmount:any =  (i || i==0 )?this.serviceGroups.at(i).get('tenToTwentyDaysDelayAmount') : this.addStdCategoryForm.get('tenToTwentyDaysDelayAmount');
    const tenToTwentyDaysDelayPercentage:any=  (i || i==0) ?this.serviceGroups.at(i).get('tenToTwentyDaysDelayPercentage') : this.addStdCategoryForm.get('tenToTwentyDaysDelayPercentage');
    const twentyDaysDelayAmount:any =  (i || i==0)?this.serviceGroups.at(i).get('twentyDaysDelayAmount') : this.addStdCategoryForm.get('twentyDaysDelayAmount');
    const twentyDaysDelayPercentage:any=  (i || i==0) ?this.serviceGroups.at(i).get('twentyDaysDelayPercentage') : this.addStdCategoryForm.get('twentyDaysDelayPercentage');

    tenDaysDelayAmount.value ? tenDaysDelayPercentage?.disable() : tenDaysDelayPercentage?.enable();
    tenDaysDelayPercentage.value ? tenDaysDelayAmount?.disable() : tenDaysDelayAmount?.enable();
    tenToTwentyDaysDelayAmount.value ? tenToTwentyDaysDelayPercentage?.disable() : tenToTwentyDaysDelayPercentage?.enable();
    tenToTwentyDaysDelayPercentage.value ? tenToTwentyDaysDelayAmount?.disable() : tenToTwentyDaysDelayAmount?.enable();
    twentyDaysDelayAmount.value ? twentyDaysDelayPercentage?.disable() : twentyDaysDelayPercentage?.enable();
    twentyDaysDelayPercentage.value ? twentyDaysDelayAmount?.disable() : twentyDaysDelayAmount?.enable();
  }

  lastFeeDate(i){
    this.lastFeeDateVal = this.serviceGroups.at(i).get('late_fee_date')?.value;
  }

  validatePer(event,i,type){
    if (event.target.value > 100) {
      if(type == '10DayDelay'){
        i || i == 0 ? this.serviceGroups.at(i).get('tenDaysDelayPercentage')?.setValue('') : this.addStdCategoryForm.get('tenDaysDelayPercentage')?.setValue('');
      }
      else if(type == '10OrMoreDayDelay'){
        i || i == 0 ? this.serviceGroups.at(i).get('tenToTwentyDaysDelayPercentage')?.setValue('') : this.addStdCategoryForm.get('tenToTwentyDaysDelayPercentage')?.setValue('');
      }
      else{
        i || i == 0 ? this.serviceGroups.at(i).get('twentyDaysDelayPercentage')?.setValue('') : this.addStdCategoryForm.get('twentyDaysDelayPercentage')?.setValue('');
      }
      this.utils.showErrorToast('Percentage value should not be greater than 100.');
    }
  }

  processDelayFields(servicegrp: any, amountField: string, percentageField: string) {
    if (servicegrp[amountField] === "" && servicegrp[percentageField] === "") {
      delete servicegrp[amountField];
      delete servicegrp[percentageField];
    } else if (servicegrp[amountField] && servicegrp[percentageField] === "") {
      delete servicegrp[percentageField];
    } else if (servicegrp[amountField] === "" && servicegrp[percentageField]) {
      delete servicegrp[amountField];
    }
  }

  async onSubmit() {
    try {
      let totalAmount = 0;
      this.isSubmitted = true;
      if (this.addStdCategoryForm.invalid) {
        return;
      }
      this.utils.showLoading();
      const feeHead = this.addStdCategoryForm.controls['feeHeadAmount'].value;
      if( this.addStdCategoryForm.controls['serviceGroups'].value.length == 0 && !this.EditId){
        this.utils.showErrorToast('Please add at least one installment');
        this.utils.hideLoading();
        return;
      }
      if(!this.EditId){
        for(let i=0;i < this.serviceGroups.value.length;i++){
          totalAmount += +this.serviceGroups.at(i).get('installment_amount')?.value;
        }
        if(feeHead > totalAmount){
          this.utils.showErrorToast('Total Amount is less than fee head amount');
          this.utils.hideLoading();
        }else if(feeHead < totalAmount){
          this.utils.showErrorToast('Total Amount is greater than fee head amount');
          this.utils.hideLoading();
        }
      }

      let obj = {
        medium_id : this.addStdCategoryForm.controls['medium'].value,
        standard_id : this.addStdCategoryForm.controls['standard'].value,
        fee_category_id : this.addStdCategoryForm.controls['feeCategory'].value,
        fee_head_group_id : this.addStdCategoryForm.controls['feeHeadDetail'].value,
        fee_head_amount : +this.addStdCategoryForm.controls['feeHeadAmount'].value,
        isActive:
          this.addStdCategoryForm.controls['Status'].value == 'true'
            ? true
            : false,
        installments : this.addStdCategoryForm.controls['serviceGroups'].value
      }

      obj.installments.forEach((servicegrp) => {
        this.processDelayFields(servicegrp, 'tenDaysDelayAmount', 'tenDaysDelayPercentage');
        this.processDelayFields(servicegrp, 'tenToTwentyDaysDelayAmount', 'tenToTwentyDaysDelayPercentage');
        this.processDelayFields(servicegrp, 'twentyDaysDelayAmount', 'twentyDaysDelayPercentage');
      });

      
      if(this.EditId){
        obj['id'] = this.EditId;
        obj['installment_serial_no'] = this.addStdCategoryForm.controls['installment_serial_no'].value;
        obj['installment_amount'] = +this.addStdCategoryForm.controls['installment_amount'].value;
        obj['fee_date'] = this.addStdCategoryForm.controls['fee_date'].value;
        obj['late_fee_date'] = this.addStdCategoryForm.controls['late_fee_date'].value;
        obj['unique_identifier'] = this.uniqueIdentifer;
        if(this.form['tenDaysDelayAmount'].value) obj['tenDaysDelayAmount'] =  +this.form['tenDaysDelayAmount'].value; 
        if(this.form['tenDaysDelayPercentage'].value) obj['tenDaysDelayPercentage'] =  +this.form['tenDaysDelayPercentage'].value; 
        if(this.form['tenToTwentyDaysDelayAmount'].value) obj['tenToTwentyDaysDelayAmount'] =  +this.form['tenToTwentyDaysDelayAmount'].value
        if(this.form['tenToTwentyDaysDelayPercentage'].value) obj['tenToTwentyDaysDelayPercentage'] =  +this.form['tenToTwentyDaysDelayPercentage'].value
        if(this.form['twentyDaysDelayAmount'].value) obj['twentyDaysDelayAmount'] =  +this.form['twentyDaysDelayAmount'].value
        if(this.form['twentyDaysDelayPercentage'].value) obj['twentyDaysDelayPercentage'] =  +this.form['twentyDaysDelayPercentage'].value
        delete obj.installments;
      }
      
      const response: any = await this.apiService.addStandardWiseCategoryWiseMapping(obj);
      this.utils.hideLoading();
      if (response.statusCode === 200) {
        this.utils.showSuccessToast(response.message);
        this.onModalClose();
        this.getStandardWiseCategoryWiseMapping();
      }
    } catch (error) {
      this.utils.hideLoading();
    }
  }
  onModalClose() {
    this.isSubmitted = false;
    this.EditId = null;
    this.isEdit = false;
    this.modalReference.close();
    this.selectedItems = []
  }
  async editHeadGroupRecord(listId) {
    this.EditId = listId;
    if(this.EditId){
      this.isEdit = true;
    }
    this.formInit();
    this.addStdCategoryForm.addControl('fee_date', this.formBuilder.control('',Validators.required))
    this.addStdCategoryForm.addControl('late_fee_date', this.formBuilder.control('',Validators.nullValidator))
    this.addStdCategoryForm.addControl('tenDaysDelayAmount', this.formBuilder.control('',Validators.nullValidator))
    this.addStdCategoryForm.addControl('tenDaysDelayPercentage', this.formBuilder.control('',Validators.nullValidator))
    this.addStdCategoryForm.addControl('tenToTwentyDaysDelayAmount', this.formBuilder.control('',Validators.nullValidator))
    this.addStdCategoryForm.addControl('tenToTwentyDaysDelayPercentage', this.formBuilder.control('',Validators.nullValidator))
    this.addStdCategoryForm.addControl('twentyDaysDelayAmount', this.formBuilder.control('',Validators.nullValidator))
    this.addStdCategoryForm.addControl('twentyDaysDelayPercentage', this.formBuilder.control('',Validators.nullValidator))
    this.addStdCategoryForm.addControl('installment_serial_no', this.formBuilder.control('',Validators.required))
    this.addStdCategoryForm.addControl('installment_amount', this.formBuilder.control('',Validators.required))
      
    this.modalReference = this.modalService.open(this.stdCategoryModel, this.config);
    this.modalReference.hidden.subscribe(() => {
      this.onModalClose();
    });
    const response: any = await this.apiService.getStandardWiseCategoryWiseMappingById(listId);
    this.uniqueIdentifer = response.data.unique_identifier;
    if ((response.statusCode = 200)) {
      this.addStdCategoryForm.patchValue({
        medium :response.data.medium_id,
        standard : response.data.standard_id,
        feeCategory : response.data.fee_category_id,
        feeHeadDetail : response.data.fee_head_group_id,
        feeHeadAmount : response.data.fee_head_amount,
        installment_serial_no : response.data.installment_serial_no,
        installment_amount : response.data.installment_amount,
        fee_date : moment(response.data.fee_date).format('YYYY-MM-DD'),
        late_fee_date : response.data.late_fee_date ? moment(response.data.late_fee_date).format('YYYY-MM-DD') : '',
        tenDaysDelayAmount : response.data.ten_days_delay_amount ? response.data.ten_days_delay_amount : '',
        tenToTwentyDaysDelayAmount : response.data.ten_to_twenty_days_delay_amount ? response.data.ten_to_twenty_days_delay_amount : '',
        twentyDaysDelayAmount : response.data.gtr_twenty_days_delay_amount ? response.data.gtr_twenty_days_delay_amount : '',
        Status : response.data.is_active.toString()
      })
    }
    this.disableIntegerInput(null);
  }

  deleteStandardWiseCategoryWiseMapping(id) {
    Swal.fire({
      icon: 'warning',
      title: 'Are you sure?',
      text: 'You will not be able to recover this record !',
      showCancelButton: true,
      confirmButtonText: 'Yes, delete it!',
      confirmButtonColor: '#6259ca',
      cancelButtonText: 'No, cancel it!',
      cancelButtonColor: '#6259ca',
      reverseButtons: true,
    }).then(async (result: any) => {
      if (result.isConfirmed) {
        const response: any = await this.apiService.deleteStandardWiseCategoryWiseMapping(id);
        if ((response.statusCode = 200)) {
          Swal.fire({
            title: 'Deleted!',
            text: 'Your record been deleted.',
            icon: 'success',
            confirmButtonColor: '#6259ca',
          });
          await this.getStandardWiseCategoryWiseMapping();
        }
      } else if (result.dismiss === Swal.DismissReason.cancel) {
        Swal.fire({
          title: 'Cancelled!',
          text: 'Your record is safe :)',
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

  mediumSelect(da:any){
    this.selectedMedium = +da;
    this.getStandardList()
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
    this.getStandardWiseCategoryWiseMapping();
  }

  async exportAll(exportType) {
    const data: any = [];
    const headerRow = [
      'Medium', 
      'Standard',
      'Fee Category',
      'Fee Head',
      'Head Amount',
      'Installments',
      'Installment Amount',
      'Fee Date',
      'Late Fee Date',
      '10 Days Delay',
      '>10<=20 Days Delay',
      '20 Days Delay',
      'Status',
      'Date & Time'
    ];

    if (exportType != 'pdf') {
      data.push(headerRow);
    }
    const arr: any = await this.getStandardWiseCategoryWiseMapping(true);

    for (const item of arr) {
      const rowData = [
        item.medium_name || '-',
        item.standard_name || '-',
        item.category_name || '-',
        item.fee_head_group_master_name || '-',
        item.fee_head_amount || '-',
        item.installment_serial_no || '-',
        item.installment_amount || '-',
        moment(item.fee_date).format('YYYY-MM-DD hh:mm A') || '-',
        moment(item.late_fee_date).format('YYYY-MM-DD hh:mm A') || '-',
        item.ten_days_delay_amount || '-',
        item.ten_to_twenty_days_delay_amount || '-',
        item.gtr_twenty_days_delay_amount || '-',
        item.is_active ? 'Active' : 'In Active' || '-',
        moment(item.created_at).format('YYYY-MM-DD hh:mm A') || '-',
      ];
      data.push(rowData);
    }
    this.exportService.exportData(
      exportType,
      headerRow,
      data,
      `Exported Std Category Wise Fee Mapping List ${moment().format('YYYY-MM-DD')}`
    );
  }
}
