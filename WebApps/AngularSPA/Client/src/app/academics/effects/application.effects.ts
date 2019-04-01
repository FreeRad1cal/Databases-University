import { Injectable } from "@angular/core";
import { Actions } from '@ngrx/effects';
import { Store } from '@ngrx/store';
import { Router } from '@angular/router';

@Injectable()
export class ApplicationEffects {
    constructor(
        private actions$: Actions,
        private store: Store<any>,
        private router: Router) {}
}