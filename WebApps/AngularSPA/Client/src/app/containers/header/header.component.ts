import { Component, OnInit } from '@angular/core';
import { Store, select } from '@ngrx/store';
import { getSignedInUser } from 'src/app/auth/reducers';
import { Person } from 'src/app/auth/models/Person';
import { map, tap } from 'rxjs/operators';
import { Observable } from 'rxjs';
import { SignOut } from 'src/app/auth/actions/auth.actions';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit {
  
  userName: Observable<string>;

  constructor(private store: Store<any>) { }

  ngOnInit() {
    this.userName = this.store.pipe(
      select(getSignedInUser),
      map(person => person.userName),
      tap(person => console.log(person))
    )
  }

  onSignOut() {
    this.store.dispatch(new SignOut());
  }

}
