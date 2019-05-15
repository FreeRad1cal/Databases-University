import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { JobApplication } from '../../models/JobApplication';
import { JobApplicationActionDescriptor, JobApplicationAction } from '../../reducers/job-application.reducer';
import { JobPosting } from '../../models/JobPosting';

@Component({
  selector: 'app-job-applications-result',
  templateUrl: './job-applications-result.component.html',
  styleUrls: ['./job-applications-result.component.css']
})
export class JobApplicationsResultComponent implements OnInit {

  @Input()
  jobApplications: JobApplication[];
  @Input()
  jobPostings: JobPosting[];
  @Input()
  canHire: boolean;
  @Output()
  openResume = new EventEmitter<string>();
  @Output()
  action = new EventEmitter<JobApplicationActionDescriptor>();

  actions: {
    action: JobApplicationAction;
    label: string;
  }[];

  constructor() { }

  ngOnInit() {
    this.actions = [
      {label: 'Withdraw', action: 'Withdraw'}
    ];
    if (this.canHire) {
      this.actions = this.actions.concat([
        {label: 'Hire', action: 'Hire'},
        {label: 'Reject', action: 'Reject'}
      ])
    }
  }

  onOpenResume(id: string) {
    this.openResume.emit(id);
  }

  onAction(action: JobApplicationAction, id: string) {
    this.action.emit({
      action: action,
      id: id
    });
  }

  getJobTitleByPostingId(id: string) {
    return this.jobPostings.find(posting => posting.id == id).jobTitle;
  }
}
