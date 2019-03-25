import { StepFormState, NextButtonLabel } from './StepFormState';
import { MenuItem } from 'primeng/components/common/menuitem';
import { StepForm } from './StepForm';
import { AddressState } from './AddressState';
import { FormGroup } from '@angular/forms';
import { checkValidity } from './checkValidity';

export class BasicInfoState implements StepFormState {
    constructor(public menuItems: MenuItem[], public index: number, private formGroup: FormGroup) {
        this.menuItems[index].disabled = false;
    }

    next(wrapper: StepForm) {
        if (this.canGoNext()) {
            wrapper.setState(new AddressState(this.menuItems, this.index + 1, this.formGroup));
        }
    }

    back(wrapper: StepForm) {
        return;
    }

    canGoBack(): boolean {
        return false;
    }

    canGoNext(): boolean {
        return checkValidity(this.formGroup, ['userName', 'emailAddress']);
    }

    get nextButtonLabel(): NextButtonLabel {
        return 'Next';
    }
}