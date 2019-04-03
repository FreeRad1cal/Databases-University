import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

@Component({
  selector: 'app-error',
  templateUrl: './error.component.html',
  styleUrls: ['./error.component.css']
})
export class ErrorComponent implements OnInit {

  errors: Observable<string[]>;

  constructor(private route: ActivatedRoute) { }

  ngOnInit() {
    this.errors = this.route.queryParams.pipe(
      map(params => params['errors'])
    )
  }

}
