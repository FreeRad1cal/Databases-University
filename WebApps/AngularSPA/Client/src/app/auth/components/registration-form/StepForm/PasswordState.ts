import { StepFormState, NextButtonLabel } from './StepFormState';
import { MenuItem } from 'primeng/components/common/menuitem';
import { FormGroup } from '@angular/forms';
import { StepForm } from './StepForm';
import { BasicInfoState } from './BasicInfoState';
import { AddressState } from './AddressState';
import { ConfirmPasswordValidatorKey } from 'src/app/shared/validators/confirmPasswordValidator';
import { checkValidity } from './checkValidity';
import { ConfirmationState } from './ConfirmationState';

export class PasswordState implements StepFormState {
    constructor(public menuItems: MenuItem[], public index: number, private formGroup: FormGroup) {
        this.menuItems[index].disabled = false;
    }

    next(wrapper: StepForm) {
        if (this.canGoNext()) {
            wrapper.setState(new ConfirmationState(this.menuItems, this.index + 1, this.formGroup));
        }
    }

    back(wrapper: StepForm) {
        if (this.canGoBack()) {
            wrapper.setState(new AddressState(this.menuItems, this.index - 1, this.formGroup));
        }
    }

    canGoBack(): boolean {
        return true;
    }

    canGoNext(): boolean {
        return checkValidity(this.formGroup, ['password', 'confirmPassword']) && !this.formGroup.hasError(ConfirmPasswordValidatorKey);
    }

    get nextButtonLabel(): NextButtonLabel {
        return 'Next';
    }
}