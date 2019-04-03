import { Component, OnInit } from '@angular/core';
import { Store, select } from '@ngrx/store';
import { Application } from '../../models/Application';
import { getSemesters, getDraftApplication } from '../../reducers';
import { Observable } from 'rxjs';
import { Semester } from '../../models/Semester';
import { InitializeApplication } from '../../actions/actions';
import { map, filter } from 'rxjs/operators';

@Component({
  selector: 'app-application-page',
  templateUrl: './application-page.component.html',
  styleUrls: ['./application-page.component.css'],
  host: {
    class: 'd-flex flex-grow-1 justify-content-center align-items-center'
  }
})
export class ApplicationPageComponent implements OnInit {

  semesters: Observable<Semester[]>;
  draft: Observable<Application>;

  constructor(private store: Store<any>) { }

  ngOnInit() {
    this.store.dispatch(new InitializeApplication());
    this.draft = this.store.select(getDraftApplication);
    this.semesters = this.store.pipe(
      select(getSemesters),
      map(semesters => {
        let now = new Date();
        return semesters.filter(semester => semester.applicationStartDate < now && semester.applicationEndDate > now);
      })
    );
  }

  onSubmit(application: Application) {
    console.log(application);
  }

}
