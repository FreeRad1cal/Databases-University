import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { switchMap, map } from 'rxjs/operators';
import { Store, select } from '@ngrx/store';
import { getJobPostingById, getJobApplicationErrors } from '../../reducers';
import { Observable } from 'rxjs';
import { JobPosting } from '../../models/JobPosting';
import { getSignedInUser } from 'src/app/auth/reducers';
import { JobApplication } from '../../models/JobApplication';
import { SubmitJobApplication } from '../../actions/job-application.actions';

@Component({
  selector: 'app-job-application-page',
  templateUrl: './job-application-page.component.html',
  styleUrls: ['./job-application-page.component.css'],
  host: {
    class: 'flex-grow-1'
  }
})
export class JobApplicationPageComponent implements OnInit {
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

  onSubmit($event: any) {
    let jobPostingId = $event.jobPostingId;
    let resume = $event.resume;
    this.store.dispatch(new SubmitJobApplication({jobPostingId, resume}));
  }

}
