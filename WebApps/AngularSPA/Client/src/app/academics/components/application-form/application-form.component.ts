import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { Application } from '../../models/Application';
import { FormGroup } from '@angular/forms';

@Component({
  selector: 'app-application-form',
  templateUrl: './application-form.component.html',
  styleUrls: ['./application-form.component.css']
})
export class ApplicationFormComponent implements OnInit {

  @Output()
  submit = new EventEmitter<Application>();

  constructor() { }

  ngOnInit() {

  }

  onSubmit() {
    this.submit.emit();
  }

}
