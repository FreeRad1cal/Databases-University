import { Component, OnInit, Output, EventEmitter, Input } from '@angular/core';
import { Application } from '../../models/Application';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { Semester } from '../../models/Semester';

@Component({
  selector: 'app-application-form',
  templateUrl: './application-form.component.html',
  styleUrls: ['./application-form.component.css']
})
export class ApplicationFormComponent implements OnInit {

  @Output()
  submit = new EventEmitter<Application>();
  @Input()
  semesters: Semester[];
  @Input()
  draft: Application;

  applicationForm: FormGroup;
  errorDictionary: {}  
  
  constructor() { }

  ngOnInit() {
    this.applicationForm = new FormGroup({
      semester: new FormControl(null, [Validators.required]),
      detail: new FormControl('', [Validators.required])
    });

    if (this.draft) {
      this.applicationForm.setValue(this.draft);
    }

    this.errorDictionary = {
      semester: {
        required: "You must select a semester"
      },
      detail: {
        required: "You must enter something here"
      }
    }
  }

  onSubmit() {
    this.submit.emit(this.applicationForm.value);
  }

}
