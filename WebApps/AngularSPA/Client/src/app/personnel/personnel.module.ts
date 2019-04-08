import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PersonnelRoutingModule } from './personnel-routing.module';
import { SharedModule } from '../shared/shared.module';
import { PrimengModule } from '../primeng/primeng.module';
import { StoreModule } from '@ngrx/store';
import { EffectsModule } from '@ngrx/effects';
import { reducers } from './reducers';
import { JobSearchEffects } from './effects/job-search.effects';
import { JobSearchService } from './services/job-search.service';
import { PersonnelEffects } from './effects/personnel.effects';
import { PersonnelService } from './services/personnel.service';
import { JobSearchFormComponent } from './components/job-search-form/job-search-form.component';
import { JobSearchResultComponent } from './components/job-search-result/job-search-result.component';
import { JobSearchPageComponent } from './containers/job-search-page/job-search-page.component';
import { JobPostingComponent } from './containers/job-posting/job-posting.component';
import { JobApplicationPageComponent } from './containers/job-application-page/job-application-page.component';
import { JobApplicationFormComponent } from './components/job-application-form/job-application-form.component';

@NgModule({
  declarations: [JobSearchPageComponent, JobSearchFormComponent, JobSearchResultComponent, JobPostingComponent, JobApplicationPageComponent, JobApplicationFormComponent],
  entryComponents: [JobSearchPageComponent],
  providers: [JobSearchService, PersonnelService],
  imports: [
    CommonModule,
    PersonnelRoutingModule,
    SharedModule,
    PrimengModule,
    StoreModule.forFeature('personnel', reducers),
    EffectsModule.forFeature([PersonnelEffects, JobSearchEffects]),
  ]
})
export class PersonnelModule { }
