import { Component, OnInit } from '@angular/core';
import { MenuItem } from 'primeng/components/common/menuitem';
import { Store, select } from '@ngrx/store';
import { SignOut } from 'src/app/auth/actions/auth.actions';
import { getSignedInUser, getRoles } from 'src/app/auth/reducers';
import { Observable, of } from 'rxjs';
import { Person } from 'src/app/auth/models/Person';
import { map, catchError, withLatestFrom } from 'rxjs/operators';
import * as _ from 'lodash';
import { Roles } from 'src/app/auth/known-claims/roles';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css'],
  host: {
    class: 'flex-grow-1'
  }
})
export class HomeComponent implements OnInit {
  
  items: Observable<MenuItem[]>;
  myRoles$: Observable<string[]>;

  constructor(private store: Store<any>) { }

  ngOnInit() {
    this.myRoles$ = this.store.select(getRoles);

    this.items = this.store.pipe(
      select(getSignedInUser),
      withLatestFrom(this.myRoles$),
      map(([user, roles]) => [
        {label: `${user.firstName} ${user.lastName}`, disabled: true},
        {label: 'Employment', items: [
          {label: 'Search Jobs', routerLink: ['/personnel/employment/job-search']},
          {label: 'My Applications', routerLink: ['/personnel/employment/my-job-applications']},
          {label: 'Received Job Applications', routerLink: ['/personnel/employment/job-applications'], visible: roles.includes(Roles.Employee)}
        ]},
        {label: 'Academics', items: [
          {label: 'Apply to DBU', routerLink: ['academics', 'apply']},
          {label: 'Student Center', visible: roles.includes(Roles.Student)}
        ]},
        {label: 'Sign Out', command: this.signOut, context: this}
      ]),
      catchError(() => of([]))
    );
  }

  signOut(event: any) {
    event.item.context.store.dispatch(new SignOut());
  }
}
