import { Component, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';
import { LoadMyJobApplications, OpenResume } from '../../actions/job-application.actions';
import { getJobApplications } from '../../reducers';
import { Observable } from 'rxjs';
import { JobApplication } from '../../models/JobApplication';

@Component({
  selector: 'app-my-job-applications',
  templateUrl: './my-job-applications.component.html',
  styleUrls: ['./my-job-applications.component.css']
})
export class MyJobApplicationsComponent implements OnInit {
  myJobApplications$: Observable<JobApplication[]>;
  
  constructor(private store: Store<any>) { }

  ngOnInit() {
    this.store.dispatch(new LoadMyJobApplications());
    this.myJobApplications$ = this.store.select(getJobApplications);
  }

  onOpenResume(id: string) {
    this.store.dispatch(new OpenResume({id: id}));
  }
}
