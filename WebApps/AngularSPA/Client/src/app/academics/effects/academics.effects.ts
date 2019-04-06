import { Injectable } from "@angular/core";
import { Actions, ofType, Effect, OnInitEffects } from '@ngrx/effects';
import { Store, Action } from '@ngrx/store';
import { Router } from '@angular/router';
import { InitializeApplication, AcademicsActionTypes, InitializeAcademicsRoot, AcademicsRootInitialized } from '../actions/actions';
import { switchMap, map, catchError } from 'rxjs/operators';
import { AcademicsService } from '../services/academics.service';
import { of } from 'rxjs';
import { NoOp } from 'src/app/actions/actions';

@Injectable()
export class AcademicsEffects implements OnInitEffects {
    
    @Effect()
    initializeAcademicsRoot$ = this.actions$.pipe(
        ofType<InitializeAcademicsRoot>(AcademicsActionTypes.InitializeAcademicsRoot),
        switchMap(() => this.academicsService.getSemesters().pipe(
            map(res => new AcademicsRootInitialized({semesters: res.body})),
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
        private academicsService: AcademicsService) {}


    ngrxOnInitEffects(): Action {
        return new InitializeAcademicsRoot();
    }
}