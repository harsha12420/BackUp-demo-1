import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LoginComponent } from './login/login.component';
import { VerifyEmailComponent } from './verify-email/verify-email.component';
import { ForgetPasswordComponent } from './forget-password/forget-password.component';
import { ROUTE_PATH } from 'src/app/Constants/constants';
import { AuthComponent } from './auth.component';
import { ResetPasswordComponent } from './reset-password/reset-password.component';

const routes: Routes = [
  {
    path: ROUTE_PATH.ABSOLUTE,
    component: AuthComponent,
    children: [
      {
        path: ROUTE_PATH.ABSOLUTE,
        redirectTo: ROUTE_PATH.LOGIN,
        pathMatch: 'full',
      },
      {
        path: ROUTE_PATH.LOGIN,
        component: LoginComponent,
      },
      { path: ROUTE_PATH.FORGOT_PASSWORD, component: ForgetPasswordComponent },
      {
        path: ROUTE_PATH.VERIFY_EMAIL_ADDRESS,
        component: VerifyEmailComponent,
      },
      { path: ROUTE_PATH.RESET_PASSWORD, component: ResetPasswordComponent },
     
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class AuthRoutingModule {}
