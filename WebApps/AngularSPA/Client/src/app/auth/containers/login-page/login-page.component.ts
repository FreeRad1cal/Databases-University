import { Component, OnInit, EventEmitter, Output } from '@angular/core';
import { LoginCredentials } from '../../models/LoginCredentials';
import { Store } from '@ngrx/store';
import { SignIn } from '../../actions/auth.actions';

@Component({
  selector: 'app-login-page',
  templateUrl: './login-page.component.html',
  styleUrls: ['./login-page.component.css']
})
export class LoginPageComponent implements OnInit {

  constructor(private store: Store<any>) { }

  ngOnInit() {
  }

  onLogin(loginCredentials: LoginCredentials) {
    this.store.dispatch(new SignIn({credentials: loginCredentials}));
  }
}
