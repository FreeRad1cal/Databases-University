import { Injectable } from "@angular/core";
import { Actions, ofType, Effect, OnInitEffects } from '@ngrx/effects';
import { Store, Action } from '@ngrx/store';
import { Router } from '@angular/router';
import { switchMap, map, catchError, withLatestFrom, filter, tap, mergeMap } from 'rxjs/operators';
import { of } from 'rxjs';
import { NoOp, SetGlobalBusy } from 'src/app/actions/actions';
import { Search, PersonnelJobSearchActionTypes, SearchCompleted, SearchFailed, ResetJobSearch, LoadJobPostingById } from '../actions/job-search.actions';
import { getPagination } from '../reducers';
import { HttpErrorResponse } from '@angular/common/http';
import { ROUTER_NAVIGATION, RouterNavigationAction, ROUTER_REQUEST, RouterRequestAction } from '@ngrx/router-store';
import { PersonnelService } from '../services/personnel.service';

@Injectable()
export class JobSearchEffects {
    
    @Effect()
    search$ = this.actions$.pipe(
        ofType<Search>(PersonnelJobSearchActionTypes.Search),
        tap(() => this.store.dispatch(new SetGlobalBusy({value: true}))),
        withLatestFrom(this.store.select(getPagination)),
        switchMap(([action, pagination]) => this.personnelService.getJobPostings(action.payload.query, pagination, action.payload.jobTitles).pipe(
                mergeMap(res => [new SearchCompleted({postings: res.body.items, totalPostings: res.body.total}), new SetGlobalBusy({value: false})]),
                catchError((res: HttpErrorResponse) => {
                    const errors = res.error && res.error.errors ? res.error.errors : ["An error has occured"];
                    return of(new SearchFailed({errors}), new SetGlobalBusy({value: false}));
                })
        ))
    )

    @Effect()
    loadJobPostingById$ = this.actions$.pipe(
        ofType<LoadJobPostingById>(PersonnelJobSearchActionTypes.LoadJobPostingById),
        tap(() => this.store.dispatch(new SetGlobalBusy({value: true}))),
        switchMap(action => this.personnelService.getJobPostingById(action.payload.id).pipe(
            mergeMap(res => [new SearchCompleted({postings: [res.body]}), new SetGlobalBusy({value: false})]),
            catchError((res: HttpErrorResponse) => {
                const errors = res.error && res.error.errors ? res.error.errors : ["An error has occured"];
                this.router.navigate(['/error']);
                return of(new SetGlobalBusy({value: false}));
            })
        ))
    )

    @Effect()
    exitSearch$ = this.actions$.pipe(
        ofType<RouterRequestAction>(ROUTER_REQUEST),
        filter(action => action.payload.routerState.url.includes('job-search') && !action.payload.event.url.includes('job-search')),
        map(action => new ResetJobSearch())
    );

    constructor(
        private actions$: Actions,
        private store: Store<any>,
        private router: Router,
        private personnelService: PersonnelService) {}
}