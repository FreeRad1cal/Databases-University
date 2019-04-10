import { Injectable } from "@angular/core";
import { Actions, ofType, Effect, OnInitEffects } from '@ngrx/effects';
import { Store, Action } from '@ngrx/store';
import { Router } from '@angular/router';
import { switchMap, map, catchError, withLatestFrom, filter, tap, mergeMap } from 'rxjs/operators';
import { of } from 'rxjs';
import { NoOp, SetGlobalBusy } from 'src/app/actions/actions';
import { Search, PersonnelJobSearchActionTypes, SearchCompleted, SearchFailed, ResetJobSearch } from '../actions/job-search.actions';
import { getPagination } from '../reducers';
import { HttpErrorResponse } from '@angular/common/http';
import { ROUTER_NAVIGATION, RouterNavigationAction, ROUTER_REQUEST, RouterRequestAction } from '@ngrx/router-store';
import { SubmitJobApplication, PersonnelApplicationActionTypes, ApplicationSubmissionSuccess, ApplicationSubmissionFailure, LoadMyJobApplications, JobApplicationsLoaded, OpenResume, ActOnJobApplication, ApplicationActionSuccess } from '../actions/job-application.actions';
import { PersonnelService } from '../services/personnel.service';
import { getSignedInUser } from 'src/app/auth/reducers';

@Injectable()
export class JobApplicationEffects {
    
    @Effect()
    submitJobApplication$ = this.actions$.pipe(
        ofType<SubmitJobApplication>(PersonnelApplicationActionTypes.SubmitJobApplication),
        tap(() => this.store.dispatch(new SetGlobalBusy({value: true}))),
        switchMap(action => this.personnelService.submitJobApplication(action.payload.application).pipe(
                mergeMap((res: any) => [new ApplicationSubmissionSuccess({referenceNumber: res.body.id}), new SetGlobalBusy({value: false})]),
                catchError((res: HttpErrorResponse) => {
                    const errors = res.error && res.error.errors ? res.error.errors : ["An error has occured"];
                    return of(new ApplicationSubmissionFailure({errors}), new SetGlobalBusy({value: false}));
                })
        ))
    )

    @Effect({dispatch: false})
    applicationSubmissionSuccess$ = this.actions$.pipe(
        ofType<ApplicationSubmissionSuccess>(PersonnelApplicationActionTypes.ApplicationSubmissionSuccess),
        tap((action) => this.router.navigate(["personnel", "job-search", "apply", "confirmation"], {queryParams: {referenceNumber: action.payload.referenceNumber}}))
    )

    @Effect()
    loadMyApplications$ = this.actions$.pipe(
        ofType<LoadMyJobApplications>(PersonnelApplicationActionTypes.LoadMyJobApplications),
        withLatestFrom(this.store.select(getSignedInUser)),
        switchMap(([action, user]) => this.personnelService.getJobApplications({applicantId: user.id}).pipe(
                map((res: any) => new JobApplicationsLoaded({jobApplications: res.body.items, totalJobApplications: res.body.total})),
                catchError((res: HttpErrorResponse) => {
                    const errors = res.error && res.error.errors ? res.error.errors : ["An error has occured"];
                    this.router.navigate(['/error'], {queryParams: {errors: JSON.stringify(errors)}});
                    return of(new SetGlobalBusy({value: false}));
                })
        ))
    )

    @Effect({dispatch: false})
    openResume$ = this.actions$.pipe(
        ofType<OpenResume>(PersonnelApplicationActionTypes.OpenResume),
        switchMap(action => this.personnelService.getResumeByApplicationId(action.payload.id).pipe(
            tap((blob: Blob) => {
                const fileURL = URL.createObjectURL(blob);
                window.open(fileURL, '_blank');
            }),
            catchError((res: HttpErrorResponse) => {
                this.router.navigate(['/error']);
                return of();
            })
        ))
    )

    @Effect()
    actOnJobApplication$ = this.actions$.pipe(
        ofType<ActOnJobApplication>(PersonnelApplicationActionTypes.ActOnJobApplication),
        tap(() => this.store.dispatch(new SetGlobalBusy({value: true}))),
        switchMap(action => {
            switch(action.payload.jobApplicationAction.action) {
                case 'withdraw':
                    return this.personnelService.deleteJobApplicationById(action.payload.jobApplicationAction.id).pipe(
                        mergeMap(res => [new ApplicationActionSuccess({jobApplicationAction: action.payload.jobApplicationAction}), new SetGlobalBusy({value: false})]),
                        catchError((res: HttpErrorResponse) => {
                            this.router.navigate(['/error']);
                            return of(new SetGlobalBusy({value: false}));
                        })
                    )
            }
        })
    )

    constructor(
        private actions$: Actions,
        private store: Store<any>,
        private router: Router,
        private personnelService: PersonnelService) {}
}