import { Component, OnInit, Input, Output, EventEmitter, OnDestroy } from '@angular/core';
import { LoginCredentials } from '../../models/LoginCredentials';
import { FormGroup, FormControl, Validators, Validator, ValidatorFn, AbstractControl } from '@angular/forms';
import { Person } from '../../models/Person';
import { MenuItem } from 'primeng/components/common/menuitem';
import { StepForm } from './StepForm/StepForm';
import { BasicInfoState } from './StepForm/BasicInfoState';
import { usStates } from 'src/app/shared/usStates';
import { SelectItem } from 'primeng/components/common/selectitem';
import { Subscription } from 'rxjs';
import { map, tap } from 'rxjs/operators';
import { confirmPasswordValidator } from 'src/app/shared/validators/confirmPasswordValidator';
import { NextButtonLabel } from './StepForm/StepFormState';

type Step = 'basicInfo' | 'address' | 'password';

@Component({
  selector: 'app-registration-form',
  templateUrl: './registration-form.component.html',
  styleUrls: ['./registration-form.component.css']
})
export class RegistrationFormComponent implements OnInit, OnDestroy {
  @Input()
  busy: boolean;

  @Output()
  register = new EventEmitter<Person>();

  registrationForm: FormGroup;
  errorDictionary: {};
  stepForm: StepForm;
  usStates = usStates;
  states: SelectItem[];
  addressesSame: boolean = false;

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
        required: "Password is required"
      },
      confirmPassword: {
        required: "Confirm password is required"
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

    this.states = Object.entries(usStates).map(kvp => {
      return {label: kvp[1], value: kvp[0]};
    });
  }

  ngOnDestroy(): void {
    this.addressSubscription.unsubscribe();
  }

  next(label: NextButtonLabel) {
    if (label == "Next") {
      this.stepForm.next();
    }
    else {
      this.register.emit(this.formValueToPerson());
    }
  }

  private formValueToPerson(): Person {
    let formValue = this.registrationForm.getRawValue();
    let person: Person = formValue;
    person.homeAddress = formValue.address.homeAddress;
    person.mailingAddress = formValue.address.mailingAddress;
    return person;
  }

  private addressSubscription: Subscription;  
  onAddressCheckBoxChanged(checked: boolean) {
    let homeAddress = this.registrationForm.get('address').get('homeAddress');
    let mailingAddress = this.registrationForm.get('address').get('mailingAddress');
    if (checked) {
      mailingAddress.setValue({... homeAddress.value});
      this.setValidators(mailingAddress as FormGroup, []);
      mailingAddress.disable();
      this.addressSubscription = homeAddress.valueChanges.pipe(
        tap(value => mailingAddress.setValue(value))).subscribe();
    }
    else {
      this.setValidators(mailingAddress as FormGroup, [Validators.required]);
      this.addressSubscription.unsubscribe();
      mailingAddress.enable();
    }
  }

  private setValidators(formGroup: FormGroup, validators: ValidatorFn[]) {
    for (let control of Object.values(formGroup.controls)) {
      control.setValidators(validators);
    }
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
      emailAddress: new FormControl('', [Validators.required, Validators.email]),
      password: new FormControl('', [Validators.required]),
      confirmPassword: new FormControl('', [Validators.required]),
      address: new FormGroup({
        homeAddress: this.createAddressForm(true),
        mailingAddress: this.createAddressForm(true)
      })
    }, [confirmPasswordValidator]);
  }
}
