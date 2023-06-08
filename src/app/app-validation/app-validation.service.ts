import { Injectable } from '@angular/core';
import { FormGroup, ValidatorFn, AbstractControl } from '@angular/forms';
import * as ValidationRules from './app-validation-rules.json'
export type validationType = 'numericMinValueValidator' | 'numberValidator' | 'numericMaxValueValidator' | 'minLengthValidator' | 'dateMinValueValidator'
    | 'numericRangeValidator' | 'patternValidator' | 'restrictPlusandMinuseValidator' | 'cannotContainSpace' | 'requiredValidator' | 'duplicateCheck' | 'dateMaxValueValidator'
export interface IValidator {
    type: validationType;
    isWarning?: boolean; // Not implemented on the server yet
}
export interface IValidationRules {
    properties: Array<{
        fieldName: string,
        rules: Array<IValidator>
    }>;
}
interface IValidationRule {
    errorMessage: string;
}

export interface INumberValidator extends IValidator {
    type: 'numberValidator';
    numberValidator: IValidationRule;
}
export interface INumericMinValueValidator extends IValidator {
    type: 'numericMinValueValidator';
    numericMinValueValidator: {
        minValue: number,
        inclusive: boolean,
        errorMessage: string
    };
}
export interface INumericMaxValueValidator extends IValidator {
    type: 'numericMaxValueValidator';
    numericMaxValueValidator: {
        maxValue: number,
        inclusive: boolean,
        errorMessage: string
    };
}

export interface IduplicateCheck extends IValidator {
    type: 'duplicateCheck';
    duplicateCheck: {
        compereValue: any,
        errorMessage: string
    };
}
export interface INumericRangeValidator extends IValidator {
    type: 'numericRangeValidator';
    numericRangeValidator: {
        minValue: number,
        maxValue: number,
        allowZero: boolean,
        inclusive: boolean,
        errorMessage: string
    };
}
export interface IPatternValidator extends IValidator {
    type: 'patternValidator';
    patternValidator: {
        pattern: string,
        errorMessage: string
    };
}
export interface IrestrictPlusandMinuseValidator extends IValidator {
    type: 'restrictPlusandMinuseValidator';
    restrictPlusandMinuseValidator: {
        errorMessage: string
    };
}
export interface IcannotContainSpace extends IValidator {
    type: 'cannotContainSpace';
    cannotContainSpace: {
        errorMessage: string
    };
}
export interface IRequiredValidator extends IValidator {
    type: 'requiredValidator';
    requiredValidator: IValidationRule;
}
export interface ICurrentControlValidators {
    controlName: string;
    control: AbstractControl;
    validators: Array<ValidatorFn>;
}
export interface IDateMinValueValidator extends IValidator {
    type: 'dateMinValueValidator';
    dateMinValueValidator: {
        minValue: Date,
        inclusive: boolean,
        errorMessage: string
    };
}

export interface IDateMaxValueValidator extends IValidator {
    type: 'dateMaxValueValidator';
    dateMaxValueValidator: {
        maxValue: Date,
        inclusive: boolean,
        errorMessage: string
    };
}
export interface IminLengthValidator extends IValidator {
    type: 'minLengthValidator';
    minLengthValidator: {
        minLength: number,
        errorMessage: string
    };
}
import { ValidatorControls } from './validation-controls.directive';

@Injectable({
    providedIn: 'root'
})
export class AppValidationService {
    validationRules: any = ValidationRules
    constructor() { }

    applyValidationRulesToFromGroup(formGroup: FormGroup, componentName: any) {
        let validationRules: IValidationRules = {} as any;
        return new Promise<Array<ICurrentControlValidators>>((resolve) => {
            validationRules = this.validationRules.default
            resolve(this.addRulesToControls(formGroup, validationRules[componentName]));
        });
    }

    // this function will build validation rules to fieldName as per the JSON Data 
    protected addRulesToControls(formGroup: FormGroup, validationRules) {
        const controlValidators = [];
        if (validationRules) {
            // here we are repeating for all jsondata fields and not on form controls
            // because the form may also have controls which doesn not require validators
            for (const prop of validationRules) {
                //"this.buildFieldValidators" function will return the each validator AbstractControl function
                const validatorFunctionArray = this.buildFieldValidators(prop.rules);

                if (validatorFunctionArray.length > 0) {
                    // storing each field validator and control functions in "validators",and pushing them to "controlValidators"
                    const validators = this.applyValidatorToControl(formGroup, prop.fieldName, validatorFunctionArray);
                    if (validators) {
                        controlValidators.push(validators);
                    }
                }
            }
        }
        return controlValidators;
    }

