import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { JobTitle } from '../../models/JobTitle';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { SelectItem } from 'primeng/components/common/selectitem';
import { JobSearchQuery } from '../../containers/job-search-page/job-search-page.component';

@Component({
  selector: 'app-job-search-form',
  templateUrl: './job-search-form.component.html',
  styleUrls: ['./job-search-form.component.css']
})
export class JobSearchFormComponent implements OnInit {

  @Output()
  search = new EventEmitter<JobSearchQuery>();
  @Input()
  jobTitles: JobTitle[];

  get jobTitleOptions(): SelectItem[] {
    return this.jobTitles.map(title => {
      return {
        label: title.name,
        value: title
      }
    });
  }

  jobSearchForm: FormGroup;
  
  constructor() { }

  ngOnInit() {
    this.jobSearchForm = new FormGroup({
      jobTitles: new FormControl([]),
      query: new FormControl('')
    });
  }

  onSubmit() {
    this.search.emit(this.jobSearchForm.value);
  }

}
