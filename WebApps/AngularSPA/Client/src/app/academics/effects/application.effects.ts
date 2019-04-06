import { Injectable } from "@angular/core";
import { Actions, ofType, Effect, OnInitEffects } from '@ngrx/effects';
import { Store, Action } from '@ngrx/store';
import { Router } from '@angular/router';
import { InitializeApplication, AcademicsActionTypes, InitializeAcademicsRoot, ApplicationInitialized } from '../actions/actions';
import { switchMap, map, catchError } from 'rxjs/operators';
import { ApplicationService } from '../services/application.service';
import { of } from 'rxjs';
import { NoOp } from 'src/app/actions/actions';

@Injectable()
export class ApplicationEffects {
    
    @Effect()
    initializeApplication$ = this.actions$.pipe(
        ofType<InitializeApplication>(AcademicsActionTypes.InitializeApplication),
        switchMap(() => this.applicationService.getApplicationDraft().pipe(
                map(res => new ApplicationInitialized({draft: res.body})),
                catchError(res => {
                    const errors = res.error && res.error.errors ? res.error.errors : ["An error has occured"];
                    this.router.navigate(['error'], {queryParams: {errors: errors}})
                    return of(new NoOp());
                })
        ))
    )

    constructor(
        private actions$: Actions,
        private store: Store<any>,
        private router: Router,
        private applicationService: ApplicationService) {}
}