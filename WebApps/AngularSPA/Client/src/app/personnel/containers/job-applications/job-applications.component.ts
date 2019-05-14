import { Component, OnInit } from '@angular/core';
import { Store, select } from '@ngrx/store';
import { LoadJobApplications, OpenResume, SubmitJobApplicationAction, LoadMyJobApplications } from '../../actions/job-application.actions';
import { getJobApplications, getJobPostings } from '../../reducers';
import { Observable } from 'rxjs';
import { JobApplication } from '../../models/JobApplication';
import { concatMap } from 'rxjs/operators';
import { JobPosting } from '../../models/JobPosting';
import { JobApplicationActionDescriptor } from '../../reducers/job-application.reducer';

@Component({
  selector: 'app-job-applications',
  templateUrl: './job-applications.component.html',
  styleUrls: ['./job-applications.component.css']
})
export class JobApplicationsComponent implements OnInit {
  jobApplications$: Observable<JobApplication[]>;
  jobPostings$: Observable<JobPosting[]>;

  constructor(private store: Store<any>) { }

  ngOnInit() {
    this.store.dispatch(new LoadMyJobApplications());
    this.jobApplications$ = this.store.pipe(
      select(getJobApplications),
    );
    this.jobPostings$ = this.store.pipe(
      select(getJobPostings)
    );
  }

  onOpenResume(id: string) {
    this.store.dispatch(new OpenResume({id: id}));
  }

  onAction(action: JobApplicationActionDescriptor) {
    this.store.dispatch(new SubmitJobApplicationAction({jobApplicationAction: action}));
  }
}
