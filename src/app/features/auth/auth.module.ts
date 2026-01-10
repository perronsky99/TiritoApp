import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ReactiveFormsModule } from '@angular/forms';
import { SharedModule } from '../../shared/shared.module';

import { LoginComponent } from './login/login.component';
import { RegisterStepperComponent } from './register/register-stepper.component';

const routes: Routes = [
  { path: '', component: LoginComponent },
  { path: 'register', component: RegisterStepperComponent }
];

@NgModule({
  declarations: [
    LoginComponent,
    RegisterStepperComponent
  ],
  imports: [
    SharedModule,
    ReactiveFormsModule,
    RouterModule.forChild(routes)
  ]
})
export class AuthModule { }
