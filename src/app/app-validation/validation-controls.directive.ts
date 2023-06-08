import { AbstractControl } from '@angular/forms';


export class ValidatorControls {

    private static _instance: ValidatorControls;

    private static get instance() {
        if (!ValidatorControls._instance) {
            ValidatorControls._instance = new ValidatorControls();
        }
        return ValidatorControls._instance;
    }

    static minValueValidator = (min: number, inclusive: boolean,
        errorMessage: string, allowZero?: boolean) => {
        return (control: AbstractControl) => {
            if (control.value === null) {
                return null;
            }
            if (allowZero && control.value === 0) {
                return null;
            }
            if (Number(control.value) < min ||
                (!inclusive && Number(control.value) === min)) {
                return {
                    minValueValidator: errorMessage
                };
            }
            return null;
        };
    }

    static numberValidator = (errorMessage: string | number) => {
        return (control: AbstractControl) => {
            if (isNaN(control.value)) {
                return {
                    numberValidator: errorMessage
                };
            }
            return null;
        };
    }

    static maxValueValidator = (max: number, inclusive: boolean, errorMessage: string) => {
        return (control: AbstractControl) => {
            if (control.value === null) {
                return null;
            }
            if (isNaN(control.value) || Number(control.value) > max ||
                (!inclusive && Number(control.value) === max)) {
                return {
                    maxValueValidator: errorMessage
                };
            }
            return null;
        };
    }

    static numericRangeValidator = (
        minValue: number,
        maxValue: number,
        allowZero?: boolean,
        inclusive?: boolean,
        errorMessage?: string) => {
        return (control: AbstractControl) => {
            if (control.value === null) {
                return null;
            }
            if (allowZero && control.value === 0) {
                return null;
            }
            // Default to inclusive
            if (!inclusive) {
                inclusive = true;
            }
            const num = +control.value;
            if (isNaN(control.value) || !(num <= maxValue && num >= minValue) ||
                (!inclusive && (num === maxValue || num === minValue))) {
                return {
                    rangeValueValidator: errorMessage
                };
            }
            return null;
        };
    }

    static patternValidator = (pattern: string, errorMessage: string) => {

        return (control: AbstractControl) => {
            if (control.value) {
                const regex = new RegExp(`^${pattern}$`);
                const value = <string>control.value;
                if (!regex.test(value)) {
                    return {
                        patternValidator: errorMessage
                    };
                }
            }
            return null;
        };
    }

    static cannotContainSpace = (errorMessage: string) => {
        return (control: AbstractControl) => {
            if (control.value) {

                if ((control.value as string).indexOf(' ') >= 0) {
                    return {
                        cannotContainSpace: errorMessage
                    };
                }
            }
            return null;
        };
    }
    static restrictPlusandMinuseValidator = (errorMessage: string) => {

        return (control: AbstractControl) => {
            if (control.value) {
                if ((control.value).toString().indexOf('-') >= 0 || (control.value).toString().indexOf('+') >= 0) {
                    return {
                        restrictPlusandMinuseValidator: errorMessage
                    };
                }
            }
            return null;
        };
    }

    static requiredValidator = (errorMessage: string | number) => {
        return (control: AbstractControl) => {
            const val: string = control.value;
            if (val == null || val.length === 0) {
                return {
                    requiredValidator: errorMessage
                };
            }
            return null;
        };
    }
    // static cannotContainSpace(control: AbstractControl) : ValidationErrors | null {
    //     if((control.value as string).indexOf(' ') >= 0){
    //         return {cannotContainSpace: true}
    //     }

    //     return null;
    // }
    static duplicateCheck = (compereValue: any, errorMessage: string | number) => {
        return (control: AbstractControl) => {
            const val: string = control.value;
            if (control.value === null) {
                return null;
            }
            if (val == compereValue) {
                return {
                    duplicateCheck: errorMessage
                };
            }
            return null;
        };
    }

    static minLengthValidator = (minLength: any, errorMessage: string | number) => {
        return (control: AbstractControl) => {
            const val: string = control.value;
            if (control.value === null || control.value == "") {
                return null;
            }
            if (minLength > val.length) {
                return {
                    minLengthValidator: errorMessage
                };
            }
            return null;
        };
    }

    static maxDateValidator = (maxDate: Date, inclusive: boolean, errorMessage: string) => {
        return (control: AbstractControl) => {
            if ((new Date(control.value) > new Date(maxDate)) || (!inclusive && (new Date(control.value) == new Date(maxDate)))) {
                return {
                    maxDateValidator: errorMessage
                };
            }
            return null;
        };
    }
    static minDateValidator = (minValue: Date, inclusive: boolean, errorMessage: string) => {
        return (control: AbstractControl) => {
            if ((new Date(control.value) < new Date(minValue)) || (!inclusive && (new Date(control.value) == new Date(minValue)))) {
                return {
                    minDateValidator: errorMessage
                };
            }
            return null;
        };
    }



}
