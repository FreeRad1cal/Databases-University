import { Routes, RouterModule } from '@angular/router';
import { NgModule } from '@angular/core';
import { LoginPageComponent } from './containers/login-page/login-page.component';

const authRoutes: Routes = [
    { path: 'login', component: LoginPageComponent }
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