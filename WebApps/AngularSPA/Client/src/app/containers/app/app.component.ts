import { Component, OnInit } from '@angular/core';
import { Inject } from '@angular/core';
import { Store, select } from '@ngrx/store';
import { getGlobalBusy } from 'src/app/reducers';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {

  globalBusy: Observable<boolean>;

  constructor(private store: Store<any>) {}

  ngOnInit(): void {
    this.globalBusy = this.store.select(getGlobalBusy);
  }
}
