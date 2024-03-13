import { AbstractControl, ValidatorFn, Validators } from '@angular/forms';

export function NoSpace(): ValidatorFn {

    return (control: AbstractControl) => {
        if (control?.value?.startsWith(" ")) {
            let newValue = control?.value?.replace(" ", "");
            control.setValue(newValue);
            if (control.hasValidator(Validators.required)) return newValue ? null : { required: true }
        }
        return null;
    }
}