import { Injectable } from "@angular/core";
import { Actions, ofType, Effect, OnInitEffects } from '@ngrx/effects';
import { Store, Action } from '@ngrx/store';
import { Router } from '@angular/router';
import { switchMap, map, catchError } from 'rxjs/operators';
import { PersonnelService } from '../services/personnel.service';
import { of } from 'rxjs';
import { NoOp } from 'src/app/actions/actions';
import { LoadJobTitles, PersonnelActionTypes, JobTitlesLoaded } from '../actions/personnel-actions';

@Injectable()
export class PersonnelEffects implements OnInitEffects {
    
    @Effect()
    loadJobTitles$ = this.actions$.pipe(
        ofType<LoadJobTitles>(PersonnelActionTypes.LoadJobTitles),
        switchMap(() => this.personnelService.getJobTitles().pipe(
            map(res => new JobTitlesLoaded({jobTitles: res.body})),
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
        private personnelService: PersonnelService) {}


    ngrxOnInitEffects(): Action {
        return new LoadJobTitles();
    }
}