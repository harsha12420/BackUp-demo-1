import { Component, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NgbModalRef, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ApiService } from 'src/app/services/api.service';
import { UtilityService } from 'src/app/services/utility.service';
import { Menu } from 'src/app/shared/services/nav.service';

@Component({
  selector: 'app-add-leave-seting',
  templateUrl: './add-leave-seting.component.html',
  styleUrls: ['./add-leave-seting.component.scss']
})
export class AddLeaveSetingComponent implements OnInit {
  leaveSetingForm: FormGroup;
  public menuItems!: Menu[];
  public url: any;
  public windowSubscribe$!: any;
  config = {
    backdrop: true,
    ignoreBackdropClick: true,
    class: 'modal-md',
    centered: true,
    modalDialogClass: 'modal-xl',
  };
  userRole;
  leaveSettingRep;
  isSubmitted = false;

  constructor(
    private modalService: NgbModal,
    private formBuilder: FormBuilder,
    private apiService: ApiService,
    private utils: UtilityService
  ) { }

  ngOnInit(): void {
    this.formInit();
  }

  async getLeaveDetails() {
    this.utils.showLoading();
    const response: any = await this.apiService.getLeaveSeting();
    if (response.statusCode === 200) {
      this.leaveSettingRep = response.data;

      this.leaveSetingForm.controls['cl_count'].setValue(
        this.leaveSettingRep.cl_count
      );
      this.leaveSetingForm.controls['pl_count'].setValue(
        this.leaveSettingRep.pl_count
      );

      this.leaveSetingForm.controls['lwp_count'].setValue(
        this.leaveSettingRep.lwp_count
      );
    }
    this.utils.hideLoading();
  }
  formInit() {
    this.leaveSetingForm = this.formBuilder.group({
      cl_count: ['', Validators.required],
      pl_count: ['', Validators.required],
      lwp_count: ['', Validators.required],
    });
    this.getLeaveDetails()
  }
  get form() {
    return this.leaveSetingForm.controls;
  }
  async onSubmit() {
    try {
      this.isSubmitted = true;
      if (this.leaveSetingForm.invalid) {
        return;
      }
      this.utils.showLoading();

      const obj = {
        id: this.leaveSettingRep.id,
        cl_count: Number(this.leaveSetingForm.controls['cl_count'].value),
        pl_count: Number(this.leaveSetingForm.controls['pl_count'].value),
        lwp_count: Number(this.leaveSetingForm.controls['lwp_count'].value),
      };
      const response: any = await this.apiService.addLeaveSeting(obj);
      this.utils.hideLoading();
      if (response.statusCode === 200) {
        this.utils.showSuccessToast(response.message);
        this.isSubmitted = false;

      }
    } catch (error) {
      this.utils.hideLoading();
    }
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
}
