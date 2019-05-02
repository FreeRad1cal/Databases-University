import { Component, OnInit, OnDestroy } from '@angular/core';
import { Store, select } from '@ngrx/store';
import { Paginate, Search } from '../../actions/job-search.actions';
import { getJobTiles, getJobPostings, getJobSearchPagination, getTotalJobPostings, getJobSearchErrors, getLastJobSearchQuery } from '../../reducers';
import { JobTitle } from '../../models/JobTitle';
import { Observable, of, Subject, combineLatest } from 'rxjs';
import { JobPosting } from '../../models/JobPosting';
import { Pagination } from '../../models/Pagination';
import { map, concat, take, tap, catchError, withLatestFrom } from 'rxjs/operators';
import { JobSearchService } from '../../services/job-search.service';
import { AddJobTitles } from '../../actions/personnel-actions';
import { Router } from '@angular/router';
import * as _ from 'lodash';
import { JobSearchQuery } from '../../models/JobSearchQuery';

@Component({
  selector: 'app-job-search-page',
  templateUrl: './job-search-page.component.html',
  styleUrls: ['./job-search-page.component.css'],
  host: {
    class: 'flex-grow-1'
  }
})
export class JobSearchPageComponent implements OnInit {
  jobTitles$: Observable<JobTitle[]>;
  jobPostings$: Observable<JobPosting[]>;
  pagination$: Observable<Pagination>;
  totalJobPostings$: Observable<number>;
  errors$: Observable<string[]>;
  lastSearchQuery$: Observable<JobSearchQuery>;

  constructor(private store: Store<any>, private router: Router) {}

  ngOnInit() {
    this.jobTitles$ = this.store.pipe(
      select(getJobTiles)
    );

    this.pagination$ = this.store.pipe(
      select(getJobSearchPagination)
    );

    this.lastSearchQuery$ = this.store.pipe(
      select(getLastJobSearchQuery)
    );
    
    this.jobPostings$ = combineLatest(this.store.select(getJobPostings), this.pagination$, this.lastSearchQuery$).pipe(
      map(([jobPostings, pagination, lastQuery]) => _(jobPostings)
        .filter(jobPosting => {
          const queryMatch = jobPosting.description.includes(lastQuery.query);
          const jobTitleMatch = lastQuery.jobTitles.length > 1 ? lastQuery.jobTitles.includes(jobPosting.jobTitle) : true;
          return queryMatch && jobTitleMatch;
        })
        .drop(pagination.offset)
        .take(pagination.limit)
        .value())
    );

    this.totalJobPostings$ = this.store.pipe(
      select(getTotalJobPostings)
    );
    
    this.errors$ = this.store.pipe(
      select(getJobSearchErrors)
    );
  }

  onSearch(query: JobSearchQuery) {
    this.store.dispatch(new Search({query: query}));
  }

  paginate(event: any) {
    const pagination = {
      limit: event.rows,
      offset: event.first
    };
    this.store.dispatch(new Paginate({pagination: pagination}));
  }
}
