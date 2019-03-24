import { Component, OnInit, EventEmitter, Output } from '@angular/core';
import { LoginCredentials } from '../../models/LoginCredentials';
import { Store } from '@ngrx/store';
import { SignIn } from '../../actions/auth.actions';
import { Observable } from 'rxjs';
import { getBusy, getLoginErrors } from '../../reducers';

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
  errors$: Observable<string[]>;

  constructor(private store: Store<any>) { }

  ngOnInit() {
    this.busy$ = this.store.select(getBusy);
    this.errors$ = this.store.select(getLoginErrors);
  }

  onLogin(loginCredentials: LoginCredentials) {
    this.store.dispatch(new SignIn({credentials: loginCredentials}));
  }
}
