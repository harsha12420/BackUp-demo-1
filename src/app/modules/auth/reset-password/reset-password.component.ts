import { Component, OnInit } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  Validators,
  ValidatorFn,
  AbstractControl,
} from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ROUTE_PATH } from 'src/app/Constants/constants';
import { AuthService } from 'src/app/services/auth/auth.service';
import { UtilityService } from 'src/app/services/utility.service';

@Component({
  selector: 'app-reset-password',
  templateUrl: './reset-password.component.html',
  styleUrls: ['./reset-password.component.scss'],
})
export class ResetPasswordComponent {
  resetPasswordForm: FormGroup;
  tokenId: any;
  userRole: string;
  showNewPassword = false;
  showConfirmPassword = false;
  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private UtilityService: UtilityService,
    private router: Router,
    private route: ActivatedRoute
  ) {
    this.tokenId = this.route.snapshot.params['id'];
  }

  async ngOnInit(): Promise<void> {
    this.UtilityService.showLoading();

    this.resetPasswordForm = this.fb.group(
      {
        newPassword: ['', [Validators.required, Validators.minLength(8)]],
        confirmPassword: ['', [Validators.required]],
      },
      { validators: this.passwordMatchValidator }
    );
    const reset_token = {
      reset_token: this.tokenId,
    };

    try {
      const verifyToken: any = await this.authService.verifyResetToken(
        reset_token
      );
      this.UtilityService.hideLoading();
    } catch (error) {
      this.UtilityService.hideLoading();
      this.router.navigate([ROUTE_PATH.AUTH, ROUTE_PATH.LOGIN]);
    }
  }

  async submitResetPasswordForm(): Promise<void> {
    if (this.resetPasswordForm.valid) {
      this.UtilityService.showLoading();

      const obj = {
        password: this.resetPasswordForm.controls['newPassword'].value,
        reset_token: this.tokenId,
      };
      const resetPassword: any = await this.authService.resetPassword(obj);
      if (resetPassword.statusCode == 200) {
        this.UtilityService.showSuccessToast(resetPassword.message);
        this.router.navigate([ROUTE_PATH.AUTH, ROUTE_PATH.LOGIN]);
      }
      this.UtilityService.hideLoading();
    }
  }

  passwordMatchValidator: ValidatorFn = (control: AbstractControl) => {
    const newPassword = control.get('newPassword')?.value;
    const confirmPassword = control.get('confirmPassword')?.value;

    if (newPassword !== confirmPassword) {
      control.get('confirmPassword')?.setErrors({ passwordMismatch: true });
      return { passwordMismatch: true };
    } else {
      control.get('confirmPassword')?.setErrors(null);
      return null;
    }
  };

  toggleNewPasswordVisibility() {
    this.showNewPassword = !this.showNewPassword;
  }
  toggleConfirmPasswordVisibility() {
    this.showConfirmPassword = !this.showConfirmPassword;
  }
}
