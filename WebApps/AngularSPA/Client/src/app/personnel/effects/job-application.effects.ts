import { Injectable } from "@angular/core";
import { Actions, ofType, Effect, OnInitEffects } from '@ngrx/effects';
import { Store, Action } from '@ngrx/store';
import { Router } from '@angular/router';
import { switchMap, map, catchError, withLatestFrom, filter, tap, mergeMap } from 'rxjs/operators';
import { of, Observable } from 'rxjs';
import { SetGlobalBusy } from 'src/app/actions/actions';
import { HttpErrorResponse } from '@angular/common/http';
import { JobSearchService } from '../services/job-search.service';
import { getSignedInUser } from 'src/app/auth/reducers';
import { SubmitJobApplication, PersonnelApplicationActionTypes, JobApplicationSubmissionSuccess, JobApplicationSubmissionFailure, OpenResume, LoadMyJobApplications, SubmitJobApplicationAction, JobApplicationActionSuccess } from '../actions/job-application.actions';
import { AddJobApplications, AddJobPostings } from '../actions/personnel-actions';
import { JobApplicationService } from '../services/job-application.service';
import { getPagination } from 'src/app/reducers';

@Injectable()
export class JobApplicationEffects {
    
    @Effect()
    submitJobApplication$ = this.actions$.pipe(
        ofType<SubmitJobApplication>(PersonnelApplicationActionTypes.SubmitJobApplication),
        tap(() => this.store.dispatch(new SetGlobalBusy({value: true}))),
        switchMap(action => this.jobApplicationService.submitJobApplication(action.payload.jobPostingId, action.payload.resume).pipe(
                mergeMap(res => [
                    new AddJobPostings({jobPostings: [res.jobPosting]}),
                    new AddJobApplications({jobApplications: [res.jobApplication]}),
                    new JobApplicationSubmissionSuccess({jobApplication: res.jobApplication}),
                    new SetGlobalBusy({value: false})]),
                catchError(err => {
                    return of(new JobApplicationSubmissionFailure({errors: err}), new SetGlobalBusy({value: false}));
                })
        ))
    )

    @Effect({dispatch: false})
    applicationSubmissionSuccess$ = this.actions$.pipe(
        ofType<JobApplicationSubmissionSuccess>(PersonnelApplicationActionTypes.JobApplicationSubmissionSuccess),
        tap((action) => this.router.navigate(["personnel", "employment", "apply", "confirmation"], {queryParams: {referenceNumber: action.payload.jobApplication.id}}))
    )

    @Effect()
    loadMyJobApplications$ = this.actions$.pipe(                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                       
        ofType<LoadMyJobApplications>(PersonnelApplicationActionTypes.LoadMyJobApplications),
        withLatestFrom(this.store.select(getSignedInUser)),
        switchMap(([action, user]) => this.jobApplicationService.getJobApplications({applicantId: user.id}).pipe(
                mergeMap(res => [
                    new AddJobPostings({jobPostings: res.items.jobPostings}),
                    new AddJobApplications({jobApplications: res.items.jobApplications, total: res.total}),
                    new SetGlobalBusy({value: false})
                ]),
                catchError(errors => {
                    this.router.navigate(['/error'], {queryParams: {errors: JSON.stringify(errors)}});
                    return of(new SetGlobalBusy({value: false}));
                })
        ))
    );

    @Effect()
    loadJobApplications$ = this.actions$.pipe(                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                       
        ofType<LoadMyJobApplications>(PersonnelApplicationActionTypes.LoadJobApplications),
        withLatestFrom(this.store.select(getPagination('job_applications'))),
        switchMap(([action, pagination]) => this.jobApplicationService.getJobApplications({pagination}).pipe(
                mergeMap(res => [
                    new AddJobPostings({jobPostings: res.items.jobPostings}),
                    new AddJobApplications({jobApplications: res.items.jobApplications, total: res.total}),
                    new SetGlobalBusy({value: false})
                ]),
                catchError(errors => {
                    this.router.navigate(['/error'], {queryParams: {errors: JSON.stringify(errors)}});
                    return of(new SetGlobalBusy({value: false}));
                })
        ))
    )

    @Effect({dispatch: false})
    openResume$ = this.actions$.pipe(
        ofType<OpenResume>(PersonnelApplicationActionTypes.OpenResume),
        switchMap(action => this.jobApplicationService.getResumeByApplicationId(action.payload.id).pipe(
            tap((blob: Blob) => {
                const fileURL = URL.createObjectURL(blob);
                window.open(fileURL, '_blank');
            }),
            catchError(errors => this.router.navigate(['/error'], {queryParams: {errors: JSON.stringify(errors)}}))
        ))
    )

    @Effect()
    submitJobApplicationAction$ = this.actions$.pipe(
        ofType<SubmitJobApplicationAction>(PersonnelApplicationActionTypes.SubmitJobApplicationAction),
        tap(() => this.store.dispatch(new SetGlobalBusy({value: true}))),
        switchMap(action => {
            let result: Observable<any>;
            switch(action.payload.jobApplicationAction.action) {
                case 'Withdraw':
                    result = this.jobApplicationService.deleteJobApplicationById(action.payload.jobApplicationAction.id);
                default:
                    result = this.jobApplicationService.makeJobApplicationDecision(action.payload.jobApplicationAction.id, action.payload.jobApplicationAction.action);
            }
            return result.pipe(
                mergeMap(res => [new JobApplicationActionSuccess({jobApplicationAction: action.payload.jobApplicationAction}), new SetGlobalBusy({value: false})]),
                catchError(errors => {
                    this.router.navigate(['/error'], {queryParams: {errors: JSON.stringify(errors)}});
                    return of(new SetGlobalBusy({value: false}));
                })
            )
        })
    )

    constructor(
        private actions$: Actions,
        private store: Store<any>,
        private router: Router,
        private jobApplicationService: JobApplicationService) {}
}