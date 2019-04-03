import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AcademicsRoutingModule } from './academics-routing.module';
import { SharedModule } from '../shared/shared.module';
import { PrimengModule } from '../primeng/primeng.module';
import { StoreModule } from '@ngrx/store';
import { EffectsModule } from '@ngrx/effects';
import { reducers } from './reducers';
import { ApplicationEffects } from './effects/application.effects';
import { ApplicationPageComponent } from './containers/application-page/application-page.component';
import { ApplicationFormComponent } from './components/application-form/application-form.component';
import { ApplicationService } from './services/application.service';
import { AcademicsEffects } from './effects/academics.effects';
import { AcademicsService } from './services/academics.service';

@NgModule({
  declarations: [ApplicationPageComponent, ApplicationFormComponent],
  entryComponents: [ApplicationPageComponent],
  providers: [ApplicationService, AcademicsService],
  imports: [
    CommonModule,
    AcademicsRoutingModule,
    SharedModule,
    PrimengModule,
    StoreModule.forFeature('academics', reducers),
    EffectsModule.forFeature([ApplicationEffects, AcademicsEffects]),
  ]
})
export class AcademicsModule { }
