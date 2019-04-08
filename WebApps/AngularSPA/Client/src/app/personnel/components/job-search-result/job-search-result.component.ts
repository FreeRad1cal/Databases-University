import { Component, OnInit, Input, Output } from '@angular/core';
import { JobPosting } from '../../models/JobPosting';

@Component({
  selector: 'app-job-search-result',
  templateUrl: './job-search-result.component.html',
  styleUrls: ['./job-search-result.component.css']
})
export class JobSearchResultComponent implements OnInit {

  @Input()
  items: JobPosting[];

  ngOnInit() {
  }

}
