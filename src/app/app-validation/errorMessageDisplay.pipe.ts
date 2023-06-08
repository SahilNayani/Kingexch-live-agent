import { Pipe, PipeTransform } from '@angular/core';
@Pipe({
    name: 'DisplayErrorMessage'
})
export class InsertValidationErrorMessagePipe implements PipeTransform {
    transform(object: any): string {
        let value = ''
        for (var propName in object) {
            if (object.hasOwnProperty(propName)) {
                value = object[propName];
            }
        }
        return value;
    }
}
