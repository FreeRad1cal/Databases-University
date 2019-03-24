import { StepFormState, NextButtonLabel } from './StepFormState';
import { MenuItem } from 'primeng/components/common/menuitem';
import { Person } from 'src/app/auth/models/Person';
import { EventEmitter } from '@angular/core';

export class StepForm {
    constructor(private stepFormState: StepFormState) {}

    get menuItems(): MenuItem[] {
        return this.stepFormState.menuItems;
    }

    get activeIndex(): number {
        return this.stepFormState.index;
    }

    get currentStateName(): number {
        return (this.stepFormState as any).constructor.name;
    }

    get nextButtonLabel(): NextButtonLabel {
        return this.stepFormState.nextButtonLabel;
    }

    next() {
        this.stepFormState.next(this);
    }

    back() {
        this.stepFormState.back(this);
    }

    canGoNext(): boolean {
        return this.stepFormState.canGoNext();
    }

    canGoBack(): boolean {
        return this.stepFormState.canGoBack();
    }

    setState(state: StepFormState) {
        this.stepFormState = state;
    }
}