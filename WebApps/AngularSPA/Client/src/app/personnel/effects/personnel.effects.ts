import { Injectable } from "@angular/core";
import { Actions, ofType, Effect, OnInitEffects } from '@ngrx/effects';
import { Store, Action } from '@ngrx/store';
import { Router } from '@angular/router';
import { switchMap, map, catchError } from 'rxjs/operators';
import { JobSearchService } from '../services/job-search.service';
import { of } from 'rxjs';
import { NoOp } from 'src/app/actions/actions';
import { LoadJobTitles, PersonnelActionTypes, AddJobTitles } from '../actions/personnel-actions';

@Injectable()
export class PersonnelEffects implements OnInitEffects {
    
    @Effect()
    loadJobTitles$ = this.actions$.pipe(
        ofType<LoadJobTitles>(PersonnelActionTypes.LoadJobTitles),
        switchMap(() => this.personnelService.getJobTitles().pipe(
            map(res => new AddJobTitles({jobTitles: res.items.jobTitles}))
        ))
    )

    constructor(
        private actions$: Actions,
        private store: Store<any>,
        private router: Router,
        private personnelService: JobSearchService) {}


    ngrxOnInitEffects(): Action {
        return new LoadJobTitles();
    }
}