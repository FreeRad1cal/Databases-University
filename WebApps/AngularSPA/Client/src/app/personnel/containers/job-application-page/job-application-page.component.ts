import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { switchMap, map } from 'rxjs/operators';
import { Store, select } from '@ngrx/store';
import { getJobPostingById, getJobApplicationErrors } from '../../reducers';
import { Observable } from 'rxjs';
import { JobPosting } from '../../models/JobPosting';
import { getSignedInUser } from 'src/app/auth/reducers';
import { JobApplication } from '../../models/JobApplication';
import { SubmitJobApplication, ResetJobApplication } from '../../actions/job-application.actions';

@Component({
  selector: 'app-job-application-page',
  templateUrl: './job-application-page.component.html',
  styleUrls: ['./job-application-page.component.css'],
  host: {
    class: 'flex-grow-1'
  }
})
export class JobApplicationPageComponent implements OnInit, OnDestroy {
  jobPosting$: Observable<JobPosting>;
  errors$: Observable<string[]>;
  postingId: string;

  constructor(private route: ActivatedRoute, private store: Store<any>) { }

  ngOnInit() {
    this.postingId = this.route.snapshot.paramMap.get('id');
    this.jobPosting$ = this.store.select(getJobPostingById(this.postingId));
    this.errors$ = this.store.pipe(
      select(getJobApplicationErrors)
    )
  }

  ngOnDestroy() {
    this.store.dispatch(new ResetJobApplication());
  }

  onSubmit(application: JobApplication) {
    this.store.dispatch(new SubmitJobApplication({application: application}));
  }

}
