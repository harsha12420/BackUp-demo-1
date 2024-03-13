import { AbstractControl, ValidatorFn } from '@angular/forms';

export function ValidateDate(): ValidatorFn {
    return (control: AbstractControl) => {
        const date: any = control.value;
        if (!date) return null;
        const yearRegex = new RegExp("[0-9]{4}")
        const monthRegex = new RegExp("^(0?[1-9]|1[012])$");
        const dayRegex = new RegExp("^([1-9]|[12]\d|3[01])$")
        if (!(yearRegex.test(date?.year) || monthRegex.test(date?.month) || dayRegex.test(date?.day))) {
            return { invalidDate: true };
        }
        return null;
    }
}