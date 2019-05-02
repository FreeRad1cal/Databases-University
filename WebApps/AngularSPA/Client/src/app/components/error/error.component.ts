import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { map, switchMap } from 'rxjs/operators';

@Component({
  selector: 'app-error',
  templateUrl: './error.component.html',
  styleUrls: ['./error.component.css']
})
export class ErrorComponent implements OnInit {

  errors$: Observable<string[]>;

  constructor(private route: ActivatedRoute) { }

  ngOnInit() {
    this.errors$ = this.route.queryParamMap.pipe(
      map(params => {
        let errors = JSON.parse(params.get('errors')) as string[];
        return errors;
      })
    )
  }

}
