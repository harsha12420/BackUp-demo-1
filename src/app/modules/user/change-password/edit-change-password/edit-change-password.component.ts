import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { REDIRECT_ROUTE_PATH, ROUTE_PATH } from 'src/app/Constants/constants';
import { AuthService } from 'src/app/services/auth/auth.service';
import { UtilityService } from 'src/app/services/utility.service';
@Component({
  selector: 'app-edit-change-password',
  templateUrl: './edit-change-password.component.html',
  styleUrls: ['./edit-change-password.component.scss'],
})
export class EditChangePasswordComponent implements OnInit {
  changePasswordForm: FormGroup;
  isSubmitted = false;
  showOldPassword = false;
  showNewPassword = false;
  showConfirmPassword = false;

  constructor(
    private formBuilder: FormBuilder,
    private utlity: UtilityService,
    private router: Router,
    private authService: AuthService
  ) { }

  ngOnInit() {
    this.changePasswordForm = this.formBuilder.group(
      {
        oldPassword: ['', Validators.required],
        newPassword: ['', [Validators.required, Validators.minLength(8)]],
        confirmPassword: ['', Validators.required],
      },
      {
        validators: this.passwordMatchValidator,
      }
    );
  }

  async onSubmit() {
    this.isSubmitted = true;

    if (this.changePasswordForm.invalid) {
      return;
    }
    this.utlity.showLoading();
    const changePassword: any = {
      old_password: this.changePasswordForm.controls['oldPassword'].value,
      password: this.changePasswordForm.controls['newPassword'].value,
    };
    const rep: any = await this.authService.changePassword(changePassword);
    if (rep.statusCode == 200) {
      this.utlity.showSuccessToast(rep.message);
      this.router.navigate([REDIRECT_ROUTE_PATH.DASHBOARD]);
    } else {
      this.utlity.showErrorToast(rep.message);
    }
    this.utlity.hideLoading();
  }

  passwordMatchValidator(form: FormGroup) {
    const newPassword = form.get('newPassword')!.value;
    const confirmPassword = form.get('confirmPassword')!.value;

    if (newPassword !== confirmPassword) {
      form.get('confirmPassword')!.setErrors({ mismatch: true });
    } else {
      form.get('confirmPassword')!.setErrors(null);
    }
  }

  get form() {
    return this.changePasswordForm.controls;
  }
  oldPasswordVisibility() {
    this.showOldPassword = !this.showOldPassword;
  }
  newPasswordVisibility() {
    this.showNewPassword = !this.showNewPassword;
  }
  confirmPasswordVisibility() {
    this.showConfirmPassword = !this.showConfirmPassword;
  }
}