    private buildFieldValidators(rules: Array<IValidator>): any[] {
        const validatorFunctionArray: Array<Function> = [];
        for (const rule of rules) {
            switch (rule.type) {
                case 'numberValidator':
                    validatorFunctionArray.push(ValidatorControls.numberValidator((<INumberValidator>rule).numberValidator.errorMessage));
                    break;
                case 'numericMinValueValidator':
                    validatorFunctionArray.push(ValidatorControls.minValueValidator(
                        (<INumericMinValueValidator>rule).numericMinValueValidator.minValue,
                        (<INumericMinValueValidator>rule).numericMinValueValidator.inclusive,
                        (<INumericMinValueValidator>rule).numericMinValueValidator.errorMessage));
                    break;
                case 'numericMaxValueValidator':
                    validatorFunctionArray.push(ValidatorControls.maxValueValidator(
                        (<INumericMaxValueValidator>rule).numericMaxValueValidator.maxValue,
                        (<INumericMaxValueValidator>rule).numericMaxValueValidator.inclusive,
                        (<INumericMaxValueValidator>rule).numericMaxValueValidator.errorMessage));
                    break;
                case 'numericRangeValidator':
                    validatorFunctionArray.push(ValidatorControls.numericRangeValidator(
                        (<INumericRangeValidator>rule).numericRangeValidator.minValue,
                        (<INumericRangeValidator>rule).numericRangeValidator.maxValue,
                        (<INumericRangeValidator>rule).numericRangeValidator.allowZero,
                        (<INumericRangeValidator>rule).numericRangeValidator.inclusive,
                        (<INumericRangeValidator>rule).numericRangeValidator.errorMessage));
                    break;
                case 'patternValidator':
                    validatorFunctionArray.push(ValidatorControls.patternValidator(
                        (<IPatternValidator>rule).patternValidator.pattern,
                        (<IPatternValidator>rule).patternValidator.errorMessage));
                    break;
                case 'restrictPlusandMinuseValidator':
                    validatorFunctionArray.push(ValidatorControls.restrictPlusandMinuseValidator(
                        (<IrestrictPlusandMinuseValidator>rule).restrictPlusandMinuseValidator.errorMessage));
                    break;
                case 'cannotContainSpace':
                    validatorFunctionArray.push(ValidatorControls.cannotContainSpace(
                        (<IcannotContainSpace>rule).cannotContainSpace.errorMessage));
                    break;
                case 'requiredValidator':
                    validatorFunctionArray.push(ValidatorControls.requiredValidator((<IRequiredValidator>rule).requiredValidator.errorMessage));
                    break;
                case 'minLengthValidator':
                    validatorFunctionArray.push(ValidatorControls.minLengthValidator(
                        (<IminLengthValidator>rule).minLengthValidator.minLength,
                        (<IminLengthValidator>rule).minLengthValidator.errorMessage));
                    break;
                case 'duplicateCheck':
                    validatorFunctionArray.push(ValidatorControls.duplicateCheck(
                        (<IduplicateCheck>rule).duplicateCheck.compereValue,
                        (<IduplicateCheck>rule).duplicateCheck.errorMessage));
                    break;
                case 'dateMaxValueValidator':
                    validatorFunctionArray.push(ValidatorControls.maxDateValidator(
                        (<IDateMaxValueValidator>rule).dateMaxValueValidator.maxValue,
                        (<IDateMaxValueValidator>rule).dateMaxValueValidator.inclusive,
                        (<IDateMaxValueValidator>rule).dateMaxValueValidator.errorMessage));
                    break;
                case 'dateMinValueValidator':
                    validatorFunctionArray.push(ValidatorControls.minDateValidator(
                        (<IDateMinValueValidator>rule).dateMinValueValidator.minValue,
                        (<IDateMinValueValidator>rule).dateMinValueValidator.inclusive,
                        (<IDateMinValueValidator>rule).dateMinValueValidator.errorMessage));
                    break;
            }
        }

        return validatorFunctionArray;
    }

    // this function will apply the validators to each formcontrol 
    private applyValidatorToControl(formGroup: FormGroup, controlName: string,
        validatorFunctionArray: any[]): ICurrentControlValidators {
        const fromControl = formGroup && formGroup.controls ? formGroup.controls[controlName] : null;
        if (fromControl) {
            // if formcontrol value is not null set validators to the formcontrol 
            fromControl.setValidators(validatorFunctionArray);
            fromControl.updateValueAndValidity();
            return {
                controlName: controlName,
                control: fromControl,
                validators: validatorFunctionArray
            };
        }
        return null;
    }

    markFormGroupTouched(formGroup: FormGroup) {
        (<any>Object).values(formGroup.controls).forEach(control => {
            control.markAsTouched();

            if (control.controls) {
                this.markFormGroupTouched(control);
            }
        });
    }
}