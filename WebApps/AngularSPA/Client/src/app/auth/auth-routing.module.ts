import { Routes, RouterModule } from '@angular/router';
import { NgModule } from '@angular/core';
import { LoginPageComponent } from './containers/login-page/login-page.component';
import { RegistrationPageComponent } from './containers/registration-page/registration-page.component';

const authRoutes: Routes = [
    { path: 'login', component: LoginPageComponent },
    { path: 'register', component: RegistrationPageComponent }
  ];
  
  @NgModule({
    imports: [
      RouterModule.forChild(authRoutes)
    ],
    exports: [
      RouterModule
    ]
  })
  export class AuthRoutingModule {}