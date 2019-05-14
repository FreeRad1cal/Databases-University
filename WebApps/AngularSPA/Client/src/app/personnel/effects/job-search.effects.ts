import { Injectable } from "@angular/core";
import { Actions, ofType, Effect, OnInitEffects } from '@ngrx/effects';
import { Store, Action } from '@ngrx/store';
import { Router } from '@angular/router';
import { switchMap, map, catchError, withLatestFrom, filter, tap, mergeMap } from 'rxjs/operators';
import { of } from 'rxjs';
import { NoOp, SetGlobalBusy, RootActionTypes, Paginate } from 'src/app/actions/actions';
import { Search, PersonnelJobSearchActionTypes, SearchFailed as SearchFailure, Reset } from '../actions/job-search.actions';
import { getLastJobSearchQuery } from '../reducers';
import { HttpErrorResponse } from '@angular/common/http';
import { ROUTER_NAVIGATION, RouterNavigationAction, ROUTER_REQUEST, RouterRequestAction } from '@ngrx/router-store';
import { JobSearchService } from '../services/job-search.service';
import { AddJobPostings, AddJobTitles } from '../actions/personnel-actions';
import { getPagination } from 'src/app/reducers';

@Injectable()
export class JobSearchEffects {
    
    @Effect()
    search$ = this.actions$.pipe(
        ofType<Search>(PersonnelJobSearchActionTypes.Search),
        tap(() => this.store.dispatch(new SetGlobalBusy({value: true}))),
        withLatestFrom(this.store.select(getPagination('job_search'))),
        switchMap(([action, pagination]) => this.personnelService.getJobPostings(action.payload.query.query, pagination, action.payload.query.jobTitles).pipe(
            mergeMap(res => [
                new AddJobPostings({jobPostings: res.items.jobPostings, total: res.total}), 
                new SetGlobalBusy({value: false})]),
            catchError(errors => of(new SearchFailure({errors: errors}), new SetGlobalBusy({value: false})))
        ))
    )

    @Effect() 
    paginate$ = this.actions$.pipe(
        ofType<Paginate>(RootActionTypes.Paginate),
        filter(action => action.payload.key === 'job_search'),
        withLatestFrom(this.store.select(getLastJobSearchQuery)),
        map(([action, lastQuery]) => {
            if (lastQuery) {
                return new Search({query: lastQuery});
            }
        })
    );

    @Effect()
    exitEmployment$ = this.actions$.pipe(
        ofType<RouterRequestAction>(ROUTER_REQUEST),
        filter(action => action.payload.routerState.url.includes('employment') && !action.payload.event.url.includes('employment')),
        map(() => new Reset())
    );

    constructor(
        private actions$: Actions,
        private store: Store<any>,
        private router: Router,
        private personnelService: JobSearchService) {}
}