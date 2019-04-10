import { Component, OnInit, OnDestroy } from '@angular/core';
import { Store } from '@ngrx/store';
import { LoadMyJobApplications, OpenResume, ActOnJobApplication } from '../../actions/job-application.actions';
import { getJobApplications } from '../../reducers';
import { Observable } from 'rxjs';
import { JobApplication } from '../../models/JobApplication';
import { JobApplicationActionDescriptor } from '../../components/job-applications-result/job-applications-result.component';
import { getLastApplicationAction } from '../../reducers/job-application.reducer';

@Component({
  selector: 'app-my-job-applications',
  templateUrl: './my-job-applications.component.html',
  styleUrls: ['./my-job-applications.component.css']
})
export class MyJobApplicationsComponent implements OnInit {
  myJobApplications$: Observable<JobApplication[]>;
  lastJobApplicationAction$: Observable<JobApplicationActionDescriptor>;
  
  constructor(private store: Store<any>) { }

  ngOnInit() {
    this.store.dispatch(new LoadMyJobApplications());
    this.myJobApplications$ = this.store.select(getJobApplications);
    this.lastJobApplicationAction$ = this.store.select(getLastApplicationAction);
  }

  onOpenResume(id: string) {
    this.store.dispatch(new OpenResume({id: id}));
  }

  onAction(event: JobApplicationActionDescriptor) {
    this.store.dispatch(new ActOnJobApplication({jobApplicationAction: event}));
  }
}
