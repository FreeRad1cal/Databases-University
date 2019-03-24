import { MenuItem } from 'primeng/components/common/menuitem';
import { StepForm } from './StepForm';

export type NextButtonLabel = 'Submit' | 'Next';

export interface StepFormState {
    menuItems: MenuItem[];
    index: number;
    next(wrapper: StepForm);
    back(wrapper: StepForm);
    canGoBack(): boolean;
    canGoNext(): boolean;
    nextButtonLabel: NextButtonLabel;
}