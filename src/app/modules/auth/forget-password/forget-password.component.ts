import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { Constants, ROUTE_PATH } from 'src/app/Constants/constants';
import { AuthService } from 'src/app/services/auth/auth.service';
import { UtilityService } from 'src/app/services/utility.service';

@Component({
  selector: 'app-forget-password',
  templateUrl: './forget-password.component.html',
  styleUrls: ['./forget-password.component.scss'],
})
export class ForgetPasswordComponent {
  passwordResetForm: FormGroup;
  constructor(
    private fb: FormBuilder,
    private utlity: UtilityService,
    private router: Router,
    private authService: AuthService
  ) {}

  ngOnInit() {
    this.passwordResetForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      user_type: [Constants.USER_ROLE],
    });
  }
  async submitForm() {
    this.utlity.showLoading();
    const forgetEmail: any = this.passwordResetForm.value;
    const rep: any = await this.authService.forgotPassword(forgetEmail);
    if (rep.statusCode == 200) {
      this.utlity.showSuccessToast(rep.message);
      this.utlity.forgetEmail.next(forgetEmail);
      this.router.navigate([ROUTE_PATH.AUTH,ROUTE_PATH.VERIFY_EMAIL_ADDRESS]);
    }
    this.utlity.hideLoading();
  }

  removeSpace(event: any) {
    if (event.target.value.trim() === '') {
      event.target.value = '';
    }
  }
  navigateTologin() {
    this.router.navigate([ROUTE_PATH.AUTH, ROUTE_PATH.LOGIN]);
  }
}
