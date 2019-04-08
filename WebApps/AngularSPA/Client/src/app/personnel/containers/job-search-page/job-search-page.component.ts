import { Component, OnInit } from '@angular/core';
import { Store, select } from '@ngrx/store';
import { SetPagination, Search, ResetJobSearch } from '../../actions/job-search.actions';
import { getJobTiles, getJobPostings, getPagination, getTotalJobPostings, getErrors, getHasSearched } from '../../reducers';
import { JobTitle } from '../../models/JobTitle';
import { Observable, of } from 'rxjs';
import { JobPosting } from '../../models/JobPosting';
import { Pagination } from '../../models/Pagination';
import { map, concat } from 'rxjs/operators';

export interface JobSearchQuery {
  query: string,
  jobTitles: JobTitle[]
};

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
  hasSearched$: Observable<boolean>;

  constructor(private store: Store<any>) { }

  ngOnInit() {
    this.jobTitles$ = this.store.pipe(
      select(getJobTiles)
    );
    this.jobPostings$ = this.store.pipe(select(getJobPostings));
    this.pagination$ = this.store.pipe(
      select(getPagination)
    );
    this.totalJobPostings$ = this.store.pipe(
      select(getTotalJobPostings)
    );
    this.errors$ = this.store.pipe(
      select(getErrors)
    )
    this.hasSearched$ = this.store.select(getHasSearched);
  }

  private lastQuery: JobSearchQuery;
  onSearch(event: JobSearchQuery) {
    this.lastQuery = event;
    this.store.dispatch(new Search({query: event.query, jobTitles: event.jobTitles}));
  }

  paginate(event: any) {
    const pagination = {
      limit: event.rows,
      offset: event.first
    };
    this.store.dispatch(new SetPagination({pagination: pagination}));
    this.onSearch(this.lastQuery);
  }
}
