import { Component, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';
import { Person } from '../../models/Person';
import { Register } from '../../actions/auth.actions';
import { Observable, interval, timer, of } from 'rxjs';
import { getBusy, getRegistrationErrors, getRegistrationSuccess } from '../../reducers';
import { Router } from '@angular/router';
import { tap, switchMap, takeUntil, map } from 'rxjs/operators';

@Component({
  selector: 'app-registration-page',
  templateUrl: './registration-page.component.html',
  styleUrls: ['./registration-page.component.css'],
  host: {
    class: 'd-flex flex-grow-1 justify-content-center align-items-center'
  }
})
export class RegistrationPageComponent implements OnInit {
  
  busy$: Observable<boolean>;
  errors$: Observable<string[]>;
  successMessage$: Observable<boolean>;

  constructor(private store: Store<any>, private router: Router) { }

  ngOnInit() {
    this.busy$ = this.store.select(getBusy);
    this.errors$ = this.store.select(getRegistrationErrors);
    this.successMessage$ = this.store.select(getRegistrationSuccess).pipe(
      switchMap((success, i) => {
        if (success) {
          return timer(0, 1000).pipe(
            takeUntil(timer(5000)),
            tap(i => {
              if (i == 5) {
                this.router.navigate(['/login']);
              }
            }),
            map(i => `Registraion successful. Redirecting to the login page in ${5 - i < 0 ? 0 : 5 - i}...`)
          );
        }
        else {
          return of(null);
        }
      })
    )
  }

  onRegister(person: Person) {
    this.store.dispatch(new Register({person: person}));
  }
}
