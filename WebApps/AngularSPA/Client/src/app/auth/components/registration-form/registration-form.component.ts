import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { LoginCredentials } from '../../models/LoginCredentials';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { Person } from '../../models/Person';
import { MenuItem } from 'primeng/components/common/menuitem';
import { StepForm } from './StepForm/StepForm';
import { BasicInfoState } from './StepForm/BasicInfoState';

type Step = 'basicInfo' | 'address' | 'password';

@Component({
  selector: 'app-registration-form',
  templateUrl: './registration-form.component.html',
  styleUrls: ['./registration-form.component.css']
})
export class RegistrationFormComponent implements OnInit {

  @Input()
  busy: boolean;

  @Output()
  register = new EventEmitter<Person>();
  registrationForm: FormGroup;
  errorDictionary: {};

  stepForm: StepForm;

  constructor() { }

  ngOnInit() {
    this.registrationForm = this.createRegistrationForm();
    this.errorDictionary = {
      userName: {
        required: "Username is required"
      },
      email: {
        required: "Email is required",
        email: "Email is invalid"
      },
      password: {
        required: "Email is required"
      },
      address: {
        city: {
          required: "City is required"
        },
        street: {
          required: "Street is required"
        },
        country: {
          required: "Country is required"
        },
        zipCode: {
          required: "Zip code is required"
        },
        state: {
          required: "State is required"
        }
      }
    }

    const menuItems = [
      {label: 'Basic Info'},
      {label: 'Address', disabled: true},
      {label: 'Password', disabled: true},
      {label: 'Confirmation', disabled: true}
    ];

    this.stepForm = new StepForm(new BasicInfoState(menuItems, 0, this.registrationForm));
  }

  onRegisterClicked() {
    this.register.emit(this.registrationForm.value);
    this.registrationForm.reset();
  }

  private createAddressForm(isRequired: boolean) {
    const validators = isRequired ? [Validators.required] : [];
    return new FormGroup({
      city: new FormControl('', validators),
      street: new FormControl('', validators),
      country: new FormControl('', validators),
      zipCode: new FormControl('', validators),
      state: new FormControl('', validators)
    }, validators);
  }

  private createRegistrationForm() {
    return new FormGroup({
      userName: new FormControl('', [Validators.required]),
      email: new FormControl('', [Validators.required, Validators.email]),
      password: new FormControl('', [Validators.required]),
      confirmPassword: new FormControl('', [Validators.required]),
      address: new FormGroup({
        homeAddress: this.createAddressForm(true),
        mailingAddress: this.createAddressForm(false)
      })
    });
  }
}
