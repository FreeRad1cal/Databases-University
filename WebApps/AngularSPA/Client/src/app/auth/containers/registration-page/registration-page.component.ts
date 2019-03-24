import { Component, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';
import { Person } from '../../models/Person';
import { Register } from '../../actions/auth.actions';
import { Observable } from 'rxjs';
import { getBusy, getRegistrationErrors } from '../../reducers';

@Component({
  selector: 'app-registration-page',
  templateUrl: './registration-page.component.html',
  styleUrls: ['./registration-page.component.css'],

})
export class RegistrationPageComponent implements OnInit {
  
  busy$: Observable<boolean>;
  errors$: Observable<string[]>;

  constructor(private store: Store<any>) { }

  ngOnInit() {
    this.busy$ = this.store.select(getBusy);
    this.errors$ = this.store.select(getRegistrationErrors);
  }

  onRegister(registrationInfo: Person) {
    this.store.dispatch(new Register({registrationInfo: registrationInfo}));
  }
}
