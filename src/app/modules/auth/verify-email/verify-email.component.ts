import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { ROUTE_PATH } from 'src/app/Constants/constants';
import { AuthService } from 'src/app/services/auth/auth.service';
import { UtilityService } from 'src/app/services/utility.service';

@Component({
  selector: 'app-verify-email',
  templateUrl: './verify-email.component.html',
  styleUrls: ['./verify-email.component.scss'],
})
export class VerifyEmailComponent {
  email: any;
  countdown: number = 10;
  resendDisabled: boolean = false;

  constructor(
    public utilityService: UtilityService,
    private router: Router,
    private authService: AuthService
  ) {}

  ngOnInit() {
    this.utilityService.forgetEmail.subscribe((details) => {
      if (details) {
        this.email = details;
      } else {
        this.router.navigate([ROUTE_PATH.AUTH, ROUTE_PATH.FORGOT_PASSWORD]);
      }
    });

    this.startCountdown();
  }
  navigateToforgot() {
    this.router.navigate([ROUTE_PATH.AUTH, ROUTE_PATH.FORGOT_PASSWORD]);
  }
  navigateToLogin() {
    this.router.navigate([ROUTE_PATH.AUTH, ROUTE_PATH.LOGIN]);
  }
  startCountdown(): void {
    this.resendDisabled = true;

    const timer = setInterval(() => {
      if (this.countdown > 0) {
        this.countdown--;
      } else {
        this.resendDisabled = false;
        clearInterval(timer);
      }
    }, 1000);
  }

  async resendVerificationEmail(): Promise<void> {
    this.utilityService.showLoading();

    const rep: any = await this.authService.forgotPassword(this.email);
    if (rep.statusCode == 200) {
      this.utilityService.showSuccessToast(rep.message);
      this.utilityService.hideLoading();
    }

    this.countdown = 10;
    this.startCountdown();
  }
}
