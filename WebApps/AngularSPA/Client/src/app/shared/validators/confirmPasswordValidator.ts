import { ValidatorFn, FormGroup, ValidationErrors, FormControl } from "@angular/forms";

export const confirmPasswordValidator: ValidatorFn = (formGroup: FormGroup): ValidationErrors | null => {
    const password = formGroup.get('password');
    const confirmPassword = formGroup.get('confirmPassword');
    if (!password || !confirmPassword) {
      throw new Error("confirmPasswordValidator requires controls named 'password' and 'confirmPassword'")
    }
    
    if (password.value !== confirmPassword.value) {
      confirmPassword.setErrors({doesNotMatchPassword: true});
      return { confirmPassword: true };
    }
    
    return null;
  };