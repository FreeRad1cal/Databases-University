import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { JobPosting } from '../../models/JobPosting';
import { JobApplication } from '../../models/JobApplication';
import { FileUpload } from 'primeng/fileupload';
import { Router } from '@angular/router';

@Component({
  selector: 'app-job-application-form',
  templateUrl: './job-application-form.component.html',
  styleUrls: ['./job-application-form.component.css']
})
export class JobApplicationFormComponent implements OnInit {

  @Input()
  jobPosting: JobPosting;
  @Output()
  submit = new EventEmitter<{
    jobPostingId: string,
    resume: File
  }>();

  uploadedFiles: File[] = [];

  constructor(private router: Router) { }

  ngOnInit() {
  }

  onUpload($event: any) {
    this.uploadedFiles = this.uploadedFiles.concat($event.files);
  }
  
  onReturn() {
    this.router.navigate(['personnel', 'employment', 'job-posting', this.jobPosting.id]);
  }

  onSubmit() {
    this.submit.emit({
      jobPostingId: this.jobPosting.id,
      resume: this.uploadedFiles[0]
    });
  }

}
