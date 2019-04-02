import { Component, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';
import { Application } from '../../models/Application';

@Component({
  selector: 'app-application-page',
  templateUrl: './application-page.component.html',
  styleUrls: ['./application-page.component.css'],
  host: {
    class: 'd-flex flex-grow-1 justify-content-center align-items-center'
  }
})
export class ApplicationPageComponent implements OnInit {

  constructor(private store: Store<any>) { }

  ngOnInit() {
  }

  onSubmit(application: Application) {
    console.log(application);
  }

}
