import { StepFormState, NextButtonLabel } from './StepFormState';
import { MenuItem } from 'primeng/components/common/menuitem';
import { FormGroup } from '@angular/forms';
import { StepForm } from './StepForm';
import { BasicInfoState } from './BasicInfoState';
import { PasswordState } from './PasswordState';

export class AddressState implements StepFormState {
    constructor(public menuItems: MenuItem[], public index: number, private formGroup: FormGroup) {
        this.menuItems[index].disabled = false;
    }

    next(wrapper: StepForm) {
        if (this.canGoNext()) {
            wrapper.setState(new PasswordState(this.menuItems, this.index + 1, this.formGroup));
        }
    }

    back(wrapper: StepForm) {
        if (this.canGoBack()) {
            wrapper.setState(new BasicInfoState(this.menuItems, this.index - 1, this.formGroup));
        }
    }

    canGoBack(): boolean {
        return true;
    }

    canGoNext(): boolean {
        return this.formGroup.controls['address'].valid;
    }

    get nextButtonLabel(): NextButtonLabel {
        return 'Next';
    }
}