import { NgModule, ModuleWithProviders } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LoginPageComponent } from './containers/login-page/login-page.component';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { StoreModule } from '@ngrx/store';
import { reducers } from './reducers';
import { EffectsModule } from '@ngrx/effects';
import { AuthEffects } from './effects/auth.effects';
import { HTTP_INTERCEPTORS, HttpClientModule } from '@angular/common/http';
import { JwtInterceptorService } from './services/jwt-interceptor.service';
import { AuthErrorResponseInterceptorService } from './services/auth-error-response-interceptor.service';
import { JwtPersisterService } from './services/jwt-persister.service';
import { LoginFormComponent } from './components/login-form/login-form.component';
import { AuthRoutingModule } from './auth-routing.module';
import { AuthService } from './services/auth.service';
import { RegistrationFormComponent } from './components/registration-form/registration-form.component';
import { RegistrationPageComponent } from './containers/registration-page/registration-page.component';
import { SharedModule } from '../shared/shared.module';
import { PrimengModule } from '../primeng/primeng.module';
import { AddressComponent } from './components/address/address.component';

@NgModule({
  declarations: [LoginPageComponent, LoginFormComponent, RegistrationPageComponent, RegistrationFormComponent, AddressComponent],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    FormsModule,
    PrimengModule,
    AuthRoutingModule,
    StoreModule.forFeature('auth', reducers),
    EffectsModule.forFeature([AuthEffects]),
    SharedModule,
    FormsModule
  ]
})
export class AuthModule { 
  public static forRoot(): ModuleWithProviders {
    return {
      ngModule: AuthModule, 
      providers: [
        JwtPersisterService,
        AuthService,
        {
          provide: HTTP_INTERCEPTORS,
          useClass: JwtInterceptorService,
          multi: true
        },
        {
          provide: HTTP_INTERCEPTORS,
          useClass: AuthErrorResponseInterceptorService,
          multi: true
        }
      ]
    };
  }
}
