import { Component } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { Constants } from 'src/app/Constants/constants';
import { ApiService } from 'src/app/services/api.service';
import { ExportService } from 'src/app/services/export-service.service';
import { UtilityService } from 'src/app/services/utility.service';

@Component({
  selector: 'app-division-transfer-list',
  templateUrl: './division-transfer-list.component.html',
  styleUrls: ['./division-transfer-list.component.scss'],
})
export class DivisionTransferListComponent {
  constructor(
    private modalService: NgbModal,
    private formBuilder: FormBuilder,
    private apiService: ApiService,
    private exportService: ExportService,
    private utils: UtilityService,
    private router: Router
  ) {}
  divForm: FormGroup;
  mediumList: any;
  standardList: any;
  mediumId: any;
  standardId: any;
  divisionList: any;

  orderBy: any = 'created_at';
  sort = 'DESC';
  isAscending = false;
  pageLimit = Constants.PAGE_LIMIT;
  currentPage = Constants.STARTING_PAGE;
  find = '';
  totalItems: number;
  studList: any = [];
  divisionId: any;
  studentForm: FormGroup;
  divisionFilterList: any;

  async onSearch() {
    this.utils.showLoading();

    let queryList = `?medium=${this.mediumId}&standard=${this.standardId}&division=${this.divisionId}`;
    const response: any = await this.apiService.getDivisionStudentList(
      queryList
    );
    this.utils.hideLoading();

    if (response.statusCode === 200) {
      this.studList = response.data.studentData;
      this.studList.forEach((element) => {
        element.target_division = null;
        element.transfer_reason = null;
        element.old_division_id = element.division_id;
      });
    }
  }

  formInit() {
    this.divForm = this.formBuilder.group({
      medium_id: [null, Validators.required],
      standard_id: [null, Validators.required],
      division_id: [null, Validators.required],
    });
  }

  get form() {
    return this.divForm.controls;
  }

  async ngOnInit() {
    this.formInit();
    this.getMediumList();
  }

  async getMediumList() {
    let queryList = `?skip_pagination=true&sort=DESC`;
    const response: any = await this.apiService.getMediumList(queryList);
    if (response.statusCode === 200) {
      this.mediumList = response.data.result;
    }
  }
  async getStandardList() {
    let queryList = this.mediumId;
    const response: any = await this.apiService.getStandardListById(queryList);
    if (response.statusCode === 200) {
      this.standardList = response.data.result;
    }
  }
  getMediumId(event) {
    this.studList = [];
    this.divisionId = null;
    this.divForm.controls['standard_id'].setValue(null);
    this.divForm.controls['division_id'].setValue(null);
    this.mediumId = +event;
    this.getStandardList();
  }
  getstandardId(event) {
    this.divisionId = null;
    this.studList = [];
    this.divForm.controls['division_id'].setValue(null);
    this.standardId = +event;
    this.getDivisionData(this.standardId);
  }
  async getDivisionData(id) {
    const response: any = await this.apiService.getDivisionListById(id);
    if (response.statusCode === 200) {
      this.divisionList = response.data.result;
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
  }
  onPageChange = async (page: any) => {
    this.currentPage = page;
  };
  getDivisionId(event) {
    this.divisionId = +event;

    this.divisionFilterList = this.divisionList.filter(
      (ele: any) => ele.id !== this.divisionId
    );
  }
  async submit() {
    this.utils.showLoading();
    let student_data = this.studList.filter(
      (item) => item.target_division != null
    );
    const obj = {
      student_data,
    };

    const response: any = await this.apiService.updateDivisionTransfer(obj);
    this.utils.hideLoading();
    if (response.statusCode === 200) {
      this.utils.showSuccessToast(response.message);
      this.router.navigate(['/admin/student/division-transfer']);
    }
  }
}
