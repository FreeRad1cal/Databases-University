import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { JobApplication } from '../../models/JobApplication';
import { Router } from '@angular/router';
import { SelectItem } from 'primeng/components/common/selectitem';

export type JobApplicationAction = 'withdraw' | 'hire' | 'reject';
export type JobApplicationActionDescriptor = {
  action: JobApplicationAction;
  id: string
}

@Component({
  selector: 'app-job-applications-result',
  templateUrl: './job-applications-result.component.html',
  styleUrls: ['./job-applications-result.component.css']
})
export class JobApplicationsResultComponent implements OnInit {

  @Input()
  jobApplications: JobApplication[];
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

  constructor(private router: Router) { }

  ngOnInit() {
    this.actions = [
      {label: 'Widthdraw', action: 'withdraw'}
    ];
    if (this.canHire) {
      this.actions.concat([
        {label: 'Hire', action: 'hire'},
        {label: 'Reject', action: 'reject'}
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
}
