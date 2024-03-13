import { Component, TemplateRef, ViewChild } from '@angular/core';
import {
  FormArray,
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from '@angular/forms';
import { Router } from '@angular/router';
import { NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import * as moment from 'moment';
import { Constants } from 'src/app/Constants/constants';
import { ApiService } from 'src/app/services/api.service';
import { ExportService } from 'src/app/services/export-service.service';
import { UtilityService } from 'src/app/services/utility.service';
import { NoSpace } from 'src/app/shared/validations/no-space.validator';

@Component({
  selector: 'app-add-staff',
  templateUrl: './add-staff.component.html',
  styleUrls: ['./add-staff.component.scss'],
})
export class AddStaffComponent {
  pageLimit = Constants.PAGE_LIMIT;
  currentPage = Constants.STARTING_PAGE;
  totalItems: number;
  staffList: any = [];
  addStaffForm: FormGroup;
  @ViewChild('addStaff', { static: false }) addStaff: TemplateRef<any>;
  isFormSubmitted = false;
  config = {
    backdrop: true,
    ignoreBackdropClick: true,
    class: 'modal-md',
    centered: true,
    modalDialogClass: 'modal-xl',
  };
  searchString = '';
  modalReference: NgbModalRef;
  roleList: any = [];
  isEdit = false;
  userId: any = null;
  showPassword = false;
  orderBy: any = 'created_at';
  sort = 'DESC'
  isAscending = false
  constructor(
    private modalService: NgbModal,
    private formBuilder: FormBuilder,
    private apiService: ApiService,
    private utils: UtilityService,
    private exportService: ExportService,
    private router: Router
  ) { }

  async ngOnInit() {
    await this.getStaffList();
  }

  togglePasswordVisibility() {
    this.showPassword = !this.showPassword;
  }

  async getStaffList(isExport=false) {
    this.utils.showLoading();
    let queryList = `?page=${this.currentPage}&limit=${this.pageLimit}&search=${this.searchString}&sort=${this.sort}&orderby=${this.orderBy}`;
    if(isExport){
      queryList+=`&skip_pagination=true`
    }
    const response: any = await this.apiService.getStaffList(queryList);
    if (response.statusCode === 200 &&!isExport) {
      this.staffList = response.data.result;
      this.totalItems = response.data.totalCount;
    }
    else if(isExport&&response.statusCode === 200){
      this.utils.hideLoading();  
      return response.data.result;
    }
    this.utils.hideLoading();
  }

  async getroleList() {
    const queryList = `?skip_pagination=true`;
    const response: any = await this.apiService.getRoleList(queryList);
    if (response.statusCode === 200) {
      this.roleList = response.data.result;
    }
  }

  formInit() {
    this.addStaffForm = this.formBuilder.group({
      mobile: [
        '',
        [
          Validators.required,
          Validators.min(1000000000),
          Validators.max(9999999999),
        ],
      ],
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(8)]],
      first_name: ['', [Validators.required, NoSpace()]],
      middle_name: [''],
      last_name: ['', [Validators.required, NoSpace()]],
      role_ids: this.formBuilder.array([
        this.formBuilder.group({ role_id: [null, Validators.required] }),
      ]),
    });
  }

  get role_ids(): FormArray {
    return this.addStaffForm.get('role_ids') as FormArray;
  }

  get stafForm() {
    return this.addStaffForm.controls;
  }

  onPageChange = async (page: any) => {
    this.currentPage = page;
    this.getStaffList();
  };

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

  onAddStaff() {
    this.router.navigate(['/admin/staff/add-staff']);
  }

  async onSubmit() {
    try {
      this.isFormSubmitted = true;
      if (this.addStaffForm.invalid) {
        return;
      }
      this.utils.showLoading();
      const role_ids = this.addStaffForm.value.role_ids[0].role_id.map(
        (item: any) => {
          return { role_id: item };
        }
      );
      const obj = {
        ...this.addStaffForm.getRawValue(),
        mobile: this.addStaffForm.value.mobile.toString(),
        role_ids,
      };
      this.isEdit ? (obj['user_id'] = this.userId) : '';
      const response: any = await this.apiService.addStaff(obj);
      this.utils.hideLoading();
      if (response.statusCode === 200) {
        this.utils.showSuccessToast(response.message);
        this.onModalClose();
        this.getStaffList();
      }
    } catch (error) {
      this.utils.hideLoading();
    }
  }

  onModalClose() {
    if (this.isEdit)
      this.addStaffForm.addControl(
        'password',
        new FormControl('', Validators.required)
      );
    this.userId = null;
    this.addStaffForm.reset();
    this.isFormSubmitted = false;
    this.modalReference.close();
    this.isEdit = false;
  }

  async getStaffById(id) {
    try {
      const queryList = `?user_id=${id}`;
      const response: any = await this.apiService.getStaffRoleById(queryList);
      if (response.statusCode === 200) {
        return response.data;
      }
      return null;
    } catch (error) {
      return null;
    }
  }

  async onEdit(data: any) {
    this.userId = data.id;

    this.router.navigate(['/admin/staff/add-staff'], {
      queryParams: { userId: data.id },
    });

  }

  onPressAllowNumber(event: any) {
    if (event.key == 'Tab') {
      return true;
    } else {
      let keyChar = String.fromCharCode(event.keyCode);
      let re = /[0-9]/;
      return re.test(keyChar);
    }
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
    this.getStaffList();
  }
  
    async exportAll(exportType ){
      const data: any = [];
      const headerRow = [ 
        "Name",
        "Employee Code",
        "Enrollment Type",
        "Email",
        "Mobile",
        "Date Of Joining",
        "Created At",
     ]
      if (exportType != "pdf") {
        data.push(headerRow);
      }
      const arr: any = await this.getStaffList(true);
      for (const item of arr) {
        const rowData = [
          item.first_name+" "+item.middle_name+" "+item.last_name||"-",
          item.employee_code||"-",
          item.enrollment_type||"-",
          item.email||"-",
          item.mobile||"-",
          moment(item.date_joining).format("YYYY-MM-DD hh:mm A")||"-",
          moment(item.created_at).format("YYYY-MM-DD hh:mm A")||"-",
        ]
        data.push(rowData);
      }
      this.exportService.exportData(
        exportType,
        headerRow,
        data,
        `Exported Staff List${ moment().format("YYYY-MM-DD")}`
      );
    }
  
}
