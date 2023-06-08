import { Pipe, PipeTransform } from '@angular/core';
@Pipe({
    name: 'search'
})
export class SearchPipe implements PipeTransform {
    transform(searchArray: any[], searchInput: string, matchingParameter: string): any[] {
        if (!searchInput) {
            return searchArray;
        }
        searchInput = searchInput.toLowerCase();

        let array = searchArray.filter(
            x => x[matchingParameter].toLowerCase().includes(searchInput)
        )
        return array
    }
} 