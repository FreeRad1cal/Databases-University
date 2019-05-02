import { Component, OnInit, OnDestroy } from '@angular/core';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs';
import { ActivatedRoute } from '@angular/router';
import { map } from 'rxjs/operators';

@Component({
  selector: 'app-job-application-confirmation',
  templateUrl: './job-application-confirmation.component.html',
  styleUrls: ['./job-application-confirmation.component.css']
})
export class JobApplicationConfirmationComponent implements OnInit, OnDestroy {

  referenceNumber$: Observable<string>;

  constructor(private store: Store<any>, private route: ActivatedRoute) { }

  ngOnInit() {
    this.referenceNumber$ = this.route.queryParams.pipe(
      map(params => params['referenceNumber'])
    );
  }

  ngOnDestroy() {
    //this.store.dispatch(new ResetJobApplication());
  }

}
