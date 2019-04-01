import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AcademicsRoutingModule } from './academics-routing.module';
import { SharedModule } from '../shared/shared.module';
import { PrimengModule } from '../primeng/primeng.module';
import { StoreModule } from '@ngrx/store';
import { EffectsModule } from '@ngrx/effects';
import { reducers } from './reducers';
import { ApplicationEffects } from './effects/application.effects';
import { ApplyPageComponent } from './containers/apply-page/apply-page.component';
import { ApplyFormComponent } from './components/apply-form/apply-form.component';

@NgModule({
  declarations: [ApplyPageComponent, ApplyFormComponent],
  entryComponents: [ApplyPageComponent],
  imports: [
    CommonModule,
    AcademicsRoutingModule,
    SharedModule,
    PrimengModule,
    StoreModule.forFeature('academics', reducers),
    EffectsModule.forFeature([ApplicationEffects]),
  ]
})
export class AcademicsModule { }
