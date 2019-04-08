import { Component, OnInit } from '@angular/core';
import { Store, select } from '@ngrx/store';
import { Router, ActivatedRoute } from '@angular/router';
import { getJobPostingById } from '../../reducers';
import { switchMap, withLatestFrom } from 'rxjs/operators';
import { Observable } from 'rxjs';
import { JobPosting } from '../../models/JobPosting';

@Component({
  selector: 'app-job-posting',
  templateUrl: './job-posting.component.html',
  styleUrls: ['./job-posting.component.css'],
  host: {
    class: 'd-flex flex-grow-1'
  }
})
export class JobPostingComponent implements OnInit {
  jobPosting$: Observable<JobPosting>;
  id: string;
  constructor(private store: Store<any>, private route: ActivatedRoute, private router: Router) { }

  ngOnInit() {
    this.jobPosting$ = this.route.paramMap.pipe(
      switchMap(params => {
        this.id = params.get('id');
        return this.id;
      }),
      switchMap(id => this.store.select(getJobPostingById(id)))
    );
  }

  onReturn() {
    this.router.navigate(['job-search']);
  }

  onApply() {
    this.router.navigate(['job-search', 'apply', this.id])
  }
}
