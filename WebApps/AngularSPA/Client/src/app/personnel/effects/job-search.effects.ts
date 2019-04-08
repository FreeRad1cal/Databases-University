import { Injectable } from "@angular/core";
import { Actions, ofType, Effect, OnInitEffects } from '@ngrx/effects';
import { Store, Action } from '@ngrx/store';
import { Router } from '@angular/router';
import { switchMap, map, catchError, withLatestFrom } from 'rxjs/operators';
import { JobSearchService } from '../services/job-search.service';
import { of } from 'rxjs';
import { NoOp } from 'src/app/actions/actions';
import { Search, PersonnelJobSearchActionTypes, SearchCompleted, SearchFailed } from '../actions/job-search.actions';
import { getPagination } from '../reducers';
import { HttpErrorResponse } from '@angular/common/http';

@Injectable()
export class JobSearchEffects {
    
    @Effect()
    search$ = this.actions$.pipe(
        ofType<Search>(PersonnelJobSearchActionTypes.Search),
        withLatestFrom(this.store.select(getPagination)),
        switchMap(([action, pagination]) => this.jobSearchService.getJobPostings(action.payload.query, pagination, action.payload.jobTitles).pipe(
                map(res => new SearchCompleted({postings: res.body.items, totalPostings: res.body.total})),
                catchError((res: HttpErrorResponse) => {
                    const errors = res.error && res.error.errors ? res.error.errors : ["An error has occured"];
                    return of(new SearchFailed({errors}));
                })
        ))
    )

    constructor(
        private actions$: Actions,
        private store: Store<any>,
        private router: Router,
        private jobSearchService: JobSearchService) {}
}