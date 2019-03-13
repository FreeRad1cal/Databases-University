import { NgModule, ModuleWithProviders } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LoginPageComponent } from './containers/login-page/login-page.component';
import { ReactiveFormsModule } from '@angular/forms';
import { StoreModule } from '@ngrx/store';
import { reducers } from './reducers';
import { EffectsModule } from '@ngrx/effects';
import { AuthEffects } from './effects/auth.effects';
import { HTTP_INTERCEPTORS } from '@angular/common/http';
import { AccessTokenInterceptorService } from './services/access-token-interceptor.service';
import { AuthorizationErrorResponseInterceptorService } from './services/authorization-error-response-interceptor.service';
import { TokenPersisterService } from './services/token-persister.service';

@NgModule({
  declarations: [LoginPageComponent],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    StoreModule.forFeature('auth', reducers),
    EffectsModule.forFeature([AuthEffects]),
  ]
})
export class AuthModule { 
  public static forRoot(): ModuleWithProviders {
    return {
      ngModule: AuthModule, 
      providers: [
        TokenPersisterService,
        {
          provide: HTTP_INTERCEPTORS,
          useClass: AccessTokenInterceptorService,
          multi: true
        },
        {
          provide: HTTP_INTERCEPTORS,
          useClass: AuthorizationErrorResponseInterceptorService,
          multi: true
        }
      ]
    };
  }
}
