import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PersonnelRoutingModule } from './personnel-routing.module';
import { SharedModule } from '../shared/shared.module';
import { PrimengModule } from '../primeng/primeng.module';
import { StoreModule } from '@ngrx/store';
import { EffectsModule } from '@ngrx/effects';
import { reducers } from './reducers';
import { JobSearchEffects } from './effects/job-search.effects';
import { PersonnelEffects } from './effects/personnel.effects';
import { JobSearchService } from './services/job-search.service';
import { JobSearchFormComponent } from './components/job-search-form/job-search-form.component';
import { JobSearchResultComponent } from './components/job-search-result/job-search-result.component';
import { JobSearchPageComponent } from './containers/job-search-page/job-search-page.component';
import { JobPostingComponent } from './containers/job-posting/job-posting.component';
import { JobApplicationPageComponent } from './containers/job-application-page/job-application-page.component';
import { JobApplicationFormComponent } from './components/job-application-form/job-application-form.component';
import { JobApplicationEffects } from './effects/job-application.effects';
import { JobApplicationConfirmationComponent } from './containers/job-application-confirmation/job-application-confirmation.component';
import { MyJobApplicationsComponent } from './containers/my-job-applications/my-job-applications.component';
import { JobApplicationsResultComponent } from './components/job-applications-result/job-applications-result.component';
import { JobApplicationService } from './services/job-application.service';

@NgModule({
  declarations: [JobSearchPageComponent, JobSearchFormComponent, JobSearchResultComponent, JobPostingComponent, JobApplicationPageComponent, JobApplicationFormComponent, JobApplicationConfirmationComponent, MyJobApplicationsComponent, JobApplicationsResultComponent],
  entryComponents: [JobSearchPageComponent],
  providers: [JobSearchService, JobApplicationService],
  imports: [
    CommonModule,
    PersonnelRoutingModule,
    SharedModule,
    PrimengModule,
    StoreModule.forFeature('personnel', reducers),
    EffectsModule.forFeature([PersonnelEffects, JobSearchEffects, JobApplicationEffects]),
  ]
})
export class PersonnelModule { }
