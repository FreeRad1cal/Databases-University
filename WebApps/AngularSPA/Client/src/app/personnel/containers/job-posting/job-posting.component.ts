import { Component, OnInit } from '@angular/core';
import { Store, select } from '@ngrx/store';
import { Router, ActivatedRoute } from '@angular/router';
import { getJobPostingById } from '../../reducers';
import { switchMap, withLatestFrom, tap } from 'rxjs/operators';
import { Observable } from 'rxjs';
import { JobPosting } from '../../models/JobPosting';
import { Location } from '@angular/common';
import { LoadJobPostingById } from '../../actions/job-search.actions';

@Component({
  selector: 'app-job-posting',
  templateUrl: './job-posting.component.html',
  styleUrls: ['./job-posting.component.css'],
  host: {
    class: 'flex-grow-1'
  }
})
export class JobPostingComponent implements OnInit {
  jobPosting$: Observable<JobPosting>;
  id: string;
  constructor(private store: Store<any>, private route: ActivatedRoute, private router: Router, private location: Location) { }

  ngOnInit() {
    this.jobPosting$ = this.route.paramMap.pipe(
      switchMap(params => {
        this.id = params.get('id');
        return this.id;
      }),
      tap(id => this.store.dispatch(new LoadJobPostingById({id: id}))),
      switchMap(id => this.store.select(getJobPostingById(id)))
    );
  }

  onReturn() {
    this.location.back();
  }

  onApply() {
    this.router.navigate(['personnel', 'job-search', 'apply', this.id])
  }
}
