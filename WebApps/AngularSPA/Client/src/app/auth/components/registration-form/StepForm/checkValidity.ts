import { FormGroup } from '@angular/forms';

export function checkValidity(formGroup: FormGroup, controls: string[]): boolean {
    return controls
      .map(control => formGroup.get(control).valid)
      .reduce((res, cur) => res && cur);
  }