import { Component, OnInit, OnDestroy } from '@angular/core';
import { Store, select } from '@ngrx/store';
import { LoadMyJobApplications, OpenResume, SubmitJobApplicationAction } from '../../actions/job-application.actions';
import { getJobApplications, getJobPostings } from '../../reducers';
import { Observable } from 'rxjs';
import { JobApplication } from '../../models/JobApplication';
import { getLastApplicationAction, JobApplicationActionDescriptor } from '../../reducers/job-application.reducer';
import { map, withLatestFrom, concatMap, filter } from 'rxjs/operators';
import { getSignedInUser } from 'src/app/auth/reducers';
import { JobPosting } from '../../models/JobPosting';

@Component({
  selector: 'app-my-job-applications',
  templateUrl: './my-job-applications.component.html',
  styleUrls: ['./my-job-applications.component.css']
})
export class MyJobApplicationsComponent implements OnInit {
  myJobApplications$: Observable<JobApplication[]>;
  myJobPostings$: Observable<JobPosting[]>;
  
  constructor(private store: Store<any>) { }

  ngOnInit() {
    this.store.dispatch(new LoadMyJobApplications());
    this.myJobApplications$ = this.store.pipe(
      select(getJobApplications),
      withLatestFrom(this.store.pipe(
        select(getSignedInUser),
        map(user => user.id)
      )),
      map(([jobApplications, id]) => jobApplications.filter(appl => appl.applicantId == id)),
    );
    this.myJobPostings$ = this.myJobApplications$.pipe(
      concatMap(appls => this.store.pipe(
        select(getJobPostings),
        //map(postings => postings.filter(posting => appls.map(appl => appl.jobPosting).includes(posting.id)))
      ))
    );
  }

  onOpenResume(id: string) {
    this.store.dispatch(new OpenResume({id: id}));
  }

  onAction(action: JobApplicationActionDescriptor) {
    this.store.dispatch(new SubmitJobApplicationAction({jobApplicationAction: action}));
  }
}
