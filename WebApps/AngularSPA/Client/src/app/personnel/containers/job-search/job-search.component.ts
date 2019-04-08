import { Component, OnInit, OnDestroy } from '@angular/core';
import { Store } from '@ngrx/store';
import { ResetJobSearch } from '../../actions/job-search.actions';

@Component({
  selector: 'app-job-search',
  templateUrl: './job-search.component.html',
  styleUrls: ['./job-search.component.css'],
  host: {
    class: 'd-flex flex-grow-1'
  }
})
export class JobSearchComponent implements OnInit, OnDestroy {

  constructor(private store: Store<any>) { }

  ngOnInit() {
  }

  ngOnDestroy(): void {
    this.store.dispatch(new ResetJobSearch());
  }

}
