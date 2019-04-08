import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { switchMap, map } from 'rxjs/operators';
import { Store, select } from '@ngrx/store';
import { getJobPostingById } from '../../reducers';
import { Observable } from 'rxjs';
import { JobPosting } from '../../models/JobPosting';
import { getSignedInUser } from 'src/app/auth/reducers';

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
  personId$: Observable<string>;

  constructor(private route: ActivatedRoute, private store: Store<any>) { }

  ngOnInit() {
    this.jobPosting$ = this.route.paramMap.pipe(
      switchMap(params => params.get('id')),
      switchMap(id => this.store.select(getJobPostingById(id)))
    );
    this.personId$ = this.store.pipe(
      select(getSignedInUser),
      map(person => person.id)
    );
  }

  onSubmit() {
    
  }

}
