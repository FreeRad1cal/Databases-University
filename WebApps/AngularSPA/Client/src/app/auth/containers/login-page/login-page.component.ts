import { Component, OnInit, EventEmitter, Output } from '@angular/core';
import { LoginCredentials } from '../../models/LoginCredentials';
import { Store } from '@ngrx/store';
import { SignIn } from '../../actions/auth.actions';
import { Observable } from 'rxjs';
import { getBusy, getError } from '../../reducers';

@Component({
  selector: 'app-login-page',
  templateUrl: './login-page.component.html',
  styleUrls: ['./login-page.component.css'],
  host: {
    class: 'd-flex flex-grow-1 justify-content-center align-items-center'
  }
})
export class LoginPageComponent implements OnInit {

  busy$: Observable<boolean>;
  error$: Observable<string>;

  constructor(private store: Store<any>) { }

  ngOnInit() {
    this.busy$ = this.store.select(getBusy);
    this.error$ = this.store.select(getError);
  }

  onLogin(loginCredentials: LoginCredentials) {
    this.store.dispatch(new SignIn({credentials: loginCredentials}));
  }
}
